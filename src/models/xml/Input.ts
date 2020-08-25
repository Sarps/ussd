const xpath = require('xpath')

import { Node } from  './Node'
import { Text } from  './Text'
import { ProcessOutput } from  '../ProcessOutput'

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