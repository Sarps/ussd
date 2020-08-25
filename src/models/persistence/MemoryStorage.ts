
const loki = require('lokijs')
import { Storage } from  '~/models/persistence/Storage'

export class MemoryStorage extends Storage {

    db: any
    routeCollection: any

    constructor({file}: MemoryStorageConfig) {
        super();
        this.db = new loki(file)
        this.routeCollection = this.db.addCollection('routes')
    }


    addRoute(phone: string, sessionId: string, route: string) {
        this.routeCollection.insert({phone, sessionId, route, 'date_created': new Date()})
    }

    getCurrentRoute(sessionId: string): string {
        return this.routeCollection.chain().find({sessionId})
            .simplesort('date_created', {desc: true}).data()[0].route
    }

    popRoute(sessionId: string) {
        return this.routeCollection.chain().find({sessionId})
            .simplesort('date_created', {desc: true}).remove()
    }

}

interface MemoryStorageConfig {
    file: string
}