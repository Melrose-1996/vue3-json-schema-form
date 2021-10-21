import { defineComponent } from 'vue'

import { FiledPropsDefine } from '../types'
import { useVJSFContext } from '../context'
// import SchemaItems from 'lib/SchemaItems'
import { isObject } from '../utils'

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
}

// interface SchemaItemDefine {
//   DefineComponent<typeof FiledPropsDefine>
// }
//

export default defineComponent({
  name: 'ObjectField',
  props: FiledPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    // 有可能出现直接使用 ObjectField 而不去使用 SchemaForm，就有可能存在 undefined 的情况
    const context = useVJSFContext()

    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}
      // 如果我们最终的 field 是 undefined，实际上应该从该 value 里面删除这个值
      if (v === undefined) {
        delete value[key]
      } else {
        value[key] = v
      }
      props.onChange(value)
    }

    return () => {
      const { schema, rootSchema, value, errorSchema } = props as any

      const { SchemaItem } = context

      const properties = schema.properties || {}

      const currentValue: any = isObject(value) ? value : {}

      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          key={index}
          errorSchema={errorSchema[k] || {}}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ))
    }
  },
})
