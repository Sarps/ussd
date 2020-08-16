
const Renderer = require('./Renderer')
const path = require('path')

k = new Renderer(path.join(__dirname, '../views/mustache'))

module.exports = {
    render: k.render.bind(k)
}