module.exports.querySearch = (value, columns) => {
  let whereCondition = ' WHERE 1=1 '

  if (value && value.search) {
    whereCondition += 'AND ('
    for (const i in columns) {
      whereCondition += ' OR ' + columns[i] + " ilike '%" + value.search.toLowerCase() + "%' "
    }
    whereCondition += ')'
  }
  return whereCondition.replace(' OR', '')
}
