const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// GET Path '/home' yang menampilkan respon "Welcome to my first backend!"
app.get('/home', (req, res) => {
    res.send('Welcome to my first backend!')
})

// POST Path '/data' yang akan menampilkan data yang dikirim ke "console.log"
app.use(bodyParser.urlencoded({ exetended: true}))
app.use(bodyParser.json())
app.post('/data', (req, res) => {
    console.log('Got body: ', req.body)
    res.sendStatus(200)
})


app.listen(8080, () => {
    console.log(`Listening Port 8080`)
})
