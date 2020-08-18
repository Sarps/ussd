const xpath = require('xpath')
const Node = require('./Node')

module.exports = class Text extends Node {

    text = ''

    static fromXml(node) {
        const v = new Text()
        v.text = xpath.select('.//text()', node).reduce((acc, cur) => acc+cur, '')
        return v;
    }

    process() {
        return this.text;
    }

}