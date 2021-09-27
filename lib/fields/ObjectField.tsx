import { defineComponent, h, inject } from 'vue'

import { FiledPropsDefine } from '../types'
// import SchemaItems from 'lib/SchemaItems'
import { SchemaFormContextKey } from '../context'

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

export default defineComponent({
  name: 'ObjectField',
  props: FiledPropsDefine,
  setup(props, { slots, emit, attrs }) {
    const context: any = inject(SchemaFormContextKey)

    console.log(context)

    return () => {
      const { SchemaItem } = context
    }
  },
})
