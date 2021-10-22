import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { defineComponent } from 'vue'
import FormItem from './FormItem'

const TextWidget: CommonWidgetDefine = defineComponent({
  name: 'TextWidget',
  props: CommonWidgetPropsDefine,
  setup(props: any) {
    const handleChange = (e: any) => {
      const value = e.target.value
      e.target.value = props.value
      props.onChange(value)
    }
    return () => {
      return (
        <FormItem {...props}>
          <input
            type="text"
            value={props.value as any}
            onInput={handleChange}
          />
        </FormItem>
      )
    }
  },
})

export default TextWidget
