require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const itemsRouter = require('./src/routes/itemsRoute')
const categoryRouter = require('./src/routes/categoryRoute')
const subCategoryRouter = require('./src/routes/subCategoryRoute')
const cartRouter = require('./src/routes/cartRoute')

const app = express()

// middleware
app.use(cors())

// provide static
app.use('/uploads', express.static('assets/uploads'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/items', itemsRouter)
app.use('/category', categoryRouter)
app.use('/sub-category', subCategoryRouter)
app.use('/cart', cartRouter)

app.listen(8080, () => {
  console.log('Listening to the Port 8080')
})
