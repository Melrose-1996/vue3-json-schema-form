// 根据不同的类型来把对应渲染这个 schema 的工作交给对应的那个组件来做
import { defineComponent } from 'vue'
import NumberField from './fields/NumberField'
// import StringField from './fields/StringField'
import { SchemaTypes, FiledPropsDefine } from './types'
import StringField from './fields/StringField.vue'

export default defineComponent({
  name: 'SchemaItems',
  props: FiledPropsDefine,
  setup(props, { slots, emit, attrs }) {
    return () => {
      const { schema } = props
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
        default:
          console.warn(`${type} is not supported`)

          break
      }
      return <Component {...props} />
    }
  },
})
