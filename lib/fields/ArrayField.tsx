import { defineComponent, h } from 'vue'
import { FiledPropsDefine } from '../types'
import { useVJSFContext } from '../context'

/**
 * {
 *  items: { type: string},
 * }
 *
 * 该数组有两项，第一项是 字符串类型 第二种是 数字类型
 * {
 * items: [
 *   { type: string, }
 *   { type: number, }
 * ]
 * }
 *
 * 这也是个数组，只是每个数组的选项都是可选的(要么是1， 要么是2)
 * {
 *  items: { type: string, enum: ['1', '2']},
 * }
 */

export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props, { slots, emit, attrs }) {
    const context = useVJSFContext()
    return () => {
      const { SchemaItem } = context
    }
  },
})
