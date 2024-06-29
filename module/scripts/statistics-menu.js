/* global game, FormApplication, foundry */

import { _resetStatisticsToDefault } from './statistics-scripts.js'

export class StatisticsMenu extends FormApplication {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('settlement-sheets.STATS.StatisticsMenu'),
      id: 'settlement-sheets-statistics',
      classes: ['settlement-sheets'],
      template: 'modules/settlement-sheets/templates/statistics-menu.hbs',
      width: 550,
      height: 500,
      resizable: true,
      closeOnSubmit: true
    })
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const context = await super.getData()

    // A list of type choices for the stats
    context.statTypeChoices = {
      number: 'Number',
      string: 'String'
    }

    // Grab the list of statistics from game settings
    context.statistics = game.settings.get('settlement-sheets', 'sheetStatistics')

    return context
  }

  /** @override */

  async _updateObject (event, formData) {
    const updatedStatistics = {}

    // Cycle through the formData and compose it into an object separated by
    // the first property in the key
    for (const key in formData) {
      const [property, attribute] = key.split('.')
      // If the property doesn't already exist, create it as a blank object
      if (!updatedStatistics[property]) {
        updatedStatistics[property] = {}
      }

      // Add property to the updatedStatistics
      updatedStatistics[property][attribute] = formData[key]
    }

    // Update the settings
    game.settings.set('settlement-sheets', 'sheetStatistics', updatedStatistics)
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Listeners will go here
    html.find('save-button').on('click', async function () {
      // Empty object to store statistics in
      const statistics = {}

      // Go through each stat-section and get their values
      html.querySelectorAll('.stat-section').forEach(section => {
        const id = section.id
        statistics[id] = {
          label: html.getElementById(`${id}-label`).value,
          type: html.getElementById(`${id}-type`).value,
          prepend: html.getElementById(`${id}-prepend`).value,
          append: html.getElementById(`${id}-append`).value,
          showToPlayers: html.getElementById(`${id}-showToPlayers`).checked,
          showInHeader: html.getElementById(`${id}-showInHeader`).checked,
          showOnSettlement: html.getElementById(`${id}-showOnSettlement`).checked
        }
      })
    })

    // Listeners will go here

    // Add a new statistic to the list
    html.find('.add-new-statistic').on('click', async function (event) {
      event.preventDefault()
      // Get the list of statistics
      const statistics = game.settings.get('settlement-sheets', 'sheetStatistics')

      // Add the new statistic to the list with some basic data
      statistics[foundry.utils.randomID(8)] = {
        label: game.i18n.localize('settlement-sheets.STATS.NewStatistic'),
        type: 'number',
        prepend: '',
        append: '',
        showToPlayers: false,
        showInHeader: false,
        showOnSettlement: true
      }

      // Set the updated list of statistics
      game.settings.set('settlement-sheets', 'sheetStatistics', statistics)
    })

    // Remove a statistic from the list
    html.find('.remove-statistic').on('click', async function (event) {
      event.preventDefault()

      const id = event.currentTarget.dataset.id

      // Get the list of statistics
      const statistics = game.settings.get('settlement-sheets', 'sheetStatistics')

      // Delete the targeted statistic from the list
      delete statistics[id]

      // Set the updated list of statistics
      game.settings.set('settlement-sheets', 'sheetStatistics', statistics)
    })

    // Reset statistics to their default values
    html.find('.reset-statistics').on('click', async function (event) {
      event.preventDefault()

      foundry.applications.api.DialogV2.wait({
        window: {
          title: game.i18n.localize('settlement-sheets.STATS.ResetStatistics')
        },
        content: game.i18n.localize('settlement-sheets.STATS.ResetStatisticsHint'),
        buttons: [
          {
            action: 'confirm',
            label: game.i18n.localize('settlement-sheets.STATS.ResetStatistics'),
            icon: 'fas fa-check',
            callback: async () => {
              _resetStatisticsToDefault()
            }
          },
          {
            action: 'cancel',
            label: game.i18n.localize('Cancel'),
            icon: 'fa-solid fa-xmark'
          }
        ]
      })
    })
  }
}
