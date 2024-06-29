/* global game */

import { StatisticsMenu } from './statistics-menu.js'
import { _rerenderActors, _rerenderItems, _rerenderMenu } from './rerender-scripts.js'

// The default statistics settings that can be appended to
const defaultStatisticsList = {
  income: {
    label: 'settlement-sheets.STATS.Income',
    type: 'number',
    prepend: '',
    append: 'gp',
    showToPlayers: true,
    showInHeader: true,
    showOnSettlement: true
  },
  morale: {
    label: 'settlement-sheets.STATS.Morale',
    type: 'number',
    prepend: '',
    append: '',
    showToPlayers: true,
    showInHeader: true,
    showOnSettlement: true
  },
  population: {
    label: 'settlement-sheets.STATS.Population',
    type: 'number',
    prepend: '',
    append: '',
    showToPlayers: true,
    showInHeader: true,
    showOnSettlement: true
  },
  cost: {
    label: 'settlement-sheets.STATS.Cost',
    type: 'number',
    prepend: '',
    append: '',
    showToPlayers: false,
    showInHeader: false,
    showOnSettlement: false
  }
}

/**
 * Function to register statistics on game start
 */
export const _registerStatistics = async () => {
  // Register the list of sheet statistics
  game.settings.register('settlement-sheets', 'sheetStatistics', {
    name: game.i18n.localize('settlement-sheets.STATS.SheetStatistics'),
    hint: game.i18n.localize('settlement-sheets.STATS.SheetStatistics'),
    scope: 'world',
    config: false,
    default: defaultStatisticsList,
    type: Object,
    onChange: () => {
      // Reset any settlement actors and building sheets
      _rerenderActors()
      _rerenderItems()

      // Reset the statistics editor menu
      _rerenderMenu('settlement-sheets-statistics')
    }
  })

  // Register the statistics editor menu
  game.settings.registerMenu('settlement-sheets', 'statisticsMenu', {
    name: game.i18n.localize('settlement-sheets.STATS.EditStatistics'),
    hint: game.i18n.localize('settlement-sheets.STATS.EditStatisticsHint'),
    label: game.i18n.localize('settlement-sheets.STATS.EditStatistics'),
    icon: 'fas fa-bars',
    type: StatisticsMenu,
    restricted: true
  })
}

export const _resetStatisticsToDefault = async () => {
  game.settings.set('settlement-sheets', 'sheetStatistics', defaultStatisticsList)
}
