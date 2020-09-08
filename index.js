const express = require('express')

const app = express()

// GET Path '/home' yang menampilkan respon "Welcome to my first backend!"
app.get('/home', (req, res) => {
    res.send('Welcome to my first backend!')
})


app.listen(8080)
