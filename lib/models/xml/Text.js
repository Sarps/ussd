const xpath = require('xpath')
const Node = require('./Node')
const {formatText} = require('../../helpers')

module.exports = class Text extends Node {

    text = ''

    static fromXml(node) {
        const v = new Text()
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc + cur, '')
        return v;
    }

    process(data) {
        return {text: formatText(this.text, data)};
    }

}