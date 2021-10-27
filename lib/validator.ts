import Ajv from 'ajv'
import { toPath } from 'lodash'
import i18n from 'ajv-i18n'

import type { ErrorObject } from 'ajv'
import type { Schema } from './types'

import { isObject } from './utils'

interface ErrorSchemaObject {
  [level: string]: ErrorSchema
}

export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[]
}

interface TransformErrorObject {
  name: string
  property: string
  message?: string
  params: Record<string, any>
  schemaPath: string
}

function toErrorSchema(errors: TransformErrorObject[]) {
  if (errors.length < 1) return {}
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = toPath(property?.replace(/\//g, '.')) // /obj/a -> [obj, a])
    let parent = errorSchema

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }

    // {
    //   obj: {
    //     a: {}
    //   }
    // } // /obj/a
    // 用于查找对象里面是否存在属性，如果没有就加上，然后里面层层叠加
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }
    return errorSchema
  }, {} as ErrorSchema)
}

function transformErrors(
  errors: ErrorObject[] | null | undefined,
): TransformErrorObject[] {
  if (errors === null || errors === undefined) return []
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath,
    }
  })
}

function createErrorProxy() {
  const raw = {}
  // raw 用作被代理的对象
  return new Proxy(raw, {
    // 我们需要在 raw 里面增加一些层级，并且在每个层级增加一个 __error 的数组
    get(target, key, receiver) {
      if (key === 'addError') {
        return (msg: string) => {
          const __errors = Reflect.get(target, '__errors', receiver)
          if (__errors && Array.isArray(__errors)) {
            __errors.push(msg)
          } else {
            Reflect.set(target, '__errors', [msg], receiver)
          }
        }
      }
      const res = Reflect.get(target, key, receiver)
      if (res === undefined) {
        const p: any = createErrorProxy()
        Reflect.set(target, key, p, receiver)
        return p
      }
      return res
    },
  })
}

// 合并对象，并且通过 concatArrays 来判断是否需要合并数组
export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}

export async function validateFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (data: any, errors: any) => void,
) {
  let validationError = null
  try {
    validator.validate(schema, formData)
  } catch (err) {
    validationError = err
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  i18n[locale](validator.errors)
  const errors = transformErrors(validator.errors)
  if (validationError) {
    errors.push(validationError as TransformErrorObject)
  }
  const errorSchema = toErrorSchema(errors)
  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    }
  }
  const proxy = createErrorProxy()
  await customValidate(formData, proxy)
  const newErrorSchema = mergeObjects(errorSchema, proxy, true)
  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  }
}
