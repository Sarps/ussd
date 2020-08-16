const express = require('express')
// require('dotenv').config()
const sample = require('./sample')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/', (req, res) => {
    console.log(req.body)
    const result = sample(req.body.text)
    console.log(result)
    res.send(result)
})

app.listen((process.env.PORT || 8000), () => console.log("Started"))