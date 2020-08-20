
const Renderer = require('./Renderer')
const UssdRequest = require('./models/UssdRequest')

const k = new Renderer()

module.exports = {
    render: k.render.bind(k),
    init: k.init.bind(k),
    process: k.process.bind(k),
    UssdRequest
}