
const UssdNode = require('./Node')
const Choice = require('./Choice')
const Text = require('./Text')
const Input = require('./Input')
const ProcessOutput = require('../ProcessOutput')

module.exports = class View extends UssdNode {

    name = null
    controllerMethod = null
    _backAllowed = false
    /**
     *
     * @type {UssdNode[]}
     */
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
     * @param {Object} data
     * @return {ProcessOutput|ProcessOutput[]}
     */
    process(data) {
        let output = this.children.flatMap(child => child.process(data))
        if (this._backAllowed) {
            const po = new ProcessOutput()
            po.text = '0 Back'
            output.push(po)
        }
        return output
    }


    set backAllowed(value) {
        this._backAllowed = value.toLowerCase() === 'true';
    }
}