const xpath = require('xpath')

const Node = require('./Node')
const Text = require('./Text')
const {formatText} = require('../../helpers')

module.exports = class Input extends Text {

    text = ''
    key = null
    view = null

    static fromXml(node) {
        const v = new Input()
        v.value = node.getAttribute('value')
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc + cur, '')
        return v;
    }

    process(data) {
        return {
            ...super.process(data),
            view: this.view,
            key: this.key,
            input: '.+'
        }
    }

}