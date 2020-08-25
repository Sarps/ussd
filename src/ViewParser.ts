const glob = require('glob')
const {promisify} = require('util')
const path = require('path')
const {readFileSync} = require('fs')

const xmldom = require('xmldom')
const xpath = require('xpath')

import { View } from  './models/xml/View'
import { Route } from  './models/xml/Route'

export class ViewParser {

    viewDir;
    viewExtension = 'ussdml';
    parser;

    constructor(dir) {
        this.viewDir = dir
        this.parser = new xmldom.DOMParser()
    }

    async loadViewModels() {
        try {
            const {views, routes} = await this._cleanViews()
            return {
                views: views.map(View.fromXml).reduce((acc, cur) => {acc[cur.name] = cur; return acc}, {}),
                routes: routes.map(Route.fromXml)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async _cleanViews() {
        try {
            const _self = this
            const res = await promisify(glob)(`**/*.${this.viewExtension}`, {cwd: this.viewDir})
            return res.reduce((acc, file) => {
                const {views, routes} = _self._parseRoutes(file)
                acc.views = acc.views.concat(views)
                acc.routes = acc.routes.concat(routes)
                return acc
            }, {views: [], routes: []})
        } catch (e) {
            console.log(e)
        }
    }

    _replaceNS(name, ns) {
        return name.indexOf(':') > -1 ? name : `${ns}:${name}`;
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
        return {
            views, routes: xpath.select('*//route', ussdml)
        }
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