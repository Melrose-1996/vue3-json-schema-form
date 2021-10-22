import Ajv from 'ajv'
import { toPath } from 'lodash'
import i18n from 'ajv-i18n'

import type { ErrorObject } from 'ajv'
import type { Schema } from './types'

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

export function validateFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  // customValidate?: (data: any, errors: any) => void,
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
  // if (!customValidate) {
  //     return {
  //         errors,
  //         errorSchema,
  //         valid: errors.length === 0,
  //     }
  // }
  // const proxy = createErrorProxy()
  // await customValidate(formData, proxy)
  // const newErrorSchema = mergeObjects(errorSchema, proxy, true)
  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  }
}
