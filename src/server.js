/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"

import {
  badRequestHandler,
  notFoundHandler,
  unauthorizedHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js"
import filesRouter from "./apis/files/index.js"
import productRouter from "./apis/products/index.js"
import productReviewRouter from "./apis/productsReviews/productsReviews.js"
import createHttpError from "http-errors"

const server = express()
const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

// const loggerMiddleware = (req, res, next) => {
//   console.log(
//     `Request method: ${req.method} -- Request URL: ${req.url} -- ${new Date()}`
//   )
//   console.log("Req body: ", req.body)
//   // const check = true
//   // if (check) {
//   //   res.status(400).send({ message: "ERRORRRRRRRRRRRRR" })
//   // } else {
//   //   next()
//   // }
//   next()
// }

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

server.use(
  cors({
    origin: (origin, corsNext) => {
      // If you want to connect FE to this BE you must use cors middleware
      console.log("ORIGIN: ", origin)

      if (!origin || whitelist.indexOf(origin) !== -1) {
        // if origin is in the whitelist we can move next
        corsNext(null, true)
      } else {
        // if origin is NOT in the whitelist --> trigger an error
        corsNext(
          createHttpError(
            400,
            `Cors Error! Your origin ${origin} is not in the list!`
          )
        )
      }
    },
  })
)

// *********************************************************
server.use(express.static(publicFolderPath))
//server.use(cors()) // If you want to connect FE to this BE you must use cors middleware
//server.use(loggerMiddleware) // GLOBAL MIDDLEWARE
server.use(express.json()) // GLOBAL MIDDLEWARE If you don't add this line BEFORE the endpoints all requests'bodies will be UNDEFINED

server.use("/products", productRouter)
server.use("/products", productReviewRouter)
server.use("/file", filesRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("port", port)
})
