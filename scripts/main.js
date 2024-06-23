/* global Hooks, CONFIG, DocumentSheetConfig, Actor, Item */

// Base Foundry scripts
import { registerModuleSettings } from './settings.js'
import { preloadTemplates } from './preload-templates.js'
import { loadHelpers } from './helpers.js'
// Settlement scripts
import { SettlementModel } from './settlement/settlement-model.js'
import { SettlementActorSheet } from './settlement/settlement-actor-sheet.js'
// Building scripts
import { BuildingItemSheet } from './building/building-item-sheet.js'
import { BuildingModel } from './building/building-model.js'
// Other helpful scripts
import { initCssSettings } from './css-variable-scripts.js'

// Anything that needs to be ran alongside the initialisation of the world
Hooks.once('init', () => {
  // Register the brand new settlement actor type
  Object.assign(CONFIG.Actor.dataModels, {
    'settlement-sheets.settlement': SettlementModel
  })
  DocumentSheetConfig.registerSheet(Actor, 'settlement-sheets', SettlementActorSheet, {
    types: ['settlement-sheets.settlement'],
    makeDefault: true
  })

  // Register the brand new building item type
  Object.assign(CONFIG.Item.dataModels, {
    'settlement-sheets.building': BuildingModel
  })
  DocumentSheetConfig.registerSheet(Item, 'settlement-sheets', BuildingItemSheet, {
    types: ['settlement-sheets.building'],
    makeDefault: true
  })

  // Load the settings into the world
  registerModuleSettings()

  // Input any helpers the module has
  loadHelpers()

  // Preload any Handlebars partials we need
  preloadTemplates()
})

Hooks.once('ready', () => {
  initCssSettings()
})
