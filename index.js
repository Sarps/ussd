const express = require('express')
const sample = require('./sample')

const app = express()
+
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    console.log(req.url)
    console.log(req.method, req.body)
    res.send(`CON ${render('users.profile', {
        "name": "Chris",
        "company": "Some company"
    })}`)
})

app.listen(8000, () => console.log("Started"))