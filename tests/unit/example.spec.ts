import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

import JsonSchemaForm, { NumberField } from '../../lib'

describe('JsonSchemaForm', () => {
  it('should render correct number field', async () => {
    let value = ''
    // 这里我们去渲染这个组件 wrapper ,我们是可以去找到一个 schemaItem 节点和 numberField 节点
    const wrapper = shallowMount(JsonSchemaForm, {
      props: {
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v: any) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    // 该组件是确认渲染的
    expect(numberField.exists()).toBeTruthy()
    const input = numberField.find('input')
    input.element.value = '123'
    input.trigger('input')
    // 当 onChange 事件触发了，value 是需要发生变化的
    // await numberField.props('onChange')('123')
    expect(value).toBe(123)
    // expect(wrapper.text()).toMatch(value)
  })
})
