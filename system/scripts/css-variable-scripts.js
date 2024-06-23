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

  // If this isn't a valid hexcode, show the error message
  if (!validateColor(newColor)) {
    ui.notifications.error(`Invalid hexcode or color name "${newColor}" given for setting ID settlement-sheets.${settingName}`)
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
function validateColor (hexcode) {
  // A list of every valid CSS color name to check through
  const cssColorNames = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
  ]

  const isHex = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(hexcode)
  const isColorName = cssColorNames.includes(hexcode.toLowerCase())

  return isHex || isColorName
}
