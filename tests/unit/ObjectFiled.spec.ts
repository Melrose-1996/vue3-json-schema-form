import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

import JsonSchemaForm, { NumberField, StringField } from '../../lib'

describe('ObjectFiled', () => {
    let schema: any
    beforeEach(() => {
        schema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                age: {
                    type: 'number'
                }
            }
        }
    })



    it('should render properties to correct fields', async () => {
        const wrapper = shallowMount(JsonSchemaForm, {
            props: {
                schema,
                value: {},
                onChange: () => { }
            }
        })
        const strField = wrapper.findComponent(StringField)
        const numberField = wrapper.findComponent(NumberField)
        expect(strField.exists()).toBeTruthy()
        expect(numberField.exists()).toBeTruthy()
    })
    it('should change value when sub fields trigger onChange', async () => {
        let value: any = {
            name: '123'
        }
        const wrapper = shallowMount(JsonSchemaForm, {
            props: {
                schema,
                value: value,
                onChange: (v: any) => { value = v }
            }
        })
        const strField = wrapper.findComponent(StringField)
        // const numberField = wrapper.findComponent(NumberField)
        await strField.props('onChange')(undefined)
        expect(value.name).toEqual(undefined)
    })
})
