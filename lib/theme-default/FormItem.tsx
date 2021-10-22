import { defineComponent } from 'vue'
import { CommonWidgetPropsDefine } from '../types'
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

export default defineComponent({
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
