/* global Hooks, CONFIG, DocumentSheetConfig, Actor */

import { SettlementModel } from './settlement/settlement-model.js'
import { SettlementActorSheet } from './settlement/settlement-actor-sheet.js'
import { registerModuleSettings } from './settings.js'
import { preloadTemplates } from './preload-templates.js'

// Anything that needs to be ran alongside the initialisation of the world
Hooks.once('init', () => {
  // Register the brand new settlement sheet type
  Object.assign(CONFIG.Actor.dataModels, {
    'settlement-sheets.settlement': SettlementModel
  })

  DocumentSheetConfig.registerSheet(Actor, 'settlement-sheets', SettlementActorSheet, {
    types: ['settlement-sheets.settlement'],
    makeDefault: true
  })

  // Load the settings into the world
  registerModuleSettings()

  // Preload any Handlebars partials we need
  preloadTemplates()
})
