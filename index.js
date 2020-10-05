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
const checkoutRoute = require('./src/routes/checkoutRoute')
const transactionRouter = require('./src/routes/transactionRoute')

const app = express()

// import middleware
const authMiddleware = require('./src/middlewares/auth')

// middleware
app.use(cors())

// provide static
app.use('/uploads', express.static('assets/uploads'))

app.use(bodyParser.urlencoded({ extended: false }))

// Private Routes
app.use('/private', authMiddleware, itemsRouter)
app.use('/private', authMiddleware, categoryRouter)
app.use('/private', authMiddleware, subCategoryRouter)
app.use('/private', authMiddleware, cartRouter)
app.use('/private', authMiddleware, checkoutRoute)
app.use('/private', authMiddleware, transactionRouter)
app.use('/private', userRouter)

// Public Routes
app.use('/public', publicRouter)

app.use('/role', authMiddleware, roleRouter)
app.use('/auth', authRouter)

app.listen(8080, () => {
  console.log('Listening to the Port 8080')
})
