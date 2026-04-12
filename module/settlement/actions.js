export const _onOpenBuilding = async function (event, target) {
  event.preventDefault()

  const buildingUuid = target.getAttribute('data-uuid')

  fromUuidSync(buildingUuid).sheet.render(true)
}

export const _onAddBuilding = async function (event) {
  event.preventDefault()

  // Create the new building in the settlement
  const newBuilding = await this.actor.createEmbeddedDocuments('Item', [{
    name: game.i18n.localize('settlement-sheets.NewBuilding'),
    type: 'settlement-sheets.building'
  }])

  // Open the new building for editing
  newBuilding[0].sheet.render(true)
}

export const _onRemoveBuilding = async function (event, target) {
  event.preventDefault()

  const buildingUuid = target.getAttribute('data-uuid')
  const building = fromUuidSync(buildingUuid)

  const template = 'modules/settlement-sheets/templates/remove-building-dialog.hbs'
  const data = {
    name: building.name
  }
  const content = await foundry.applications.handlebars.renderTemplate(template, data)

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
        label: game.i18n.localize('Cancel'),
        icon: 'fa-solid fa-xmark'
      }
    ]
  })
}
