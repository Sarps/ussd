const express = require('express')
const sample = require('./sample')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/', (req, res) => {
    console.log(req.url)
    console.log(req.method, req.body)
    const result = sample(req.body.text)
    console.log(result)
    res.send(result)
})

app.listen(8000, () => console.log("Started"))