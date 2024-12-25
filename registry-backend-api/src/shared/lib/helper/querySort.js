// Adding order by in select queries
module.exports.sortBy = (sortConditions) => {
  let sort = ' ORDER BY '
  for (const index in sortConditions) {
    const sortBy = sortConditions[index]['sortBy']
    const sortOrder = sortConditions[index]['sortOrder']

    if (!sortBy.includes('created_at') && !sortBy.includes('status') && !sortBy.includes('createdAt')) {
      sort += `LOWER(${sortBy})` + ' ' + sortOrder + ', '
    } else {
      sort += `${sortBy}` + ' ' + sortOrder + ', '
    }
  }

  return sort.replace(/,\s*$/, '')
}
