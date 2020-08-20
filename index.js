const express = require('express')
// const {process, init, UssdRequest} = require('./lib')
const ussdml = require('./lib')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

ussdml.init({
    storageName: 'memory',
    storageOptions: {file: 'test.json'},
    viewDir: path.join(__dirname, 'views/ussdml'),
    controllerMethods: require('./methods')
})

app.post('/', (req, res) => {
    console.log(req.body)
    const {phoneNumber: phone, serviceCode: ussd, text, sessionId: session, networkId: network} = req.body
    const {textResponse, open} = ussdml.process(
        new ussdml.UssdRequest({phone, ussd, network, session, text: text.split('*').pop()})
    )
    res.send(`${open ? 'CON' : 'END'} ${textResponse}`)
})

app.listen(8000, () => console.log("Started"))