export const prepareOverviewContext = async function (context) {
  // Tab data
  context.tab = context.tabs.overview

  return context
}

export const prepareStatisticsContext = async function (context) {
  // Tab data
  context.tab = context.tabs.statistics

  return context
}

export const prepareBuildingsContext = async function (context) {
  // Tab data
  context.tab = context.tabs.buildings

  return context
}

export const prepareNotesContext = async function (context) {
  // Tab data
  context.tab = context.tabs.notes

  return context
}
