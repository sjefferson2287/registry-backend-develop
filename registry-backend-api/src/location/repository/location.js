const models = require('../../../database/redgistryDatabase/models')

const { Countries, States, cities } = models

module.exports.viewLocations = async () => {
  const data = await cities.findAll({
    order: [['name', 'ASC']],
    include: [
      {
        model: States,
        as: 'State',
        include: [
          {
            model: cities,
            as: 'citie',
          },
        ],
      },
    ],
  })

  return data
}

module.exports.viewCountries = async () => {
  const data = await Countries.findAll({ where: { is_active: true }, order: [['name', 'ASC']] })

  return data
}

module.exports.viewStatesByCountryId = async (country_id) => {
  const data = await States.findAll({ where: { country_id }, order: [['name', 'ASC']] })

  return data
}

module.exports.viewCitiesByStateId = async (state_id) => {
  const data = await cities.findAll({ where: { state_id }, order: [['name', 'ASC']] })

  return Object.values(
    data.reduce((acc, curr) => {
      acc[curr.name] = curr
      return acc
    }, {}),
  )
}

module.exports.getLanguages = async () => {
  const data = ['Spanish', 'French', 'Chinese', 'Japanese', 'German', 'Arabic', 'Italian', 'Korean', 'Russian', 'Dutch']

  return data
}

module.exports.getEthinicity = async () => {
  const data = [
    'African American',
    'American Indian or Native Alaskan',
    'Asian or Pacific Islander',
    'Hispanic-Latino',
    'White',
    'Other',
  ]
  return data
}

module.exports.getGender = async () => {
  const data = ['Male', 'Female', 'Other', 'Prefer not to say']
  return data
}

module.exports.getCollegeStartTerm = async () => {
  const data = ['Fall', 'Spring', 'Summer']
  return data
}

module.exports.getColleges = async () => {
  const data = [
    { id: 'Athens_state_university', name: 'Athens State University' },
    { id: 'Costal_Alabama_Community_College', name: 'Costal Alabama Community College' },
    { id: 'Jacksonville_State_University', name: 'Jacksonville State University' },
    { id: 'Lawson_State_Community_College', name: 'Lawson State Community College' },
    { id: 'Troy_University', name: 'Troy University' },
  ]
  return data
}

module.exports.getMajors = async () => {
  const data = ['Medical', 'Astrology', 'Chemical', 'Software']
  return data
}

module.exports.getGraduationYear = async () => {
  const data = ['2023', '2024', '2025', '2026', '2027']
  return data
}

module.exports.getYearPlanningToAttend = async () => {
  const data = ['2023', '2024', '2025', '2026', '2027']
  return data
}

module.exports.getGPA = async () => {
  const data = ['<2', '2-5', '>5']
  return data
}
