
const xpath = require('xpath')
const rp = require('route-parser');

export class Route {

    view = null
    domain = ''
    route = null

    static fromXml(node: any): Route {
        const v = new Route()
        v.view = node.getAttribute('view')
        v.domain = node.getAttribute('domain')
        const innerText = xpath.select('.//text()', node)
            .reduce((acc: string, cur: string) => acc + cur, '')
        v.route = new rp(innerText)
        return v;
    }


    matches(domain?: string, route?: string): boolean {
        return !(this.domain && this.domain.length && domain !== this.domain) && this.route.match(route);
    }

}