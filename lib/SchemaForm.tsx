import { Schema, SchemaTypes } from './types'
import { defineComponent, h, PropType } from 'vue'

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
    return () => {
      const schema = props.schema
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const type = schema?.type
      switch (type) {
        case SchemaTypes.STRING:
          return <input type="text" />
          break

        default:
          break
      }
      return h('div', 'this is SchemaForm')
    }
  },
})
