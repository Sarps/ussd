const xpath = require('xpath')
const Text = require('./Text')
const {formatText} = require('../../helpers')

module.exports = class Option extends Text {

    value = null;
    view = null;

    static fromXml(node) {
        const v = new Option()
        v.value = node.getAttribute('value')
        v.view = node.getAttribute('view')
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc+cur, '')
        return v;
    }

    process(data) {
        const po = super.process(data)
        po.view = this.view
        po.value = formatText(this.value, data)
        return po
    }

}