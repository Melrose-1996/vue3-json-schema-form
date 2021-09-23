const Ajv = require('ajv')
const addFormats = require('ajv-formats')

// 使用 ajv-errors 这个包的时候一定要在实例化 A
const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}
addFormat(ajv)

const localize = require('ajv-i18n')

require('ajv-errors')(ajv /*, {singleError: true} */)

// 注意这里是 addFormat 而不是 addFormats !!
// 注意 addFormat 这个功能是 ajv 提供的，并不是 json.schema 的标准，而是通过 ajv 进行的扩展，ajv 这个类库提供的功能
// ajv.addFormat('test', (data) => {
//   console.log(data, '-----------')
//   return data === 'haha'
// })
ajv.addKeyword({
  keyword: 'test',

  // ☆☆☆ macro function
  // 等同 name: { type: 'string', test: false, minLength: 10},
  macro() {
    return {
      minLength: 10,
    }
  },
})
const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string', format: 'email' },
    name: {
      type: 'string',
      test: false,
      errorMessage: {
        type: '必须是字符串',
        test: '长度不能小于10',
      },
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: 'abc@xxx.com',
  name: 11,
}

const valid = validate(data)
if (!valid) {
  // localize.zh(validate.errors)
  console.log(validate.errors)
}
