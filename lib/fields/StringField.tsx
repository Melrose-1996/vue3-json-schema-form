// 渲染类型为 string 类型的节点的
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'StringField',
  setup(props: any, { slots, emit, attrs }) {
    const handleChange = (e: any) => {
      props.onChange(e.target.value)
    }
    return () => {
      const { value } = props
      return <input type="text" value={value as any} onInput={handleChange} />
    }
  },
})
