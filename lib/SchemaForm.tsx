import { Schema, Theme, UISchema, CustomFormat } from './types'
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
  computed,
} from 'vue'
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'

import { validateFormData, ErrorSchema } from './validator'

// 这个 options 实际上就是创建 ajv 实例的选项
import Ajv, { Options } from 'ajv'
import { CommonWidgetDefine } from 'lib'

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
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat | CustomFormat[]>,
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

    if (props.customFormats) {
      const customFormats = Array.isArray(props.customFormats)
        ? props.customFormats
        : [props.customFormats]
      customFormats.forEach((format: any) => {
        validatorRef.value.addFormat(format.name, format.definition)
      })
    }

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
            },
          }
        }
      },
      { immediate: true },
    )

    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce((result: any, format: any) => {
          // 这里就拿到了 format 对应组件的 map
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetDefine })
      } else {
        return {}
      }
    })

    const context: any = {
      SchemaItem,
      formatMapRef,
    }

    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
        />
      )
    }
  },
})
