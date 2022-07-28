/** @format */

import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
console.log(dataFolderPath)

const productsJSONPath = join(dataFolderPath, "product.json")
const productsReviewsJSONPath = join(dataFolderPath, "productsReviews.json")

const productsPublicFolderPath = join(
  process.cwd(),
  "../Backend-Day-07-Backend/public/img/products"
)

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = (productArray) =>
  writeJSON(productsJSONPath, productArray)

export const getProductsReviews = () => readJSON(productsReviewsJSONPath)
export const writeProductsReviews = (productReviewsArray) =>
  writeJSON(productsReviewsJSONPath, productReviewsArray)

export const saveProducts = (fileName, contentAsABuffer) =>
  writeFile(join(productsPublicFolderPath, fileName), contentAsABuffer)

export const getProductsReadableStream = () =>
  createReadStream(productsJSONPath)

export const pdfWritableStream = (filename) =>
  createWriteStream(join(dataFolderPath, filename))
