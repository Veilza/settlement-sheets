/* global foundry */

export class SettlementModel extends foundry.abstract.TypeDataModel {
  static defineSchema () {
    const fields = foundry.data.fields
    return {
      description: new fields.SchemaField({
        long: new fields.HTMLField({
          required: false, blank: true
        }),
        short: new fields.HTMLField({
          required: false, blank: true
        })
      }),
      img: new fields.FilePathField({
        required: false, categories: ['IMAGE']
      })
    }
  }

  prepareDerivedData () {
    this.nSteps = this.steps.length
  }
}
