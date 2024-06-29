/* global game, ui */

/**
 * Function to re-render the actors across the system
 * @param actors (Default: All actors) A list of actors to reset the sheets of
 */
export const _rerenderActors = async (actors) => {
  // Get all actors if a list of actors isn't already defined
  if (!actors) {
    actors = [
      game.actors.contents,
      game.scenes.contents.flatMap((scene) => scene.tokens.contents).flatMap((token) => token.actor || [])
    ].flat()
  }

  // Loop through chosen actors
  for (const actor of actors) {
    // Reset and re-render the settlement sheets
    if (actor.type === 'settlement-sheets.settlement') {
      actor.reset()
      actor.render()
    }
  }
}

/**
 * Function to re-render the items across the system
 * @param items (Default: All items) A list of items to reset the sheets of
 */
export const _rerenderItems = async (items) => {
  // Get all items if a list of actors isn't already defined
  if (!items) {
    items = [
      game.items.contents
    ].flat()
  }

  // Loop through chosen actors
  for (const item of items) {
    // Reset and re-render the building sheets
    if (item.type === 'settlement-sheets.building') {
      item.reset()
      item.render()
    }
  }
}

/**
 * Function to re-render the menus across the system
 * @param menuid (Default: All items) A list of items to reset the sheets of
 */
export const _rerenderMenu = async (menuid) => {
  if (!menuid) return

  // Get the windows for the given menuid
  const menuWindow = Object.values(ui.windows).filter(w => (w.id === menuid))

  // Re-render each of them
  for (const window of menuWindow) {
    window.render()
  }
}
