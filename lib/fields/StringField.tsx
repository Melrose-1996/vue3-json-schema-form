// 渲染类型为 string 类型的节点的
import { defineComponent } from 'vue'
import { getWidget } from '../theme'
import { FiledPropsDefine, CommonWidgetNames } from '../types'

export default defineComponent({
  name: 'StringField',
  props: FiledPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = getWidget(CommonWidgetNames.TextWidget)
    return () => {
      const { rootSchema, onChange, errorSchema, ...rest } = props
      const TextWidget = TextWidgetRef.value
      // 在 props 里面有相同的 keys 会 mergeProps 合并
      return (
        <TextWidget
          {...rest}
          onChange={handleChange}
          errors={errorSchema.__errors}
        />
      )
      // return <input type="text" value={value as any} onInput={handleChange} />
    }
  },
})
