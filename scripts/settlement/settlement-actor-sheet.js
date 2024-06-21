/* global game, foundry, ActorSheet, TextEditor */

// Extend the base ActorSheet and put all our functionality here.
export class SettlementActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['settlement-sheet'],
      template: 'modules/settlement-sheets/templates/settlement-sheet.hbs',
      width: 1050,
      height: 700,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'overview'
      }]
    })
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'modules/settlement-sheets/templates/settlement-sheet-limited.hbs'
    return 'modules/settlement-sheets/templates/settlement-sheet.hbs'
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()
    // const actorData = this.object.system

    // Enrich descriptions
    if (data.buildings) {
      for (const i of data.buildings) {
        i.system.enrichedDescription = await TextEditor.enrichHTML(i.system.description)
      }
    }
  }

  async _prepareItems (sheetData) {
    const actorData = sheetData.actor

    console.log(actorData)
  }

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Resource squares (Health, Willpower)
    html.find('open-building').click(this._onOpenBuilding.bind(this))
  }

  _onOpenBuilding (event) {
    event.preventDefault()
  }
}
