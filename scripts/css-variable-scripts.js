/* global game, ui */

// All CSS settings in a neat little list
const cssSettingsList = [
  {
    settingId: 'baseColor',
    label: 'Base Color',
    hint: 'Sets the base color for the sheet.',
    variable: '--settlement-sheet-base-color',
    default: '#74747480'
  },
  {
    settingId: 'backgroundColor',
    label: 'Background Color',
    hint: 'Sets the background color for the sheet.',
    variable: '--settlement-sheet-background-color',
    default: '#f0e9dd'
  },
  {
    settingId: 'navbarTextColor',
    label: 'Navbar Text Color',
    hint: 'Sets a custom color for the navbar text.',
    variable: '--settlement-sheet-navbar-text-color',
    default: '#f0f0e0'
  },
  {
    settingId: 'navbarLinkHighlight',
    label: 'Navbar Link Highlight Color',
    hint: 'Sets the highlight color for the navbar links.',
    variable: '--settlement-sheet-navbar-link-highlight',
    default: '#fc2020'
  },
  {
    settingId: 'navbarGradient1',
    label: 'Navbar Gradient 1',
    hint: 'Sets the first color of the navbar gradient.',
    variable: '--settlement-sheet-navbar-gradient-1',
    default: '#272727a4'
  },
  {
    settingId: 'navbarGradient2',
    label: 'Navbar Gradient 2',
    hint: 'Sets the second color of the navbar gradient.',
    variable: '--settlement-sheet-navbar-gradient-2',
    default: '#1f1f1fa4'
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
        // If the new color isn't an empty string, send to the updateCSSVariable function
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

/**
 * Function to update the CSS variable
 */
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
  return /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(hexcode)
}
