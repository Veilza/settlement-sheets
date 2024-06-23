/* global game, ui */

// All CSS settings in a neat little list
const cssSettingsList = [
  {
    settingId: 'navbarColor',
    label: 'Navbar Color',
    hint: 'Sets a custom color for the navbar font.',
    variable: '--navbar-font-color',
    default: '#f0f0e0'
  },
  {
    settingId: 'linkHighlight',
    label: 'Link Highlight Color',
    hint: 'Sets the highlight color for the navbar links.',
    variable: '--link-highlight',
    default: '#fc2020'
  }
]

/**
 * Function to register CSS settings on game start
 */
export const registerCssSettings = async () => {
  // Iterate through each setting and register it
  cssSettingsList.forEach((setting) => {
    game.settings.register('settlement-sheets', setting.settingId, {
      name: setting.label,
      hint: setting.hint,
      scope: 'world',
      config: true,
      default: setting.default,
      type: String,
      onChange: (newColor) => {
        if (newColor !== '') {
          updateCSSVariable(setting.settingId, setting.variable, newColor)
        } else {
          // Reset to default if blank
          const defaultColor = game.settings.settings.get(`settlement-sheets.${setting.settingId}`).default
          game.settings.set('settlement-sheets', setting.settingId, defaultColor)
        }
      }
    })
  })
}

/**
 * Function to initialize CSS styling customizations on game start
 */
export const initCssSettings = async () => {
  // Iterate through each setting and update the variable if needed
  cssSettingsList.forEach((setting) => {
    const value = game.settings.get('settlement-sheets', setting.settingId)
    if (value) {
      updateCSSVariable(setting.settingId, setting.variable, value)
    }
  })
}

// Function to update the CSS variable
function updateCSSVariable (settingName, variableName, newColor) {
  let validColor = true
  // If no value is being provided for variableName or settingName, we do nothing
  if (!variableName || !settingName) return

  // Add # symbol if not included in the hexcode entered
  const hexcode = newColor.startsWith('#') ? newColor : `#${newColor}`

  // If this isn't a valid hexcode, show the error message
  if (!validateHexcode(hexcode)) {
    ui.notifications.error(`Invalid hexcode "${hexcode}" given for setting ID settlement-sheets.${settingName}`)
    validColor = true
  }

  // If no color is provided or the color is invalid, reset to the default color
  if (!newColor || !validColor) {
    const defaultColor = game.settings.settings.get(`settlement-sheets.${settingName}`).default
    document.documentElement.style.setProperty(variableName, defaultColor)
  } else {
    // Update the variable with the new color
    document.documentElement.style.setProperty(variableName, newColor)
  }
}

// Quick way to validate a hexcode
function validateHexcode (hexcode) {
  return /^#?([0-9A-F]{3}){1,2}$/i.test(hexcode)
}
