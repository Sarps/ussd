const EventEmitter = require('events');
const qs = require('query-string')

const ViewParser = require('./ViewParser')
const Storage = require('./models/persistence/Storage')
const UssdRequest = require('./models/UssdRequest')
const MemoryStorage = require('./models/persistence/MemoryStorage')

const View = require('./models/xml/View')
const Route = require('./models/xml/Route')

module.exports = class Renderer extends EventEmitter {

    /**
     *
     * @type {{string: View}} _views
     * @private
     */
    _views = {}
    /**
     *
     * @type {Route[]} _routes
     * @private
     */
    _routes = []
    /**
     *
     * @type {Map<string, function>}
     * @private
     */
    _methods = new Map()
    storage = new Storage();
    static _s = {
        'memory': MemoryStorage
    }

    async init({ storageName, storageOptions, customStorage, viewDir, controllerMethods }) {
        this._methods = controllerMethods || new Map()
        await this._initStorage({storageName, storageOptions, customStorage})
        await this._initViews({viewDir})
    }

    render(view, data) {
        this._doRender(view, data)
    }

    /**
     *
     * @param {string} viewName
     * @param {{}} data
     * @return {{text: string, inputs: {string: string}}}
     * @private
     */
    _doRender(viewName, data) {
        if (!this._views || !this._views[viewName]) throw new Error(`Couldn't find view: "${viewName}"`)
        const view = this._views[viewName]
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

    /**
     *
     * @param {UssdRequest} request
     */
    process(request) {
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

    async _initStorage({storageName, storageOptions, customStorage}) {
        if (storageName) {
            if (Renderer._s[storageName]) return this.storage = new Renderer._s[storageName](storageOptions);
            throw new Error('Unknown storage name')
        }
        if (customStorage) return this.storage = customStorage
        throw new Error('No storage specified or provided')
    }

    async _initViews({viewDir: dir}) {
        if (!dir) throw new Error('You must provide a view directory')
        const {views, routes} = await new ViewParser(dir).loadViewModels()
        this._views = views
        this._routes = routes
    }

    _parseRoute(route) {
        let [view, data, inputs] = route.split('?')
        return {
            view, inputs: qs.parse(inputs), data: qs.parse(data)
        }
    }

    _matchInput(inputs, text) {
        const input = Object.keys(inputs).find(input => new RegExp(input).test(text)),
            [view, key, value] = inputs[input].split(',')
        return {
            view, key, value
        }
    }

}