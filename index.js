const express = require('express')
// require('dotenv').config()
// const sample = require('./sample')
const {render, setup} = require('./lib')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/', (req, res) => {
    console.log(req.body)
    const Message = render("pay:menu")
    console.log('result', Message)
    res.json({Message})
})

app.listen((process.env.PORT || 8000), () => console.log("Started"))