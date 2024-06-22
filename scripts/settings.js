/* global game */

import { resetActors } from './reset-actors.js'

// Define all module settings
export const registerModuleSettings = async function () {
  // Income Label
  game.settings.register('settlement-sheets', 'incomeCurrency', {
    name: 'Currency',
    hint: 'Determines the currency that the system uses for settlement income.',
    scope: 'world',
    config: true,
    default: 'gp',
    type: String,
    onChange: () => {
      // Update all current actors
      resetActors()
    }
  })

  // Morale Rename
  game.settings.register('settlement-sheets', 'moraleLabel', {
    name: 'Morale Label',
    hint: 'Renames the "Morale" field.',
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: () => {
      // Update all current actors
      resetActors()
    }
  })

  // Income Rename
  game.settings.register('settlement-sheets', 'incomeLabel', {
    name: 'Income Label',
    hint: 'Renames the "Income" field.',
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: () => {
      // Update all current actors
      resetActors()
    }
  })

  // Population Rename
  game.settings.register('settlement-sheets', 'populationLabel', {
    name: 'Population Label',
    hint: 'Renames the "Population" field.',
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: () => {
      // Update all current actors
      resetActors()
    }
  })
}
