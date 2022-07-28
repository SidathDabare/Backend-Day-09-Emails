/** @format */

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import {
  checkValidationResult,
  checkProductReviewSchema,
} from "./validation.js"
import { getProductsReviews, writeProductsReviews } from "../../lib/fs-tools.js"

const productReviewRouter = express.Router()

productReviewRouter.post(
  "/reviews",
  checkProductReviewSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newReview = { ...req.body, createdAt: new Date(), _id: uniqid() }
      const preview = await getProductsReviews()

      preview.push(newReview)
      await writeProductsReviews(preview)
      res.status(201).send({ _id: newReview._id })
    } catch (error) {
      next(error)
    }
  }
)

productReviewRouter.get("/reviews/:id", async (req, res, next) => {
  try {
    const review = await getProductsReviews()

    const foundReview = review.filter(
      (product) => product.productId === req.params.id
    )
    if (foundReview) {
      res.send(foundReview)
    } else {
      next(createHttpError(404, `Review with id ${req.params.id} not found!`)) // this is creating not a normal error, but an error with a STATUS CODE (in this case 404)
    }
  } catch (error) {
    next(error)
  }
})

// productReviewRouter.get("/reviews/:Id", async (req, res, next) => {
//   try {
//     const products = await getProductsReviews()
//     const foundProduct = products.find(
//       (product) => product.id === req.params.Id
//     )
//     res.send(foundProduct)
//   } catch (error) {
//     next(error)
//   }
// })

productReviewRouter.put("/reviews/:id", async (req, res, next) => {
  try {
    const review = await getProductsReviews()

    const index = review.findIndex((review) => review._id === req.params.id)
    if (index !== -1) {
      const oldReview = review[index]

      const updatedReview = {
        ...oldReview,
        ...req.body,
        updatedAt: new Date(),
      }

      review[index] = updatedReview

      await writeProductsReviews(review)

      res.send(updatedReview)
    } else {
      next(createHttpError(404, `Review with id ${req.params.id} not found!`))
      // res.status(404).send()
    }
  } catch (error) {
    next(error)
  }
})

productReviewRouter.delete("/reviews/:id", async (req, res, next) => {
  try {
    const reviews = await getProductsReviews()
    const remainingReviews = reviews.filter(
      (reviews) => reviews._id !== req.params.id
    )
    await writeProductsReviews(remainingReviews)
    //res.status(204).send()
    res.status(201).send(`Deleted review Id : ${req.params.id}`)
  } catch (error) {
    next(error)
  }
})

export default productReviewRouter
