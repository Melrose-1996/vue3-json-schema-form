import { CommonWidgetDefine, UISchema } from 'lib'
import {
  defineComponent,
  PropType,
  computed,
  provide,
  inject,
  ComputedRef,
  ref,
  ExtractPropTypes,
} from 'vue'
import {
  Theme,
  SelectionWidgetName,
  CommonWidgetNames,
  FiledPropsDefine,
} from './types'

import { isObject } from './utils'

import { useVJSFContext } from './context'

const THEME_PROVIDER_KEY = Symbol()

const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots, emit, attrs }) {
    const context = computed(() => props.theme)

    provide(THEME_PROVIDER_KEY, context)

    return () => slots.default && slots.default()
  },
})

export function getWidget<T extends SelectionWidgetName | CommonWidgetNames>(
  name: T,
  props: ExtractPropTypes<typeof FiledPropsDefine>,
) {
  // if (uiSchema?.widget && isObject(uiSchema.widget)) {
  //   return ref(uiSchema.widget as CommonWidgetDefine)
  // }
  const formContext = useVJSFContext() as any
  if (props) {
    const { schema, uiSchema } = props as any
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return ref(uiSchema.widget as CommonWidgetDefine)
    }
    if (schema.format) {
      if (formContext.formatMapRef?.[schema.format]) {
        return ref(formContext.formatMapRef?.[schema.format])
      }
    }
  }

  const context: ComputedRef<Theme> | undefined =
    inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY)

  if (!context) {
    throw new Error('vjsf theme must required')
  }

  const widgetRef = computed(() => {
    return context.value.widgets[name]
  })

  return widgetRef
}

export default ThemeProvider
