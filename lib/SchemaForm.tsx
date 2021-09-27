import { Schema, SchemaTypes } from './types'
import { defineComponent, h, PropType } from 'vue'
import SchemaItem from './SchemaItems'

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
