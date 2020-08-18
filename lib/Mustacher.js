
const { readFileSync } = require('fs')
const glob = require('glob')
const { promisify } = require('util')
const path = require('path')
const Mustache = require('mustache')

module.exports = class Mustacher {

    viewDir;
    viewExtension = 'mustache';

    constructor(viewFolder) {
        this.viewDir = viewFolder
        this.loadViews()
    }

    async loadViews() {
        try {
            const res = await promisify(glob)(`**/*.${this.viewExtension}`, {cwd: this.viewDir})
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    render(view, model) {
        const filePath = `${path.join.apply(undefined, [this.viewDir, ...view.split('.')])}.${this.viewExtension}`;
        const content = readFileSync(filePath, {encoding: 'utf-8'})
        return Mustache.render(content, model)
    }

}