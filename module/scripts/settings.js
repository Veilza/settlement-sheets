import { _registerCssSettings } from './css-variable-scripts.js'
import { _registerStatistics } from './statistics-scripts.js'

// Define all module settings
export const _registerModuleSettings = async function () {
  // Register the statistics
  _registerStatistics()

  // Register all CSS settings
  _registerCssSettings()
}
