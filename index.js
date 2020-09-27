require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// import routes
const itemsRouter = require('./src/routes/itemsRoute')
const categoryRouter = require('./src/routes/categoryRoute')
const subCategoryRouter = require('./src/routes/subCategoryRoute')
const cartRouter = require('./src/routes/cartRoute')
const roleRouter = require('./src/routes/roleRoute')
const userRouter = require('./src/routes/userRoute')
const authRouter = require('./src/routes/authRoute')
const publicRouter = require('./src/routes/publicRoute')

const app = express()

// import middleware
const authMiddleware = require('./src/middlewares/auth')

// middleware
app.use(cors())

// provide static
app.use('/uploads', express.static('assets/uploads'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/items', authMiddleware, itemsRouter)
app.use('/category', authMiddleware, categoryRouter)
app.use('/sub-category', authMiddleware, subCategoryRouter)
app.use('/cart', authMiddleware, cartRouter)
app.use('/role', authMiddleware, roleRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

// Public Routes
app.use('/public', publicRouter)

app.listen(8080, () => {
  console.log('Listening to the Port 8080')
})
