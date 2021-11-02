import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

import JsonSchemaForm, { NumberField, StringField } from '../../lib'
import TestComponent from '../utils/TestComponent'

describe('ObjectFiled', () => {
  let schema: any
  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
    }
  })

  it('should render properties to correct fields', async () => {
    const wrapper = shallowMount(TestComponent, {
      props: {
        schema,
        value: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange: () => { },
      },
    })
    const strField = wrapper.findComponent(StringField)
    const numberField = wrapper.findComponent(NumberField)
    expect(strField.exists()).toBeTruthy()
    expect(numberField.exists()).toBeTruthy()
  })
  it('should change value when sub fields trigger onChange', async () => {
    let value: any = {
      name: '123',
    }
    const wrapper = shallowMount(TestComponent, {
      props: {
        schema,
        value: value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange: (v: any) => {
          value = v
        },
      },
    })
    const strField = wrapper.findComponent(StringField)
    // const numberField = wrapper.findComponent(NumberField)
    await strField.props('onChange')(undefined)
    expect(value.name).toEqual(undefined)
  })
})
