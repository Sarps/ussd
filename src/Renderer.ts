
import qs from  'query-string'

import { ViewParser } from  '~/ViewParser'
import { Storage } from  '@/persistence/Storage'
import { UssdRequest } from  '@/UssdRequest'
import { MemoryStorage } from  '@/persistence/MemoryStorage'

import { View } from '@/xml/View'
import { Route } from '@/xml/Route'

export class Renderer {


    private views: Map<string, View>
    private _routes: Array<Route>
    private _methods: Map<string, Function>
    storage: Storage
    static _s = {
        'memory': MemoryStorage
    }

    constructor() {
        this.views = new Map<string, View>()
        this._routes = []
        this._methods = new Map<string, Function>()
        this.storage = new Storage();
    }

    async init({ storageName, storageOptions, customStorage, viewDir, controllerMethods }: RendererConfig) {
        this._methods = controllerMethods || new Map()
        await this._initStorage({storageName, storageOptions, customStorage})
        await this._initViews({viewDir})
    }

    render(view: string, data: object): void {
        this._doRender(view, data)
    }

    process(request: UssdRequest): {textResponse: string, open: boolean} {
        let view, data
        if (request.isNew) {
            const parts = request.ussd.replace(/(?:^[^\d]+|[^\d]+$)/g, '').split('*'),
                domain = parts.shift(), path = `/${parts.join('/')}`,
                route = this._routes.find(route => route.matches(domain, path))
            if (!route) {
                throw new Error('No route mapping found')
            }
            view = route.view
            data = route.matches(domain, path)
        } else {
            if (request.text === '0') {
                this.storage.popRoute(request.session)
                let history = this.storage.getCurrentRoute(request.session)
                // TODO: Special case for back button
            }
            let history = this.storage.getCurrentRoute(request.session)
            const route = this._parseRoute(history)
            const {view: _view, key, value} = this._matchInput(route.inputs, request.text)
            if (key && key.length) route.data[key] = value || request.text

            view = _view
            data = route.data
        }
        const {inputs, text} = this._doRender(view, data)
        console.log({view, data})
        let currentRoute = [view, qs.stringify(data), qs.stringify(inputs)].join('?')
        this.storage.addRoute(request.phone, request.session, currentRoute)
        console.log(currentRoute)
        return {
            textResponse: text, open: inputs && Object.keys(inputs).length
        }
    }

    /**
     *
     * @param {string} viewName
     * @param {{}} data
     * @return {{text: string, inputs: {string: string}}}
     * @private
     */
    _doRender(viewName: string, data: object): RenderOutput {
        if (!this.views || !this.views[viewName]) throw new Error(`Couldn't find view: "${viewName}"`)
        const view = this.views[viewName]
        if (this._methods.has(view.controllerMethod)) {
            const newData = this._methods.get(view.controllerMethod)({...data})
            data = {...data, ...newData}
        }
        return view.process(data).reduce((acc, cur) => {
            acc.text += cur.text + '\n'
            if (cur.input) {
                acc.inputs[cur.input.toString()] = cur.key && cur.key.length ? `${cur.view},${cur.key},${cur.value || cur.text}` : cur.view
            }
            return acc
        }, {text: '', inputs: {}})
    }

    async _initStorage({storageName, storageOptions, customStorage}: any): Promise<void> {
        if (storageName) {
            if (Renderer._s[storageName]) return this.storage = new Renderer._s[storageName](storageOptions);
            throw new Error('Unknown storage name')
        }
        if (customStorage) return this.storage = customStorage
        throw new Error('No storage specified or provided')
    }

    async _initViews({viewDir: dir}: any): Promise<void> {
        if (!dir) throw new Error('You must provide a view directory')
        const {views, routes} = await new ViewParser(dir).loadViewModels()
        this.views = views
        this._routes = routes
    }

    _parseRoute(route: string) {
        let [view, data, inputs] = route.split('?')
        return {
            view, inputs: qs.parse(inputs), data: qs.parse(data)
        }
    }

    _matchInput(inputs: RenderOutput["inputs"], text: string): {view: string, key: string, value: string} {
        const input = Object.keys(inputs).find(input => new RegExp(input).test(text)),
            [view, key, value] = inputs[input].split(',')
        return {
            view, key, value
        }
    }

}

interface RendererConfig {
    storageName: string
    storageOptions: string
    customStorage: Storage
    viewDir: string
    controllerMethods: Map<string, Function>
}

interface RenderOutput {
    text: string
    inputs: {string: string}
}