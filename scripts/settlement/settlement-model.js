/* global foundry */

export class SettlementModel extends foundry.abstract.TypeDataModel {
  static defineSchema () {
    const fields = foundry.data.fields
    const schema = {}

    // Overview Tab
    schema.description = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    schema.influentialPeople = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    // Overview tab
    schema.morale = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.Morale'
    })

    schema.income = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.Income'
    })

    schema.population = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.Population'
    })

    // Notes Tab
    schema.notes = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    return schema
  }

  // Data prep
  prepareDerivedData () {
    // Set the morale
    this.morale = 4 + 4 + 3 + 2
  }
}
