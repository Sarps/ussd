
const xpath = require('xpath')
const rp = require('route-parser');

module.exports = class Route {

    view = null
    domain = ''
    route = null

    static fromXml(node) {
        const v = new Route()
        v.view = node.getAttribute('view')
        v.domain = node.getAttribute('domain')
        const innerText = xpath.select('.//text()', node)
            .reduce((acc, cur) => acc+cur, '')
        v.route = new rp(innerText)
        return v;
    }


    matches(domain, route) {
        return this.domain && this.domain.length && domain !== this.domain ? false : this.route.match(route);
    }

}