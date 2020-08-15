const {render} = require('./lib')

module.exports = (text,) => {

    if (text === '')
        return `CON ${render('samples.pay.menu', {})}`
    if (text === '1')
        return `CON ${render('samples.pay.select_bank', {})}`
    if (text === '2')
        return `CON ${render('samples.pay.select_momo_acct', {})}`
    if (text === '3' || text === '4')
        return `END ${render('samples.not_ready', {})}`
    if (/^1\*\d$/.test(text))
        return `CON ${render('samples.pay.select_bank_acct', {})}`
    if (text === '2*2')
        return `CON ${render('samples.pay.enter_momo_phone', {})}`
    if (/^2\*2\*\d+$/.test(text) || text === '2*1' || /^1\*\d\*\d$/.test(text))
        return `CON ${render('samples.pay.confirm_pay', {})}`
    else
        return `END ${render('samples.thank_you', {})}`

}


