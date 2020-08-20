const Node = require('./Node')
const Option = require('./Option')
const DynamicOption = require('./DynamicOption')

module.exports = class Choice extends Node {
    children = []
    trimContent = false;
    key = '';

    static childMap = {
        'option': Option,
        'dynamic-option': DynamicOption
    }

    static fromXml(node) {
        const v = new Choice()
        v.trimContent = node.getAttribute('trim-content')
        v.key = node.getAttribute('key')
        for (const child of Array.from(node.childNodes)) {
            if (Choice.childMap[child.nodeName.toLowerCase()]) {
                const model = Choice.childMap[child.nodeName.toLowerCase()].fromXml(child)
                v.children.push(model)
            }
        }
        return v;
    }

    process(data) {
        return this.children.flatMap((v, i) => v.process(data)).map((v, i) => ({
            ...v,
            input: i + 1,
            key: this.key,
            text: `${i + 1} ${v.text}`
        }))
    }

}