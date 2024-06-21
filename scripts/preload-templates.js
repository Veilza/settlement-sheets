/* global loadTemplates */
/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadTemplates = async function () {
  console.log('Preloading Settlement Sheet partials.')

  // Define template paths to load
  const templatePaths = [
    // Settlement sheet
    'modules/settlement-sheets/templates/parts/settlement/overview.hbs',
    'modules/settlement-sheets/templates/parts/settlement/statistics.hbs'
  ]

  /* Load the template parts
  */
  return loadTemplates(templatePaths)
}
