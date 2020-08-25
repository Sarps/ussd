
export class UssdRequest {

    text: string
    phone: string
    network: string
    session: string
    ussd: string


    constructor({phone, text, network, session, ussd}: UssdRequestConfig) {
        this.text = text
        this.phone = phone
        this.network = network
        this.session = session
        this.ussd = ussd
    }

    get isNew(): boolean {
        return !this.text || !this.text.length
    }

}

declare interface UssdRequestConfig {
    text: string
    phone: string
    network: string
    session: string
    ussd: string
}