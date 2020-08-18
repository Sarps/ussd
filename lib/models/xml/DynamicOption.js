const xpath = require('xpath')
const Text = require('./Text')

module.exports = class DynamicOption extends Text {

    items = null;
    value = null;
    view = null;

    static fromXml(node) {
        const v = new DynamicOption()
        v.value = node.getAttribute('value')
        v.view = node.getAttribute('view')
        v.items = node.getAttribute('items') // TODO: Check for variable existence
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc+cur, '')
        return v;
    }

    process() {
        return super.process();
    }

}