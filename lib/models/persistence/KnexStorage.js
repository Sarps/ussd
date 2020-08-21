
const knex = require('knex')
const Storage = require('./Storage')

module.exports = class KnexStorage extends Storage {

    db
    routeCollection

    constructor(options) {
        super();
        options = {
            prefix: 'ussdml',
            ...options
        }
        this.db = knex(options)
        this.db.schema.createTableIfNotExists(`${options.prefix}_routes`, (t) => {
            t.increments('id').primary();
            t.string('phone', 20);
            t.string('sessionId', 256);
            t.text('route');
            t.timestamp('date_created').notNullable().defaultTo(knex.fn.now())
        })
        this.routeCollection = this.db(`${options.prefix}_routes`)
    }

    addRoute(phone, sessionId, route) {
        this.routeCollection.insert({phone, sessionId, route})
    }

    getCurrentRoute(sessionId) {
        return this.routeCollection.chain().where({sessionId}).first()
    }

    popRoute(sessionId) {
        return this.routeCollection.chain().find({sessionId})
            .simplesort('date_created', {desc: true}).remove()
    }

}