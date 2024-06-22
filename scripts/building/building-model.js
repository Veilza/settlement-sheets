/* global foundry */

export class BuildingModel extends foundry.abstract.TypeDataModel {
  static defineSchema () {
    const fields = foundry.data.fields
    const schema = {}

    // Overview tab
    schema.description = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    // Statistics tab
    schema.cost = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.Cost'
    })

    schema.moraleImpact = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.MoraleImpact'
    })

    schema.incomeImpact = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.IncomeImpact'
    })

    schema.populationImpact = new fields.NumberField({
      nullable: false,
      integer: true,
      initial: 0,
      label: 'settlement-sheets.PopulationImpact'
    })

    return schema
  }
}
