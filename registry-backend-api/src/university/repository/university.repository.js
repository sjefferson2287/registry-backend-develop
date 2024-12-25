const BaseService = require('../../common/services/base.service')
const redgistryModels = require('../../../database/redgistryDatabase/models')
const { sequelize } = require('../../../database/redgistryDatabase/models')
const { getArrayFromCommaSeperated } = require('../../common/utils')
const { default: ono } = require('@jsdevtools/ono')

const { University, Major, CampusService, UniversityFollower } = redgistryModels

class UniversityRepository extends BaseService {
  constructor(model) {
    super(model)
    this.model = model
  }

  getUniversity = async (universityId, currUserId) => {
    if (!universityId)
      throw ono({
        status: 400,
        message: 'Invalid university id.',
      })

    const data = await University.findOne({
      include: [
        {
          model: Major,
          as: 'majors',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
        {
          model: CampusService,
          as: 'campus_services',
          attributes: ['id', 'name'],
          through: {
            attributes: ['value'],
          },
        },
      ],
    })

    const { count } = await UniversityFollower.findAndCountAll({
      where: { universityId },
    })

    const { count: currUserFollwer } = await UniversityFollower.findAndCountAll({
      universityId,
      followerId: currUserId,
    })

    let result = {
      id: data.id,
      is_follower: currUserFollwer > 0,
      header: {
        name: data.name,
        profile_img: data.profileImg,
        cover_img: data.bannerImg,
        description: data.description,
        location: `${data.city}, ${data.state}`,
        followers_count: count,
        category: data.category,
      },
      about: {
        website_link: data.website_link,
        description: data.description,
        address: data.address,
        email: data.email,
        phone_number: data.phoneNumber,
        contact_person: data.contactPerson,
        contact_person_designation: data.contactPersonDesignation,
        contact_person_email: data.contactPersonEmail,
      },
      acadamic_details: {
        level_of_institution: getArrayFromCommaSeperated(data.levelOfInstitution),
        institution_type: data.institutionType,
        majors: data.majors,
        campus_setting: data.campusSetting,
        student_body_size: data.studentBodySize,
        sports_setup: getArrayFromCommaSeperated(data.sportsSetup),
        other_activities: getArrayFromCommaSeperated(data.otherActivities),
        campus_service: data.campus_services.map((el) => ({
          id: el.dataValues.id,
          name: el.dataValues.name,
          value: el.UniversityCampusService.value,
        })),
        disability_support_services: getArrayFromCommaSeperated(data.disabilitySupportServices),
        financial_aid: data.financialAid,
        professors: data.professors,
      },
      admission_process: {
        how_to_apply: data.howToApply,
        sat_range: data.satRange,
        act_range: data.actRange,
        college_fees: data.collegeFees,
        high_school_gpa: data.highSchoolGpa,
      },
      events: [
        {
          name: 'Music & Arts Festival',
          photo: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
          description:
            'Since its founding in 1831, NYU has been an innovator in higher education, reaching out to an emerging middle class, embracing an urban identity and professional focus, and promoting a global vision that informs its 20 schools and colleges.',
          location: 'Evanston, ILg',
          time: '7:30pm to 9:30pm',
          date: '2023-03-16T16:08:04.732Z',
        },
      ],
    }

    return result
  }

  followUniversity = async (universityId, currUserId) => {
    await this.#checkUniversityExist(universityId)
    const { count } = await UniversityFollower.findAndCountAll({
      where: { followerId: currUserId, universityId },
    })
    if (count > 0)
      throw ono({
        status: 400,
        message: 'User is already follower of the group.',
      })
    await UniversityFollower.create({ universityId, followerId: currUserId })
    return 'Successfully Followed University'
  }

  searchUniversityByQuery = async (queryParams, user) => {
    if (!queryParams?.q)
      throw ono({
        status: 400,
        message: 'Queryparam q is required.',
      })

    const searchString = queryParams.q.toLowerCase()
    const { rows } = await University.findAndCountAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + searchString + '%'),
      },
      include: [UniversityFollower],
      attributes: ['id', 'name', 'state', 'city', 'profileImg'],
    })

    const universities = rows.map((r) => {
      const followers = r.UniversityFollowers
      const isMember = followers.filter((u) => u.followerId === user.id).length > 0
      r.dataValues.is_follower = isMember
      r.dataValues.followers_count = followers.length
      r.dataValues.UniversityFollowers = undefined
      return r
    })
    return universities
  }

  #checkUniversityExist = async (universityId) => {
    const university = await University.findOne({
      where: { id: universityId },
    })
    if (!university)
      throw ono({
        status: 400,
        message: 'University with id does not exist.',
      })
    return university
  }
}

module.exports = new UniversityRepository(University)
