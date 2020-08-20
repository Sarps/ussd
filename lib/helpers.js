const dp = require('dot-prop');

module.exports = {

    /**
     *
     * @param {string} text
     * @param {{}} data
     * @return {string}
     */
    formatText(text, data) {
        let matches = text.match(/{{[^}]+}}/g)
        if (!matches) return text
        return matches
            .map(match => ({
                match, subst: dp.get(data, match.replace(/{{([^}]+)}}/, '$1'), '')
            })).reduce((acc, cur) => acc.replace(cur.match, cur.subst), text)
    },

    extract(data, dot, defaultValue) {
        return dp.get(data, dot, defaultValue)
    }
}