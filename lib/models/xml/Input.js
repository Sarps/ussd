const xpath = require('xpath')

const Node = require('./Node')
const Text = require('./Text')

module.exports = class Input extends Text {

    text = ''
    value = null

    static fromXml(node) {
        const v = new Input()
        v.value = node.getAttribute('value')
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc+cur, '')
        return v;
    }

    process() {
        return super.process()
    }

}