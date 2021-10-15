import { defineComponent, ref, Ref, reactive, watchEffect } from 'vue'
import { createUseStyles } from 'vue-jss'

import MonacoEditor from './components/MonacoEditor'
// 这些是 json.schema 的例子（其中的结构也是有固定的结构的）
import demos from './demos'
import SchemaForm from '../lib'
import themeDefault from '../lib/theme-default/index'
import { ThemeProvider } from '../lib/index'

// TODO: 在lib中export
type Schema = any
type UISchema = any

function toJson(data: any) {
  return JSON.stringify(data, null, 2)
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    // uiAndValue 内部所有的样式都是一样
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    // .menuButton:hover
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
})

export default defineComponent({
  setup() {
    const selectedRef: Ref<number> = ref(0)

    const demo: {
      // schema data uiSchema 对应了三个编辑器（对象）
      // schemaCode dataCode uiSchemaCode 对应的编辑器的内容 JSON 化之后的数据（字符串）
      schema: Schema | null
      data: any
      uiSchema: UISchema | null
      schemaCode: string
      dataCode: string
      uiSchemaCode: string
      customValidate: ((d: any, e: any) => void) | undefined
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
      customValidate: undefined,
    })

    watchEffect(() => {
      const index = selectedRef.value
      const d: any = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJson(d.schema)
      demo.dataCode = toJson(d.default)
      demo.uiSchemaCode = toJson(d.uiSchema)
      demo.customValidate = d.customValidate
    })

    const methodRef: Ref<any> = ref()

    //  对于表单校验而新进行的 ref 校验

    const contextRef = ref()
    const classesRef = useStyles()

    const validateForm = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // contextRef.value.doValidate().then((result) => {
      //   console.log('result', result)
      // })
      contextRef.value.doValidate()
    }
    const handleChange = (v: any) => {
      demo.data = v
      demo.dataCode = toJson(v)
    }

    // 代码编辑器一旦被触发，同是如果数据发生了变化
    function handleCodeChange(
      filed: 'schema' | 'data' | 'uiSchema',
      value: string,
    ) {
      try {
        const json = JSON.parse(value)
        demo[filed] = json
        ;(demo as any)[`${filed}Code`] = value
      } catch (err) {
        // some thing
      }
    }

    const handleSchemaChange = (v: string) => handleCodeChange('schema', v)
    const handleDataChange = (v: string) => handleCodeChange('data', v)
    const handleUISchemaChange = (v: string) => handleCodeChange('uiSchema', v)

    return () => {
      const classes = classesRef.value
      const selected = selectedRef.value

      return (
        // <StyleThemeProvider>
        // <VJSFThemeProvider theme={theme as any}>
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
          <div class={classes.content}>
            {/* 左边的 code 区域 */}
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>

            <div class={classes.form}>
              {/* 右边是我们的 schema 区域 */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/*  @ts-ignore */}
              <ThemeProvider theme={themeDefault}>
                <SchemaForm
                  schema={demo.schema}
                  onChange={handleChange}
                  value={demo.data}
                  contextRef={contextRef}
                />
              </ThemeProvider>
              {/* <SchemaForm
                schema={demo.schema}
                uiSchema={demo.uiSchema || {}}
                onChange={handleChange}
                value={demo.data}
                contextRef={contextRef}
                customValidate={demo.customValidate}
              />
              <button onClick={validateForm}>校验</button> */}
              <button onClick={validateForm}>校验</button>
            </div>
          </div>
        </div>
        // </VJSFThemeProvider>
        // </StyleThemeProvider>
      )
    }
  },
})
