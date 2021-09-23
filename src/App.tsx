import { defineComponent, ref, Ref } from 'vue'

import MonacoEditor from './components/MonacoEditor'

import { createUseStyles } from 'vue-jss'

// 把 schema 这个对象转化成 string
function toJson(data: any) {
  // 需要传后续的两个参数
  return JSON.stringify(data, null, 2)
}

const schema = {
  type: 'string',
}

const useStyles = createUseStyles({
  editor: {
    minHeight: 400,
  },
})

export default defineComponent({
  // 主张通过 setup 返回一个函数，因为 setup 声明的 ref reactive computed ... 都是可以在 return 的组件函数里面去使用的
  setup() {
    const schemaRef: Ref<any> = ref(schema)

    const handleCodeChange = (code: string) => {
      let schema: any

      try {
        schema = JSON.parse(code)
      } catch (error) {
        console.log(error)
      }
      schemaRef.value = schema
    }
    const classesRef = useStyles()

    return () => {
      const classes = classesRef.value
      const code = toJson(schemaRef.value)

      return (
        <div>
          <MonacoEditor
            code={code}
            onChange={handleCodeChange}
            title="Schema"
            class={classes.editor}
          />
        </div>
      )
    }
  },
})
