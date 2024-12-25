const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64')
}
const decodeBase64 = (data) => {
  return Buffer.from(data, 'base64').toString('utf8')
}

const snakeToCamel = (str) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))

const camelToSnake = (obj) => {
  const snakeObj = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    snakeObj[snakeKey] = obj[key]
  }
  return snakeObj
}

const getIsUniqueEmailMsg = (error, customMsg) => {
  const allErrs = error?.errors

  if (Array.isArray(allErrs) && allErrs[0]) {
    const e = allErrs[0]
    return e.path === 'email' && e.type === 'unique violation' ? customMsg : e.message
  }
  return ''
}

const getArrayFromCommaSeperated = (val) => {
  if (typeof val !== 'string') return []

  return val.split(',').map((el, id) => ({ id: id + 1, name: el }))
}

module.exports = {
  encodeBase64,
  decodeBase64,
  snakeToCamel,
  camelToSnake,
  getIsUniqueEmailMsg,
  getArrayFromCommaSeperated,
}
