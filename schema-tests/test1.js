// Node.js require:
const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const localize = require('ajv-i18n')
const addErrors = require('ajv-errors')

const ajv = new Ajv({
  allErrors: true,
}) // options can be passed, e.g. {allErrors: true}
addFormats(ajv)
addErrors(ajv)

/*ajv.addFormat('test', (data) => {
  return data === 'Hello World'
})*/

ajv.addKeyword({
  keyword: 'test',
  /*  validate: function fun (schema, data) {
      fun.errors = [
        {
          keyword: 'test',
          dataPath: '/name',
          schemaPath: '#/properties/name/test',
          params: {},
          message: 'hello error message'
        }

      ]
      return false
    },*/
  /*  compile (schema, parentSchema) {
      console.log(schema, parentSchema)
      return () => false
    },*/
  /*  metaSchema: {
      type:'string'
    },*/
  macro() {
    return {
      minLength: 10,
    }
  },
})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      test: '123456',
      errorMessage: {
        type: '必须是字符串',
        test: 'test自定义验证错误',
      },
      // format: 'test',
      // minLength:10
    },
    age: {
      type: 'number',
    },
    pets: {
      type: 'array',
      items: [
        {
          type: 'string',
        },
        {
          type: 'number',
        },
      ],
      minItems: 2,
    },
    isWorker: {
      type: 'boolean',
    },
  },
  required: ['age'],
}

const validate = ajv.compile(schema)
const valid = validate({
  name: 'Hello world',
  age: 20,
  pets: ['1', 2],
  isWorker: true,
})
if (!valid) {
  localize.zh(validate.errors)
  console.log(validate.errors)
}
