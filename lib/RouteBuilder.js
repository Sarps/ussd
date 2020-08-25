
class RouteBuilder {

    static ROUTE_SEPARATOR = '?'
    static INPUT_SEPARATOR = ','

    inputs = new Map()
    data = new Map()
    input = ''

    constructor() {

    }

    static parse(route) {

    }

    _parseRoute(route) {
        let [view, data, inputs] = route.split('?')
        return {
            view, inputs: qs.parse(inputs), data: qs.parse(data)
        }
    }
}