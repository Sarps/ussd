
module.exports = class UssdRequest {

    text
    phone
    network
    session
    ussd


    constructor({phone, text, network, session, ussd}) {
        this.text = text
        this.phone = phone
        this.network = network
        this.session = session
        this.ussd = ussd
    }

    get isNew() {
        return !this.text || !this.text.length
    }

}