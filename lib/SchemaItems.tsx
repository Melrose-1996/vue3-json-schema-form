// 根据不同的类型来把对应渲染这个 schema 的工作交给对应的那个组件来做
import { defineComponent, computed } from 'vue'
import NumberField from './fields/NumberField.vue'
// import StringField from './fields/StringField'
import { SchemaTypes, FiledPropsDefine } from './types'
import StringField from './fields/StringField.vue'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'

import { retrieveSchema } from './utils'

export default defineComponent({
  name: 'SchemaItems',
  props: FiledPropsDefine,
  setup(props, { slots, emit, attrs }) {
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return retrieveSchema(schema, rootSchema, value)
    })
    return () => {
      const { schema } = props
      const retrieveSchema = retrievedSchemaRef.value
      // TODO: 如果 type 需要指定，我们需要猜测 type
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const type = schema.type
      let Component: any
      switch (type) {
        case SchemaTypes.STRING:
          Component = StringField
          break
        case SchemaTypes.NUMBER:
          Component = NumberField
          break
        case SchemaTypes.OBJECT:
          Component = ObjectField
          break
        case SchemaTypes.ARRAY:
          Component = ArrayField
          break
        default:
          console.warn(`${type} is not supported`)

          break
      }
      // 注意由于 StringField 是 .vue 的文件，该文件并不是 ts 所能解析的类型
      // <StringField />
      return <Component {...props} schema={retrieveSchema} />
    }
  },
})
