// 渲染类型为 number 类型的节点的
import { FiledPropsDefine } from '../types'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'NumberField',
  props: FiledPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    const handleChange = (e: any) => {
      const value = e.target.value
      const num = Number(value)
      props.onChange(Number.isNaN(num) ? undefined : num)
    }
    return () => {
      const { value } = props
      return <input type="number" value={value as any} onInput={handleChange} />
    }
  },
})
