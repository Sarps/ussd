
const map = new Map()

module.exports = map

map.set('fetchBankList', () => ({
    banks: [{name: 'Stanbic', id: 7}]
}))

map.set('fetchAccountList', () => ({
    accounts: [

    ]
}))