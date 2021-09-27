import { Schema } from './types'
import { defineComponent, PropType, provide, reactive } from 'vue'
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'

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
  },
  name: 'SchemaForm',
  setup(props, { slots, emit, attrs }) {
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
    })

    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
        />
      )
    }
  },
})
