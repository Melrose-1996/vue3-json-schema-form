// 渲染类型为 number 类型的节点的
import { FiledPropsDefine, CommonWidgetNames } from '../types'
import { defineComponent, h } from 'vue'

import { getWidget } from '../theme'

export default defineComponent({
  name: 'NumberField',
  props: FiledPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)
    const handleChange = (v: string) => {
      // const value = e.target.value
      const num = Number(v)
      props.onChange(Number.isNaN(num) ? undefined : num)
    }

    return () => {
      const NumberWidget = NumberWidgetRef.value
      const { rootSchema, onChange, errorSchema, ...rest } = props
      // return <input type="number" value={value as any} onInput={handleChange} />
      return (
        <NumberWidget
          {...rest}
          onChange={handleChange}
          errors={errorSchema.__errors}
        />
      )
    }
  },
})
