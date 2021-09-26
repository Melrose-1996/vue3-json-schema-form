// 渲染类型为 string 类型的节点的
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'StringField',
  setup(pros, { slots, emit, attrs }) {
    return () => h('div', 'this is StringField')
  },
})
