import { defineComponent, PropType } from 'vue'
import { FiledPropsDefine, Schema, SelectionWidgetName } from '../types'
import { useVJSFContext } from '../context'
import { createUseStyles } from 'vue-jss'

import { getWidget } from '../theme'

// import SelectionWidget from '../widgets/Selection'
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

// 用 jss 调写样式
const useStyles = createUseStyles({
  container: {
    border: '1px soild #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})

// 用于排序的按钮操作
const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props: any, { slots }) {
    const classesRef = useStyles()

    const context = useVJSFContext()

    return () => {
      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button
              class={classes.action}
              onClick={() => props.onAdd(props.index)}
            >
              新增
            </button>
            <button
              class={classes.action}
              onClick={() => props.onDelete(props.index)}
            >
              删除
            </button>
            <button
              class={classes.action}
              onClick={() => props.onUp(props.index)}
            >
              上移
            </button>
            <button
              class={classes.action}
              onClick={() => props.onDown(props.index)}
            >
              下移
            </button>
          </div>
          {/* slots.default 是一个函数 */}
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props: any, { slots, emit, attrs }) {
    const context = useVJSFContext()
    // 针对于 multiType 函数的 handle 函数
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr[index] = v
      props.onChange(arr)
    }

    // const SelectionWidgetRef: any = SelectionWidgetNames.SelectionWidget

    const handleAdd = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr.splice(index + 1, 0, undefined)
      props.onChange(arr)
    }
    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr.splice(index, 1)
      props.onChange(arr)
    }
    const handleUp = (index: number) => {
      if (index === 0) return

      const { value } = props
      const arr = Array.isArray(value) ? value : []

      const item = arr.splice(index, 1)
      arr.splice(index - 1, 0, item[0])
      props.onChange(arr)
    }
    const handleDown = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      if (index === arr.length - 1) return
      const item = arr.splice(index, 1)
      arr.splice(index + 1, 0, item[0])
      props.onChange(arr)
    }

    const SelectionWidgetRef = getWidget(SelectionWidgetName.SelectionWidget)

    return () => {
      // const SelectionWidget = context.theme.widgets.SelectionWidget

      const SelectionWidget = SelectionWidgetRef.value

      const { SchemaItem } = context
      const { schema, rootSchema, value, errorSchema } = props
      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && schema.items.enum

      // const SelectionWidget = SelectionWidgetRef.value

      if (isMultiType) {
        const arr = Array.isArray(value) ? value : []
        return schema.items!.map((s: Schema, index: number) => (
          <SchemaItem
            schema={s}
            key={index}
            rootSchema={rootSchema}
            onChange={(v: any) => handleArrayItemChange(v, index)}
            value={arr[index]}
            errorSchema={errorSchema[index] || {}}
          />
        ))
      } else if (!isSelect) {
        // 不是单类型的渲染
        const arr = Array.isArray(value) ? value : []
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onUp={handleUp}
              onDown={handleDown}
            >
              <SchemaItem
                schema={schema.items as Schema}
                key={index}
                rootSchema={rootSchema}
                onChange={(v: any) => handleArrayItemChange(v, index)}
                value={v}
                errorSchema={errorSchema[index] || {}}
              />
            </ArrayItemWrapper>
          )
        })
      } else {
        const enumOptions = (schema.items as Schema).enum
        const options = enumOptions?.map((e) => ({
          key: e,
          value: e,
        }))
        return (
          <SelectionWidget
            options={options || []}
            value={props.value}
            onChange={props.onChange}
            errors={errorSchema.__errors}
          />
        )
      }

      return <div></div>
    }
  },
})
