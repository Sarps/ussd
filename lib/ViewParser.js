const glob = require('glob')
const {promisify} = require('util')
const path = require('path')
const {readFileSync} = require('fs')

const viewParser = require('fast-xml-parser');
const jp = require('jsonpath');

const xmldom = require('xmldom')
const xpath = require('xpath')

const View = require('./models/xml/View')

module.exports = class Parser {

    viewDir;
    viewExtension = 'ussdml';
    parser;

    constructor(dir) {
        this.viewDir = dir
        this.parser = new xmldom.DOMParser()
    }

    async loadViewModels() {
        try {
            const views = await this._cleanViews()
            return views.map(View.fromXml).reduce((acc, cur) => {acc[cur.name] = cur; return acc}, {})
        } catch (e) {
            console.log(e)
        }
    }

    async _cleanViews() {
        try {
            const res = await promisify(glob)(`**/*.${this.viewExtension}`, {cwd: this.viewDir})
            return res.flatMap(this._parseRoutes.bind(this))
        } catch (e) {
            console.log(e)
        }
    }

    _replaceNS(name, ns) {
        return name.indexOf(':') > -1 ? name : `${ns}:${name}`;
    }

    _parseRoutesJSON(file) {
        let ns = file.replace(/\..+$/, '').replace(/[\\\/]/g, '.')
        const ussdml = viewParser.parse(readFileSync(
            path.join(this.viewDir, file), {encoding: 'utf-8'}
        ), {attributeNamePrefix : "", ignoreAttributes : false}, {allowBooleanAttributes: true})
        const _self =  this
        jp.apply(ussdml, '$..*[?(@.view)]', d => d.view = _self._replaceNS(d.view, ns))
        jp.apply(ussdml, '$..view.*', d => d.name = _self._replaceNS(d.name, ns))
        return jp.query(ussdml, '$..view.*')
    }

    _parseRoutes(file) {
        let ns = file.replace(/\..+$/, '').replace(/[\\\/]/g, '.')
        const ussdml = this.parser.parseFromString(readFileSync(
            path.join(this.viewDir, file), {encoding: 'utf-8'}
        ))
        const _self =  this
        xpath.select('//*[@view]', ussdml)
            .forEach(node => node.setAttribute('view', _self._replaceNS(node.getAttribute('view'), ns)))
        const views = xpath.select('*//view', ussdml)
        views.forEach(view => view.setAttribute('name', _self._replaceNS(view.getAttribute('name'), ns)))
        return views
    }

    _buildView(node) {
        if (node) {
            const children = node.children;
            for (let i = 0; i < children.length; i++)
                //Each recursion passes down the traversed nodes and the array stored by the nodes
                this._buildView(children[i]);
        }
    }

}