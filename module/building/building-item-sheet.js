/* global game, foundry, ItemSheet, TextEditor, Item */

import { prepareNotesContext, prepareOverviewContext, prepareStatisticsContext } from "./prepare-partials.js"

const { HandlebarsApplicationMixin } = foundry.applications.api

// Extend the base ActorSheet and put all our functionality here.
export class BuildingItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      handler: BuildingItemSheet.onSubmitItemForm
    },
    classes: ['settlement-sheet'],
    position: {
      width: 600,
      height: 500
    }
  }

  static PARTS = {
    header: {
      template: 'modules/settlement-sheets/templates/parts/building/header.hbs'
    },
    limited: {
      template: 'modules/settlement-sheets/templates/parts/building/limited.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    overview: {
      template: 'modules/settlement-sheets/templates/parts/building/overview.hbs'
    },
    statistics: {
      template: 'modules/settlement-sheets/templates/parts/building/statistics.hbs'
    },
    notes: {
      template: 'modules/settlement-sheets/templates/parts/building/notes.hbs'
    }
  }

  tabs = {
    overview: {
      id: 'overview',
      group: 'primary',
      label: 'settlement-sheets.TABS.Overview'
    },
    statistics: {
      id: 'statistics',
      group: 'primary',
      label: 'settlement-sheets.TABS.Statistics'
    },
    notes: {
      id: 'notes',
      group: 'primary',
      label: 'settlement-sheets.TABS.Notes'
    }
  }

  tabGroups = {
    primary: 'overview'
  }

  getTabs() {
    const tabs = this.tabs

    // Remove hidden tabs
    for (const key in tabs) {
      if (tabs[key].hidden) delete tabs[key]
    }

    for (const tab of Object.values(tabs)) {
      tab.active = this.tabGroups[tab.group] === tab.id
      tab.cssClass = tab.active ? 'active' : ''
    }

    return tabs
  }

  async _prepareContext() {
    // Top-level variables
    const context = await super._prepareContext()

    // Prepare tabs
    context.tabs = this.getTabs()

    // Generate quick references in the context for permissions levels
    if (!game.user.isGM && this.item.limited) context.permissions = 'limited'
    if (!game.user.isGM && this.item.observer) context.permissions = 'observer'
    if (game.user.isGM || this.item.isOwner) context.permissions = 'owner'

    // Manipulate any data in this context that we need to

    // Tracker data from settings
    const statisticsList = game.settings.get('settlement-sheets', 'sheetStatistics')
    // Tracker data from the item
    const trackerData = this.item.system.trackers

    // Make a tracker array
    context.trackers = []

    // Clean up non-existent statistics, such as custom ones that no longer exist
    const validStatistics = new Set(Object.keys(statisticsList))
    for (const id of Object.keys(trackerData)) {
      if (!validStatistics.has(id)) {
        delete trackerData[id]
      }
    }

    for (const [id, value] of Object.entries(statisticsList)) {
      let statisticData = {}

      // If the context has a tracker with the key, grab its current value
      if (Object.prototype.hasOwnProperty.call(trackerData, id)) {
        statisticData = Object.assign({
          id,
          value: trackerData[id].value
        }, value)
      } else { // Otherwise, add it to the context and set it as some default data
        // Determine the correct default value to use based on type
        let defaultValue
        if (value.type === 'number') {
          defaultValue = 0
        } else if (value.type === 'string') {
          defaultValue = ''
        }
        // Add to the item sheet
        await this.item.update({
          [`system.trackers.${id}`]: {
            value: defaultValue
          }
        })

        // Assign the same data to the context
        statisticData = Object.assign({
          id,
          value: defaultValue
        }, value)
      }

      // Push to either header_trackers or page_trackers depending on showInHeader
      // as long as showOnSettlement is true
      context.trackers.push(statisticData)
    }

    // The description field
    context.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, {
      async: true,
      secrets: this.document.isOwner,
      relativeTo: this.document
    })

    // The benefits field
    context.benefits = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.benefits, {
      async: true,
      secrets: this.document.isOwner,
      relativeTo: this.document
    })

    // Private and Public notes
    context.note = {
      public: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.note.public, {
        async: true,
        secrets: this.document.isOwner,
        relativeTo: this.document
      }),
      private: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.note.private, {
        async: true,
        secrets: this.document.isOwner,
        relativeTo: this.document
      })
    }

    // Return the context once we're done with our changes
    return {
      ...context,
      item: this.document
    }
  }

  async _preparePartContext(partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const item = this.item

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'overview':
        return prepareOverviewContext(context, item)
      case 'statistics':
        return prepareStatisticsContext(context, item)
      case 'notes':
        return prepareNotesContext(context, item)
    }

    return context
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options)

    // If the document is in limited view, hide the notes and non-limited header;
    // otherwise, don't include the limited part
    if (this.document.limited) {
      options.parts = ['limited', 'tabs', 'overview', 'statistics']
    } else {
      options.parts = ['header', 'tabs', 'overview', 'statistics', 'notes']
    }
  }

  static async onSubmitItemForm(event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Update the item data
    await this.document.update(submitData)
  }
}
