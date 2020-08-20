
const loki = require('lokijs')
const Storage = require('./Storage')

module.exports = class MemoryStorage extends Storage {

    db
    routeCollection

    constructor(options) {
        super();
        this.db = new loki(options.file)
        this.routeCollection = this.db.addCollection('routes')
    }

    addRoute(phone, sessionId, route) {
        this.routeCollection.insert({phone, sessionId, route, 'date_created': new Date()})
    }

    getCurrentRoute(sessionId) {
        return this.routeCollection.chain().find({sessionId})
            .simplesort('date_created', {desc: true}).data()[0].route
    }

    popRoute(sessionId) {
        return this.routeCollection.chain().find({sessionId})
            .simplesort('date_created', {desc: true}).remove()
    }

}