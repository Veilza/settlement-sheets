/* global game, foundry, ItemSheet, TextEditor */

// Extend the base ActorSheet and put all our functionality here.
export class BuildingItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['building-sheet'],
      template: 'modules/settlement-sheets/templates/settlement-sheet.hbs',
      width: 600,
      height: 500,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'overview'
      }]
    })
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.item.limited) return 'modules/settlement-sheets/templates/building-sheet-limited.hbs'
    return 'modules/settlement-sheets/templates/building-sheet.hbs'
  }

  /* -------------------------------------------- */

  /** @override */
  async getData (options = {}) {
    // Define the context we're using
    const context = await super.getData(options)

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
    context.description = await TextEditor.enrichHTML(this.object.system.description, {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    })

    // The benefits field
    context.benefits = await TextEditor.enrichHTML(this.object.system.benefits, {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    })

    if (!game.user.isGM && this.item.limited) context.permissions = 'limited'
    if (!game.user.isGM && this.item.observer) context.permissions = 'observer'
    if (game.user.isGM || this.item.isOwner) context.permissions = 'owner'

    // Return the context once we're done with our changes
    return context
  }

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)
  }
}
