const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv)

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
    name: { type: 'string', test: false },
  },
  required: ['foo'],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: 'abc@xxx.com',
  name: 'haha',
}

const valid = validate(data)
if (!valid) console.log(validate.errors)
