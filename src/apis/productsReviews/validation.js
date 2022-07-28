/** @format */
/** @format */

import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const productReviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string!",
    },
  },
}
// Validation middlewares chain 1. checkBookSchema --> 2. checkValidationResult

export const checkProductReviewSchema = checkSchema(productReviewSchema) // the checkSchema function will give us a middleware that checks req bodies

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
