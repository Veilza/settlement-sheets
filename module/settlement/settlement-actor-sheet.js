/* global game, foundry, ActorSheet, TextEditor, fromUuidSync, renderTemplate */

// Extend the base ActorSheet and put all our functionality here.
export class SettlementActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['settlement-sheet'],
      template: 'modules/settlement-sheets/templates/settlement-sheet.hbs',
      width: 600,
      height: 750,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'overview'
      }],
      dragDrop: [{
        dragSelector: '.entity.actor.settlement-sheets.building',
        dropSelector: null
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
  async getData (options = {}) {
    // Define the context we're using
    const context = await super.getData(options)

    // Manipulate any data in this context that we need to
    // Label data from settings
    // Morale
    const moraleLabel = game.settings.get('settlement-sheets', 'moraleLabel')
    context.moraleLabel = moraleLabel || game.i18n.localize('settlement-sheets.Morale')
    // Income
    const incomeLabel = game.settings.get('settlement-sheets', 'incomeLabel')
    context.incomeLabel = incomeLabel || game.i18n.localize('settlement-sheets.Income')
    // Population
    const populationLabel = game.settings.get('settlement-sheets', 'populationLabel')
    context.populationLabel = populationLabel || game.i18n.localize('settlement-sheets.Population')

    // The description field
    context.description = await TextEditor.enrichHTML(this.object.system.description, {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    })

    // Influential people
    context.influentialPeople = await TextEditor.enrichHTML(this.object.system.influentialPeople, {
      async: true,
      secrets: this.object.isOwner,
      relativeTo: this.object
    })

    // Private and Public notes
    context.note = {
      public: await TextEditor.enrichHTML(this.object.system.note.public, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      }),
      private: await TextEditor.enrichHTML(this.object.system.note.private, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      })
    }

    // Prepare items.
    await this._prepareItems(context)

    // Return the context once we're done with our changes
    return context
  }

  async _prepareItems (context) {
    // Empty array to hold the buildings list in
    const buildings = []

    // Iterate through items, allocating to containers
    for (const i of context.items) {
      // We only work with buildings
      if (i.type === 'settlement-sheets.building') {
        // Add UUID to the building data
        i.uuid = `Actor.${this.actor.id}.Item.${i._id}`

        // Enrich building description
        i.system.description = await TextEditor.enrichHTML(i.system.description, {
          async: true,
          secrets: this.object.isOwner,
          relativeTo: this.object
        })

        // Enrich building benefits
        i.system.benefits = await TextEditor.enrichHTML(i.system.benefits, {
          async: true,
          secrets: this.object.isOwner,
          relativeTo: this.object
        })

        // Append to the buildings list
        buildings.push(i)
      }
    }

    // Assign the list of buildings to the actor data
    context.actor.system.buildings = buildings
  }

  // Activate any listeners
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Open an existing building on the sheet
    html.find('.open-building').click(this._onOpenBuilding.bind(this))

    // Create a new building on the sheet
    html.find('.add-building').click(this._onAddBuilding.bind(this))

    // Remove a new building from the sheet
    html.find('.remove-building').click(this._onRemoveBuilding.bind(this))
  }

  // Handle opening an existing building in a settlement
  async _onOpenBuilding (event) {
    event.preventDefault()

    const dataset = event.currentTarget.dataset
    const buildingUuid = dataset.uuid

    fromUuidSync(buildingUuid).sheet.render(true)
  }

  // Handle adding a new building to a settlement
  async _onAddBuilding (event) {
    event.preventDefault()

    // Create the new building in the settlement
    const newBuilding = await this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('settlement-sheets.NewBuilding'),
      type: 'settlement-sheets.building'
    }])

    // Open the new building for editing
    newBuilding[0].sheet.render(true)
  }

  // Handle removing a building from a settlement
  async _onRemoveBuilding (event) {
    event.preventDefault()

    const dataset = event.currentTarget.dataset
    const buildingUuid = dataset.uuid
    const building = fromUuidSync(buildingUuid)

    const template = 'modules/settlement-sheets/templates/remove-building-dialog.hbs'
    const data = {
      name: building.name
    }
    const content = await renderTemplate(template, data)

    foundry.applications.api.DialogV2.wait({
      window: {
        title: game.i18n.localize('settlement-sheets.RemoveBuilding')
      },
      content,
      buttons: [
        {
          action: 'confirm',
          label: game.i18n.localize('settlement-sheets.RemoveBuilding'),
          icon: 'fas fa-check',
          callback: async () => {
            this.actor.deleteEmbeddedDocuments('Item', [building.id])
          }
        },
        {
          action: 'cancel',
          label: game.i18n.localize('settlement-sheets.Cancel'),
          icon: 'fa-solid fa-xmark'
        }
      ]
    })
  }
}
