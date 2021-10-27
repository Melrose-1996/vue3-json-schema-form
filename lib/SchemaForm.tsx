import { Schema, Theme } from './types'
import {
  defineComponent,
  PropType,
  provide,
  reactive,
  Ref,
  watch,
  shallowRef,
  watchEffect,
  ref,
} from 'vue'
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'

import { validateFormData, ErrorSchema } from './validator'

// 这个 options 实际上就是创建 ajv 实例的选项
import Ajv, { Options } from 'ajv'

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    valid: boolean
  }>
}

// 使用 ajvErrors 必须要使用的配置
const defaultAjvOptions: Options = {
  allErrors: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // jsonPointers: true,
}

export default defineComponent({
  props: {
    // 核心功能就是通过返回过来的 schema 的字段也就是它的一些特性，从而生成对应的表单
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    // 自定义校验规则
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   require: true,
    // },
  },
  name: 'SchemaForm',
  setup(props: any, { slots, emit, attrs }) {
    // 注意最好不要直接传 onChange 这个函数，而是做了处理之后再使用
    const handleChange = (v: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props.onChange(v)
    }

    // 作为所有节点的父节点，只需要向后面的节点提供一个 key，甚至可以提供组件节点
    // 只有把 context 设置成响应式的对象，我们才能从后续的 watchEffect 这个 api 里面时刻监听着组件的变化( watchEffect 只会去监听响应式数据的变化)
    const context = reactive({
      SchemaItem,
      // theme: props.theme,
    })

    // 不需要考虑 key 变化的情况，只需要考虑整体变化的情况就可以了
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,

        ...props.ajvOptions,
      })
    })

    // 创建 ajv 的实例对象

    // 通过 computed 实现 props 动态变化实现

    provide(SchemaFormContextKey, context)

    // 存储校验的信息
    const validateResolveRef = ref()
    const validateIndex = ref(0)

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) doValidate()
      },
      {
        deep: true,
      },
    )

    // 用于校验 result 方法，并把 result 放回出去
    async function doValidate() {
      console.log('start validate ----->')
      const index = (validateIndex.value += 1)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )
      if (index !== validateIndex.value) return
      console.log('end validate ----->')
      errorSchemaRef.value = result.errorSchema
      validateResolveRef.value(result)
      validateResolveRef.value = undefined
    }

    // 监听到父组件的事件
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              console.log('-------------->')

              return new Promise((resolve) => {
                validateResolveRef.value = resolve
                doValidate()
              })

              // 表单校验
              // const valid = validatorRef.value.validate(
              //   props.schema,
              //   props.value,
              // ) as boolean

              // const result = await validateFormData(
              //   validatorRef.value,
              //   props.value,
              //   props.schema,
              //   props.locale,
              //   props.customValidate,
              // )

              // errorSchemaRef.value = result.errorSchema

              // return result
            },
          }
        }
      },
      { immediate: true },
    )

    return () => {
      const { schema, value } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          errorSchema={errorSchemaRef.value || {}}
        />
      )
    }
  },
})
