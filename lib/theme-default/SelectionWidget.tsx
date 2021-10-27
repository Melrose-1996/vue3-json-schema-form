import { defineComponent, ref, PropType, watch } from 'vue'

import { withFormItem } from './FormItem'

import { SelectionWidgetPropsDefine } from '../types'

import type { SelectionWidgetDefine } from '../types'

const SelectionWidget: SelectionWidgetDefine = defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    const currentValueRef = ref(props.value)
    // 当输入框的值发生了变化需要复制给 value
    watch(currentValueRef, (newV, oldV) => {
      if (newV !== props.value) {
        props.onChange(newV)
      }
    })
    // 同时如果 value 值发生了变化也要将输入框的值变化
    watch(
      () => props.value,
      (newV, oldV) => {
        if (newV !== currentValueRef.value) {
          currentValueRef.value = newV
        }
      },
    )
    return () => {
      const { options } = props
      return (
        <select multiple={true} v-model={currentValueRef.value}>
          {options.map((op: any) => (
            <option value={op.value}>{op.key}</option>
          ))}
        </select>
      )
    }
  },
})

export default withFormItem(SelectionWidget)
