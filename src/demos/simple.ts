export default {
  // 按钮显示的名字
  name: 'Simple',
  // jsonSchema
  schema: {
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        title: 'firstName',
        type: 'string',
        default: 'Chuck',
      },
      lastName: {
        title: 'lastName',
        type: 'string',
      },
      telephone: {
        title: 'telephone',
        type: 'string',
        minLength: 10,
      },
      staticArray: {
        title: 'staticArray',
        type: 'array',
        items: [
          {
            title: 'staticArray1',
            type: 'string',
          },
          {
            title: 'staticArray2',
            type: 'number',
          },
        ],
      },
      singleTypeArray: {
        title: 'singleTypeArray',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              title: 'singleTypeArray1',
              type: 'string',
            },
            age: {
              title: 'singleTypeArray2',
              type: 'number',
            },
          },
        },
      },
      multiSelectArray: {
        title: 'multiSelectArray',
        type: 'array',
        items: {
          type: 'string',
          enum: ['123', '456', '789'],
        },
      },
    },
  },
  // uiSchema
  uiSchema: {
    title: 'A registration form',
    properties: {
      firstName: {
        title: 'First name',
      },
      lastName: {
        title: 'Last name',
      },
      telephone: {
        title: 'Telephone',
      },
    },
  },
  default: {
    firstName: 'Chuck',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
    singleTypeArray: [{ name: 'jokcy', age: 12 }],
  },
}
