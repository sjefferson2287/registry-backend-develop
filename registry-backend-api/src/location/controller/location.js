const locationRepository = require('../repository/location')
const response = require('../../shared/lib/response')

class locationController {
  static async viewCountries(event, context, callback) {
    try {
      const data = await locationRepository.viewCountries()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async viewStatesByCountryId(event, context, callback) {
    try {
      const data = await locationRepository.viewStatesByCountryId(event.pathParameters.country_id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async viewCitiesByStateId(event, context, callback) {
    try {
      const data = await locationRepository.viewCitiesByStateId(event.pathParameters.state_id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getLanguages(event, context, callback) {
    try {
      const data = await locationRepository.getLanguages()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getEthinicity(event, context, callback) {
    try {
      const data = await locationRepository.getEthinicity()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getGender(event, context, callback) {
    try {
      const data = await locationRepository.getGender()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getCollegeStartTerm(event, context, callback) {
    try {
      const data = await locationRepository.getCollegeStartTerm()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getColleges(event, context, callback) {
    try {
      const data = await locationRepository.getColleges()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getMajors(event, context, callback) {
    try {
      const data = await locationRepository.getMajors()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getGraduationYear(event, context, callback) {
    try {
      const data = await locationRepository.getGraduationYear()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getYearPlanningToAttend(event, context, callback) {
    try {
      const data = await locationRepository.getYearPlanningToAttend()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getGPA(event, context, callback) {
    try {
      const data = await locationRepository.getGPA()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = locationController
