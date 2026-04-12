/* global game, foundry, ActorSheet, TextEditor, fromUuidSync, renderTemplate, Actor */

import { _onAddBuilding, _onOpenBuilding, _onRemoveBuilding } from "./actions.js"
import { prepareOverviewContext, prepareStatisticsContext, prepareBuildingsContext, prepareNotesContext } from "./prepare-partials.js"

const { HandlebarsApplicationMixin } = foundry.applications.api

// Extend the base ActorSheet and put all our functionality here.
export class SettlementActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      handler: SettlementActorSheet.onSubmitActorForm
    },
    classes: ['settlement-sheet'],
    position: {
      width: 600,
      height: 750
    },
    actions: {
      openBuilding: _onOpenBuilding,
      addBuilding: _onAddBuilding,
      removeBuilding: _onRemoveBuilding
    }
  }

  static PARTS = {
    header: {
      template: 'modules/settlement-sheets/templates/parts/settlement/header.hbs'
    },
    limited: {
      template: 'modules/settlement-sheets/templates/parts/settlement/limited.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    overview: {
      template: 'modules/settlement-sheets/templates/parts/settlement/overview.hbs'
    },
    statistics: {
      template: 'modules/settlement-sheets/templates/parts/settlement/statistics.hbs'
    },
    buildings: {
      template: 'modules/settlement-sheets/templates/parts/settlement/buildings.hbs'
    },
    notes: {
      template: 'modules/settlement-sheets/templates/parts/settlement/notes.hbs'
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
    buildings: {
      id: 'buildings',
      group: 'primary',
      label: 'settlement-sheets.TABS.Buildings'
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
    if (!game.user.isGM && this.actor.limited) context.permissions = 'limited'
    if (!game.user.isGM && this.actor.permission === 2) context.permissions = 'observer'
    if (game.user.isGM || this.actor.isOwner) context.permissions = 'owner'

    // Prepare items.
    await this._prepareItems(context)

    // Manipulate any data in this context that we need to

    // Tracker data from settings
    const statisticsList = game.settings.get('settlement-sheets', 'sheetStatistics')
    // Tracker data from the actor
    const trackerData = this.actor.system.trackers

    // Make some header and page tracker arrays
    context.header_trackers = []
    context.page_trackers = []

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
        statisticData = Object.assign({}, value, {
          id,
          value: trackerData[id].value
        })
      } else { // Otherwise, add it to the context and set it as some default data
        // Determine the correct default value to use based on type
        let defaultValue
        if (value.type === 'number') {
          defaultValue = 0
        } else if (value.type === 'string') {
          defaultValue = ''
        }
        // Add to the actor sheet
        await this.actor.update({
          [`system.trackers.${id}`]: {
            value: defaultValue
          }
        })

        // Assign the same data to the context
        statisticData = Object.assign({}, value, {
          id,
          value: defaultValue
        })
      }

      // Push to either header_trackers or page_trackers depending on showInHeader
      // as long as showOnSettlement is true
      if (statisticData.showOnSettlement && (context.permissions === 'owner' || statisticData.showToPlayers)) {
        if (statisticData.showInHeader) {
          context.header_trackers.push(statisticData)
        } else {
          context.page_trackers.push(statisticData)
        }
      }
    }

    // The description field
    context.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, {
      async: true,
      secrets: this.document.isOwner,
      relativeTo: this.document
    })

    // Influential people
    context.influentialPeople = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.influentialPeople, {
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
      actor: this.document
    }
  }

  async _prepareItems (context) {
    // Grab the list of statistics from the settings
    const statisticsList = game.settings.get('settlement-sheets', 'sheetStatistics')

    // Empty array to hold the buildings list in
    const buildings = []

    // Initialize or reset each value in the settlement's trackers
    for (const [tracker, details] of Object.entries(statisticsList)) {
      if (details.type === 'number') {
        // Initialize the tracker if it doesn't already exist
        if (!context.document.system.trackers[tracker]) {
          context.document.system.trackers[tracker] = { value: 0, ...details }
        } else {
          // Reset only the value while preserving other data
          context.document.system.trackers[tracker].value = 0
        }
      }
    }

    // Iterate through items, allocating to containers
    for (const i of context.document.items) {
      // We only work with buildings
      if (i.type === 'settlement-sheets.building') {
        // Enrich building description
        i.system.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(i.system.description, {
          async: true,
          secrets: this.document.isOwner,
          relativeTo: this.document
        })

        // Enrich building benefits
        i.system.benefits = await foundry.applications.ux.TextEditor.implementation.enrichHTML(i.system.benefits, {
          async: true,
          secrets: this.document.isOwner,
          relativeTo: this.document
        })

        // Iterate through each tracker in the building
        for (const [tracker, details] of Object.entries(statisticsList)) {
          if (details.type === 'number') {
            // Initialize the tracker with a default value if it doesn't already exist
            if (!context.document.system.trackers[tracker]) {
              context.document.system.trackers[tracker] = {
                value: 0
              }
            }

            // Add the item's tracker's value to the corresponding total
            context.document.system.trackers[tracker].value += i.system.trackers[tracker]?.value || 0
          }
        }

        // Append to the buildings list
        buildings.push(i)
      }
    }

    // Assign the list of buildings to the actor data
    context.document.system.buildings = buildings
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
      case 'buildings':
        return prepareBuildingsContext(context, item)
      case 'notes':
        return prepareNotesContext(context, item)
    }

    return context
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options)

    // If the document is in limited view, hide the non-limited header;
    // otherwise, don't include the limited part
    if (this.document.limited) {
      options.parts = ['limited', 'tabs', 'overview', 'statistics', 'buildings', 'notes']
    } else {
      options.parts = ['header', 'tabs', 'overview', 'statistics', 'buildings', 'notes']
    }
  }

  static async onSubmitActorForm(event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Update the actor data
    await this.document.update(submitData)
  }
}
