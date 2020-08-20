const xpath = require('xpath')
const Node = require('./Node')
const ProcessOutput = require('../ProcessOutput')
const {formatText} = require('../../helpers')

module.exports = class Text extends Node {

    text = ''

    static fromXml(node) {
        const v = new Text()
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc + cur, '')
        return v;
    }

    /**
     *
     * @param {Object} data
     * @return {ProcessOutput|ProcessOutput[]}
     */
    process(data) {
        const po = new ProcessOutput()
        po.text = formatText(this.text, data)
        return po;
    }

}