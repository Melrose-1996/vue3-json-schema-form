// 渲染类型为 number 类型的节点的
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'NumberField',
  setup(pros, { slots, emit, attrs }) {
    return () => h('div', 'this is NumberField')
  },
})
