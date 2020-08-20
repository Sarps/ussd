
const Node = require('./Node')
const Choice = require('./Choice')
const Text = require('./Text')
const Input = require('./Input')

module.exports = class View extends Node {

    name = null
    controllerMethod = null
    _backAllowed = false
    children = []

    static childMap = {
        'choice': Choice,
        'text': Text,
        'input': Input
    }

    static fromXml(node) {
        const v = new View()
        v.name = node.getAttribute('name')
        v.controllerMethod = node.getAttribute('controller-method')
        v.backAllowed = node.getAttribute('back-allowed')
        for (const child of Array.from(node.childNodes)) {
            if(View.childMap[child.nodeName.toLowerCase()]) {
                const model = View.childMap[child.nodeName.toLowerCase()].fromXml(child)
                v.children.push(model)
            }
        }
        return v;
    }

    /**
     *
     * @param {{}} data
     * @return {[]}
     */
    process(data) {
        let str = this.children.flatMap(child => child.process(data))
        if (this._backAllowed) {
            str.push({text : '0 Back'})
        }
        // console.log(str)
        return str
    }


    set backAllowed(value) {
        this._backAllowed = value.toLowerCase() === 'true';
    }
}