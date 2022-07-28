/** @format */

import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const productSchema = {
  name: {
    in: ["body"],
    errorMessage: "Name is a mandatory field and needs to be a string!",
    isString: true,
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a string!",
    },
  },
  // imageUrl: {
  //   in: ["body"],
  //   isString: {
  //     errorMessage: "Image is a mandatory field and needs to be a string!",
  //   },
  // },
  price: {
    in: ["body"],
    isString: {
      errorMessage: "Price is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
}
// Validation middlewares chain 1. checkBookSchema --> 2. checkValidationResult

export const checkProductSchema = checkSchema(productSchema) // the checkSchema function will give us a middleware that checks req bodies

export const checkValidationResult = (req, res, next) => {
  // check if previous middleware (checkBookSchema) has found any error
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // If we have any validation error --> trigger 400
    next(
      createHttpError(400, "Validation errors in request body!", {
        errorsList: errors.array(),
      })
    )
  } else {
    // Else (no errors) --> normal flow
    next()
  }
}
