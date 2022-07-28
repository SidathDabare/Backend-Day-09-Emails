/** @format */

// /** @format */
import PdfPrinter from "pdfmake"
import { pipeline } from "stream"
import { promisify } from "util"
import fs from "fs"
import { pdfWritableStream } from "./fs-tools.js"
// Define font files

export const getPDFReadableStream = (productsArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  const printer = new PdfPrinter(fonts)

  const tableContent = [
    ["TITLE", "CATEGORY"],
    ...productsArray.map((product) => {
      return [product.name, product.category]
    }),
  ]

  const docDefinition = {
    // content: booksArray.map(book => {
    //   return {
    //     text: `${book.title} - ${book.category}`,
    //     style: "header",
    //   }
    // }),
    content: [
      {
        style: "tableExample",
        table: {
          body: tableContent,
        },
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}

export const generatePDFAsync = async (productsArray) => {
  const source = getPDFReadableStream(productsArray)
  const destination = pdfWritableStream("test.pdf")

  // normally pipeline works with callbacks to determine when the stream is completed, we shall avoid mixing callbacks with Promises (and Async/Await). In order to fix this we should convert the normal callback pipeline into a Promise Based Pipeline
  /*
    BAD (CALLBACK BASED PIPELINE)
    pipeline(source, transform, destination, err => {
        if (err) console.log(err)
      })
    
    GOOD (PROMISE BASED PIPELINE)
    await pipeline(source, transform, destination)
  */

  const promisePipeline = promisify(pipeline) // promisify is an amazing utility from 'util' core module, which turns an error-first callback based function into a promise based function (and so Async/Await). Pipeline is a function which works with error-first callbacks --> I can promisify a pipeline, obtaining a "Promise Based Pipeline"
  await promisePipeline(source, destination)
}
// import PdfPrinter from "pdfmake"
// // Define font files
// import { pipeline } from "stream"
// import { promisify } from "util"
// import fs from "fs"
// import { pdfWritableStream } from "./fs-tools.js"

// export const getPDFReadableStream = (products) => {
//   const fonts = {
//     Roboto: {
//       normal: "Helvetica",
//       bold: "Helvetica-Bold",
//     },
//   }

//   const printer = new PdfPrinter(fonts)

//   const docDefinition = {
//     // content: booksArray.map(book => {
//     //   return {
//     //     text: `${book.title} - ${book.category}`,
//     //     style: "header",
//     //   }
//     // }),
//     content: [
//       {
//         text: `${products.name}`,
//         style: "header",
//       },
//       {
//         text: `${products.brand}`,
//         style: "header",
//       },
//       {
//         text: `${products.category}`,
//         style: "header",
//       },
//       {
//         text: `${products.price}`,
//         style: "subheader",
//       },
//       {
//         text: `${products.description}`,
//         style: "small",
//       },
//       //   {
//       //     image: `${products.imageUrl}`,
//       //     style: "subheader",
//       //   },
//     ],

//     styles: {
//       header: {
//         fontSize: 18,
//         bold: true,
//       },
//       subheader: {
//         fontSize: 15,
//         bold: true,
//       },
//       quote: {
//         italics: true,
//       },
//       small: {
//         fontSize: 8,
//       },
//     },
//   }
//   // export const getPDFReadableStream = (booksArray) => {
//   //   const fonts = {
//   //     Roboto: {
//   //       normal: "Helvetica",
//   //       bold: "Helvetica-Bold",
//   //     },
//   //   }

//   //   const printer = new PdfPrinter(fonts)

//   //   const tableContent = [
//   //     ["TITLE", "CATEGORY" ],
//   //     ...booksArray.map((book) => {
//   //       return [book.name, book.category]
//   //     }),
//   //   ]

//   //   console.log(tableContent)

//   //   const docDefinition = {
//   //     // content: booksArray.map(book => {
//   //     //   return {
//   //     //     text: `${book.title} - ${book.category}`,
//   //     //     style: "header",
//   //     //   }
//   //     // }),
//   //     content: [
//   //       {
//   //         style: "tableExample",
//   //         table: {
//   //           body: tableContent,
//   //         },
//   //       },
//   //     ],

//   //     styles: {
//   //       header: {
//   //         fontSize: 18,
//   //         bold: true,
//   //       },
//   //       subheader: {
//   //         fontSize: 15,
//   //         bold: true,
//   //       },
//   //     },
//   //   }

//   const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
//   pdfReadableStream.end()

//   return pdfReadableStream
// }
