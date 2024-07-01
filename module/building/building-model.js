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

    schema.benefits = new fields.HTMLField({
      initial: '',
      required: false,
      blank: true
    })

    // Sheet trackers
    schema.trackers = new fields.ObjectField({
      initial: {},
      required: false
    })

    // Notes Tab
    schema.note = new fields.SchemaField({
      public: new fields.HTMLField({
        required: false,
        blank: true,
        initial: ''
      }),
      private: new fields.HTMLField({
        required: false,
        blank: true,
        initial: '',
        gmOnly: true
      })
    },
    {
      label: 'settlement-sheets.Notes'
    })

    return schema
  }
}
