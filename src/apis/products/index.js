/** @format */

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { checkProductSchema, checkValidationResult } from "./validation.js"
import { getProducts, writeProducts } from "../../lib/fs-tools.js"
import { sendRegistrationEmail } from "../../lib/email-tools.js"

const productRouter = express.Router()

productRouter.post(
  "/",
  checkProductSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newPosts = { ...req.body, createdAt: new Date(), id: uniqid() }
      const posts = await getProducts()

      posts.push(newPosts)
      await writeProducts(posts)
      res.status(201).send({ id: newPosts.id })
    } catch (error) {
      next(error)
    }
  }
)

productRouter.get("/", async (req, res, next) => {
  try {
    //console.log("QUERY: ", req.query)
    const products = await getProducts()
    if (req.query && req.query.category) {
      const filterProducts = products.filter(
        (products) =>
          products.category.toLowerCase() === req.query.category.toLowerCase()
      )
      res.send(filterProducts)
    } else {
      res.send(products)
    }
  } catch (error) {
    next(error)
  }
})

productRouter.get("/:Id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const foundProduct = products.find(
      (product) => product.id === req.params.Id
    )
    res.send(foundProduct)
  } catch (error) {
    next(error)
  }
})

productRouter.put("/:Id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const index = products.findIndex((product) => product.id === req.params.Id)
    const oldProduct = products[index]
    const updatedProduct = { ...oldProduct, ...req.body, updatedAt: new Date() }
    products[index] = updatedProduct
    await writeProducts(products)
    res.send(updatedProduct)
  } catch (error) {
    next(createHttpError(404, `Product with id ${req.params.Id} not found!`))
  }
})

productRouter.delete("/:Id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const remainingProduct = products.filter(
      (product) => product.id !== req.params.Id
    )
    await writeProducts(remainingProduct)
    //res.status(204).send()
    res.status(201).send(`Deleted product Id : ${req.params.Id}`)
  } catch (error) {
    next(error)
  }
})
productRouter.post("/register", async (req, res, next) => {
  try {
    // 1. receive user's data from req.body
    const { email } = req.body
    // 2. save new user in db
    // 3. send email to new user
    await sendRegistrationEmail(email)
    res.send({ message: "User registered and email sent!" })
  } catch (error) {
    next(error)
  }
})
export default productRouter
