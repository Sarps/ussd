
const Renderer = require('./Renderer')

const path = require('path')

k = new Renderer()
k.viewDir = path.join(process.env.INIT_CWD, 'views/ussdml')

module.exports = {
    render: k.render.bind(k),
    init: k.init.bind(k),
}