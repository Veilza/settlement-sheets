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

    // The description field
    context.description = await TextEditor.enrichHTML(this.object.system.description, {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    })

    // Return the context once we're done with our changes
    return context
  }

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)
  }
}
