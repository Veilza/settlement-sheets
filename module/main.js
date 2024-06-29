/* global Hooks, CONFIG, DocumentSheetConfig, Actor, Item */

// Base Foundry scripts
import { _registerModuleSettings } from './scripts/settings.js'
import { _preloadTemplates } from './scripts/preload-templates.js'
import { _loadHelpers } from './scripts/helpers.js'
// Settlement scripts
import { SettlementModel } from './settlement/settlement-model.js'
import { SettlementActorSheet } from './settlement/settlement-actor-sheet.js'
// Building scripts
import { BuildingItemSheet } from './building/building-item-sheet.js'
import { BuildingModel } from './building/building-model.js'

// Anything that needs to be ran alongside the initialisation of the world
Hooks.once('init', () => {
  // Register the settlement actor type
  Object.assign(CONFIG.Actor.dataModels, {
    'settlement-sheets.settlement': SettlementModel
  })
  DocumentSheetConfig.registerSheet(Actor, 'settlement-sheets', SettlementActorSheet, {
    types: ['settlement-sheets.settlement'],
    makeDefault: true
  })

  // Register the building item type
  Object.assign(CONFIG.Item.dataModels, {
    'settlement-sheets.building': BuildingModel
  })
  DocumentSheetConfig.registerSheet(Item, 'settlement-sheets', BuildingItemSheet, {
    types: ['settlement-sheets.building'],
    makeDefault: true
  })

  // Input any helpers the module has
  _loadHelpers()

  // Preload any Handlebars partials we need
  _preloadTemplates()
})

Hooks.once('ready', () => {
  // Load the settings into the world
  _registerModuleSettings()
})
