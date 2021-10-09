import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

import JsonSchemaForm, { NumberField, StringField, ArrayField, SelectionWidget } from '../../lib'

describe('ArrayFiled', () => {
    it('should render multi type', () => {
        const wrapper = shallowMount(JsonSchemaForm, {
            props: {
                schema: {
                    type: 'array',
                    items: [{ type: 'string' }, { type: 'number' }]
                },
                value: [],
                onChange: () => { }
            }
        })

        const arrField = wrapper.findComponent(ArrayField)
        const strField = arrField.findComponent(StringField)
        const numField = arrField.findComponent(NumberField)

        expect(strField.exists()).toBeTruthy()
        expect(numField.exists()).toBeTruthy()
    })

    it('should render single type', () => {
        const wrapper = shallowMount(JsonSchemaForm, {
            props: {
                schema: {
                    type: 'array',
                    items: { type: 'string' }
                },
                value: ['1', '2'],
                onChange: () => { }
            }
        })

        const arrField = wrapper.findComponent(ArrayField)
        const strFields = arrField.findAllComponents(StringField)
        // const numField = arrField.findComponent(NumberField)

        expect(strFields.length).toBe(2)
        expect(strFields[0].props('value')).toBe('1')
        // expect(numField.exists()).toBeTruthy()
    })

    it('should render single type', () => {
        const wrapper = shallowMount(JsonSchemaForm, {
            props: {
                schema: {
                    type: 'array',
                    enum: ['1', '2', '3']
                },
                value: [],
                onChange: () => { }
            }
        })

        const arrField = wrapper.findComponent(ArrayField)
        const selectFields = arrField.findComponent(SelectionWidget)

        expect(selectFields.exists()).toBeTruthy()
    })
})
