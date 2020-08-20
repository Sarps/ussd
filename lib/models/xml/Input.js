const xpath = require('xpath')

const Node = require('./Node')
const Text = require('./Text')
const ProcessOutput = require('../ProcessOutput')

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

    /**
     *
     * @param {Object} data
     * @return {ProcessOutput}
     */
    process(data) {
        const po = super.process(data)
        po.view = this.view
        po.key = this.key
        po.input = '.+'
        return po
    }

}