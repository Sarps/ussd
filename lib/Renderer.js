
const ViewParser = require('./ViewParser')
const Storage = require('./models/persistence/Storage')
const MemoryStorage = require('./models/persistence/MemoryStorage')

module.exports = class Renderer {

    _views = [];
    storage = new Storage();
    static _s = {
        'memory': MemoryStorage
    }

    async init(storage, view) {
        await this._initStorage(storage)
        await this._initViews(view)
    }

    render(view) {
        if (!this._views || !this._views[view]) throw new Error(`Unknown View: "${view}"`)
        const responses = this._views[view].process()
        if (!responses.length) return `END`;
        return `CON ${responses.join('\n')}`
    }

    async _initStorage({name, options, custom}) {
        if (name) {
            if (Renderer._s[name]) return new Renderer._s[name](options);
            throw new Error('Unknown storage name')
        }
        if (custom) return custom
        throw new Error('No storage specified or provided')
    }

    async _initViews({dir}) {
        if (!dir) throw new Error('You must provide a view directory')
        this._views = await new ViewParser(dir).loadViewModels()
    }

    set viewDir(value) {
        const _self = this
        new ViewParser(value).loadViewModels()
            .then(d => _self._views = d)
    }


}