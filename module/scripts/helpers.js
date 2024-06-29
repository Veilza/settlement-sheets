/* global Handlebars */

// Define any helpers necessary for working with Handlebars
export const _loadHelpers = async function () {
  // Any helpers that will be needed will go here

  // If Equal
  Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })

  // If Not Equal
  Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })
}
