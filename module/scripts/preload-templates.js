/* global loadTemplates */
/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadTemplates = async function () {
  console.log('Preloading partials for the Settlement Sheets module.')

  // Define template paths to load
  const templatePaths = [
    // Settlement sheet
    'modules/settlement-sheets/templates/parts/settlement/overview.hbs',
    'modules/settlement-sheets/templates/parts/settlement/buildings.hbs',
    'modules/settlement-sheets/templates/parts/settlement/statistics.hbs',
    'modules/settlement-sheets/templates/parts/settlement/notes.hbs',

    // Building sheet
    'modules/settlement-sheets/templates/parts/building/overview.hbs',
    'modules/settlement-sheets/templates/parts/building/statistics.hbs',

    // Dialog templates
    'modules/settlement-sheets/templates/remove-building-dialog.hbs'
  ]

  /* Load the template parts
  */
  return loadTemplates(templatePaths)
}
