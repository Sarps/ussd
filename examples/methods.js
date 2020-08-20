
const map = new Map()

module.exports = map

map.set('fetchBankList', () => ({
    banks: [{name: 'Stanbic', id: 7}]
}))

map.set('fetchAccountList', () => ({
    accounts: [
        {name: 'Savings', account: '9040009991234'},
        {name: 'Current', account: '9040001239087'},
    ]
}))