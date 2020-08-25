const dp = require('dot-prop');

export default {

    formatText(text: string, data: any) {
        let matches = text.match(/{{[^}]+}}/g)
        if (!matches) return text
        return matches
            .map(match => ({
                match, subst: dp.get(data, match.replace(/{{([^}]+)}}/, '$1'), match)
            })).reduce((acc, cur) => acc.replace(cur.match, cur.subst), text)
    },

    extract(data: any, dot: string, defaultValue: any): any {
        return dp.get(data, dot, defaultValue)
    }
}