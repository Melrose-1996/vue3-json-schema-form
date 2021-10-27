import { defineComponent } from 'vue'
import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  container: {},
  label: {
    display: 'block',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px 0',
    padding: 0,
    paddingLeft: 20,
  },
})

const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props: any, { slots }) {
    const classRef = useStyles()
    return () => {
      const { schema, errors } = props
      const classes = classRef.value
      return (
        <div>
          <label class={classes.label}>{schema.title}</label>
          {slots.default?.()}
          <ul class={classes.errorText}>
            {errors?.map((err: string) => (
              <li>{err}</li>
            ))}
          </ul>
        </div>
      )
    }
  },
})

// HOC: Higher Order Component: 高阶组件
// 这是是通过 withFormItem 函数来包裹一个 FormItem 组件，返回的组件实际上跟 TextWidget 是类似的。这样使得组件之间存在结偶，即不管 FormItem 组件如何进行修改，都不会影响 TextWidget，而所有用到 FormItem 组件的地方都会进行修改。
// component API： 只能抽离非渲染逻辑
// HOC：可抽离非渲染逻辑
// attrs 传递未在 props 上声明的所有属性，一般就用于没有被 props 申明却想使用的属性
export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    // 存在具名插槽就需要使用这种方式去传递
    // 同样 ref 是获取的该组件的实例，而不是 widget 组件的实例
    setup(props, { attrs, slots }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs} slot={slots} />
          </FormItem>
        )
      }
    },
  }) as any
}

export default FormItem
