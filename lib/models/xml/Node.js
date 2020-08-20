
const ProcessOutput = require('../ProcessOutput')

module.exports = class Node {

    static fromXml(node) {
        throw new Error('Not implemented')
    }

    /**
     *
     * @param {{}} data
     * @return {ProcessOutput|ProcessOutput[]}
     */
    process(data) {
        throw new Error('Not implemented')
    }
}