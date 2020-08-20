
module.exports = class Storage {

    setup() {
        throw new Error('No storage instance identified')
    }

    addRoute(phone, sessionId, route) {
        this.setup()
    }

    /**
     *
     * @param {string} sessionId
     * @return {string}
     */
    getCurrentRoute(sessionId) {
        this.setup()
    }

    popRoute(sessionId) {
        this.setup()
    }

}