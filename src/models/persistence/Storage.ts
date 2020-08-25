
export class Storage {

    setup(config?: any) {
        throw new Error('No storage instance identified')
    }

    addRoute(phone: string, sessionId: string, route: string): void {
        this.setup()
    }

    getCurrentRoute(sessionId: string): string {
        this.setup()
        return ''
    }

    popRoute(sessionId: string): void {
        this.setup()
    }

}