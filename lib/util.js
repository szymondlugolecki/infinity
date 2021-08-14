const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const extractHashtags = (message) => [
  ...new Set(message.split(' ').filter((word) => word.startsWith('#') && word.lastIndexOf('#') == 0)),
]

export const dateParser = (timestamp, day = true) => {
  const date = new Date(timestamp)
  const parsedDate = [monthNames[date.getMonth()], date.getFullYear()]
  if (day) parsedDate.splice(0, 0, date.getDate())
  return parsedDate.join(' ')
}
