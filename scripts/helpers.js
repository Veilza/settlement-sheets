/* global Handlebars, game */

// Define any helpers necessary for working with Handlebars
export const loadHelpers = async function () {
  Handlebars.registerHelper('appendCurrency', function (str) {
    const currency = game.settings.get('settlement-sheets', 'incomeCurrency')
    return `${str}${currency}`
  })
}
