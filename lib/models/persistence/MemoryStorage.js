
const loki = require('lokijs')
const Storage = require('./Storage')

module.exports = class MemoryStorage extends Storage {

    db

    constructor(options) {
        super();
        this.db = new loki(options.bkup_file)
        this.db.addCollection('history')
        this.db.addCollection('users')
    }



}