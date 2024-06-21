/* global game */

// Define all module settings
export const registerModuleSettings = async function () {
  // Keybinding for opening the token art
  game.settings.register('settlement-sheets', 'income-label', {
    name: 'Income Label',
    hint: 'Determines the label that the system uses for settlement income.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  })
}
