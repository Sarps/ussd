const xpath = require('xpath')
import {Text} from  './Text'
const {formatText} = require('../../helpers')

module.exports = class Option extends Text {

    value = null;
    view = '';

    static fromXml(node: any) {
        const v = new Option()
        v.value = node.getAttribute('value')
        v.view = node.getAttribute('view')
        v.text = xpath.select('.//text()', node).reduce((acc: string, cur: string) => acc + cur, '')
        return v;
    }

    process(data: any) {
        const [po] = super.process(data)
        po.view = this.view
        po.value = formatText(this.value, data)
        return [po]
    }

}