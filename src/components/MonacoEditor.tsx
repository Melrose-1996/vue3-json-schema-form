// monaco-editor
// vscode 用的这块编辑的区域实际上用的就是这个 monaco-editor,也是微软开源的代码编辑器的一个 js 的项目，如果最终要在页面展示这个 monaco-editor，展现 schema， ui-schema 还有 value ，这种对于我们这库的使用者想要去验证一些 schema 的展现的时候，就可以直接在这个页面上面去编辑它的 schema 以及 ui-schema ,及时的看到一种效果，对用户体验比较好一点。

// vue-jss
// css in js，可以直接在 js 中去写 css 的代码，并且可以给每个组件定义 css，从而防止了 css 和 js 产生割裂感

/* eslint no-use-before-define: 0 */

import {
  defineComponent,
  ref,
  onMounted,
  watch,
  onBeforeUnmount,
  shallowRef,
} from 'vue'

import * as Monaco from 'monaco-editor'

import type { PropType } from 'vue'
import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 5,
  },
  title: {
    backgroundColor: '#eee',
    padding: '10px 0',
    paddingLeft: 20,
  },
  code: {
    flexGrow: 1,
  },
})

export default defineComponent({
  props: {
    code: {
      type: String as PropType<string>,
      required: true,
    },
    onChange: {
      type: Function as PropType<
        (value: string, event: Monaco.editor.IModelContentChangedEvent) => void
      >,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    // must be shallowRef, if not, editor.getValue() won't work
    const editorRef = shallowRef()

    const containerRef = ref()

    let _subscription: Monaco.IDisposable | undefined
    let __prevent_trigger_change_event = false

    onMounted(() => {
      // 创建了一个 editor 而这个 editor 便是一个代码编辑器
      const editor = (editorRef.value = Monaco.editor.create(
        containerRef.value,
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: props.code,
          language: 'json',
          formatOnPaste: true,
          tabSize: 2,
          minimap: {
            enabled: false,
          },
        },
      ))
      // 会根据这个代码的内容的变化而实时的去返回给我们使用这个组件
      _subscription = editor.onDidChangeModelContent((event) => {
        if (!__prevent_trigger_change_event) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          props.onChange(editor.getValue(), event)
        }
      })
    })

    onBeforeUnmount(() => {
      if (_subscription) _subscription.dispose()
    })

    watch(
      () => props.code,
      (v) => {
        const editor = editorRef.value
        const model = editor.getModel()
        if (v !== model.getValue()) {
          editor.pushUndoStop()
          __prevent_trigger_change_event = true
          // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: v,
              },
            ],
          )
          editor.pushUndoStop()
          __prevent_trigger_change_event = false
        }
        // if (v !== editorRef.value.getValue()) {
        //   editorRef.value.setValue(v)
        // }
      },
    )

    const classesRef = useStyles()

    return () => {
      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.title}>
            <span>{props.title}</span>
          </div>
          <div class={classes.code} ref={containerRef}></div>
        </div>
      )
    }
  },
})
