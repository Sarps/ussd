const xpath = require('xpath')
const Text = require('./Text')
const {extract, formatText} = require('../../helpers')

module.exports = class DynamicOption extends Text {

    items = null;
    value = null;
    view = null;

    static fromXml(node) {
        const v = new DynamicOption()
        v.value = node.getAttribute('value')
        v.view = node.getAttribute('view')
        v.items = node.getAttribute('items') // TODO: Check for variable existence
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc + cur, '')
        return v;
    }

    process(data) {
        const items = extract(data, this.items),
            _self = this
        return items ? items.map(item => ({
            ...super.process({...data, item}),
            view: _self.view,
            value: formatText(_self.value, {...data, item})
        })) : []
    }

}