/* global foundry */

export class BuildingModel extends foundry.abstract.TypeDataModel {
  static defineSchema () {
    const fields = foundry.data.fields
    const schema = {}

    // Define the schema fields here
    schema.description = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    return schema
  }
}
