const ono = require('@jsdevtools/ono')
const models = require('../../../database/redgistryDatabase/models')
const mailService = require('../../shared/lib/services/mail')

const { Onboardings, ParentChild, Users, InviteParent, InviteChildren } = models

const getProfileData = async (userIds) => {
  const onboardings = await Onboardings.findAll({
    include: [
      {
        model: Users,
        attributes: ['email'],
        as: 'User',
      },
    ],
    where: { user_id: userIds },
  })

  if (onboardings.length === 0) {
    return []
  }

  const result = onboardings.map((onboarding) => {
    const common = {
      first_name: onboarding.first_name,
      last_name: onboarding.last_name,
      state: onboarding.state,
      city: onboarding.city,
      zip_code: onboarding.zip_code,
      phone_number: onboarding.phone_number,
      email: onboarding.User.email,
      gender: onboarding.gender,
    }

    let res = {
      profile_img: onboarding.profile_picture,
      cover_img: onboarding.cover_picture,
      personal_information: common,
    }
    if (onboarding.user_type === 2) return res

    let data = {}
    try {
      const { current_accadamic_status, extra_curricular, accadamic_intrests } = onboarding
      data = JSON.parse(current_accadamic_status) || {}
      const cas = {
        school_name: onboarding.school_name || '',
        graduation_year: `${onboarding.graduation_year}` || '',
        year_planning_to_attend_college: data.year_planning_to_attend_college || '',
        gpa: data.gpa || '',
        class_rank: data.class_rank || '',
        sat_act_score: data.sat_act_score || '',
        award_issuing_entity: data.award_description || '',
        award_description: data.award_description || '',
        award_received_date: data.award_received_date || '',
        special_cource_entity_name: data.special_cource_entity_name || '',
        special_cource_entity_location: data.special_cource_entity_location || '',
        special_cource_description: data.special_cource_description || '',
        special_cource_completed_date: data.special_cource_completed_date || '',
      }
      onboarding.setDataValue('current_accadamic_status', cas)

      data = JSON.parse(extra_curricular) || {}
      const ec = {
        work_company: data.work_company || '',
        work_date: data.work_date || '',
        work_position: data.work_position || '',
        work_responsibility: data.work_responsibility || '',
        part_time_work_company: data.part_time_work_company || '',
        part_time_work_date: data.part_time_work_date || '',
        part_time_work_position: data.part_time_work_position || '',
        part_time_work_responsibility: data.part_time_work_responsibility || '',
        sport_participation_name: data.sport_participation_name || '',
        sport_participation_description: data.sport_participation_description || '',
        sport_participation_recognition: data.sport_participation_recognition || '',
        accadamic_club_entity: data.accadamic_club_entity || '',
        accadamic_club_recognition: data.accadamic_club_recognition || '',
        accadamic_club_description: data.accadamic_club_description || '',
        artistic_field: data.artistic_field || '',
        artistic_field_recognition: data.artistic_field_recognition || '',
        artistic_field_description: data.artistic_field_description || '',
        voluntieer_service_field: data.voluntieer_service_field || '',
        voluntieer_service_recognition: data.voluntieer_service_recognition || '',
        voluntieer_service_description: data.voluntieer_service_description || '',
        internship_company: data.internship_company || '',
        internship_dates: data.internship_dates || '',
        internship_position: data.internship_position || '',
        internship_responsibilities: data.internship_responsibilities || '',
        intrests_hobbies: data.intrests_hobbies || '',
      }
      onboarding.setDataValue('extra_curricular', ec)

      data = JSON.parse(accadamic_intrests) || {}
      const ai = {
        expected_clg_start: data.expected_clg_start || [],
        colleges_considering: data.colleges_considering || [],
        majors: data.majors || [],
      }
      onboarding.setDataValue('accadamic_intrests', ai)
    } catch (e) {
      throw ono({
        status: 500,
        message: `Something went wrong while parsing profile data. - ${onboarding.id}`,
      })
    }

    res.personal_information = {
      ...common,
      about: onboarding.about,
      address: onboarding.address,
      dob: onboarding.dob,
      languages_known: onboarding.languages_known,
      personal_website: onboarding.personal_website,
      joined: onboarding.joined,
      ethnicity: onboarding.ethnicity,
    }

    res = {
      ...res,
      current_accadamic_status: onboarding.current_accadamic_status,
      extra_curricular: onboarding.extra_curricular,
      accadamic_intrests: onboarding.accadamic_intrests,
    }
    return res
  })
  return result
}

module.exports.updateStudentProfile = async (body, step, userId) => {
  let onboarding = await Onboardings.findOne({ where: { user_id: userId } })

  if (!onboarding) {
    throw ono({
      status: 400,
      message: 'User is not onboarded.',
    })
  }
  if (onboarding.user_type !== 1) {
    throw ono({
      status: 400,
      message: 'User is not Student.',
    })
  }

  const {
    personal_information,
    current_accadamic_status,
    extra_curricular,
    accadamic_intrests,
    profile_img,
    cover_img,
  } = body

  let data = {}

  if (step === 'personal_information') {
    data = {
      ...personal_information,
      languages_known: JSON.stringify(personal_information.languages_known),
    }
  } else if (step === 'current_accadamic_status') {
    const { school_name, graduation_year } = current_accadamic_status
    const currAccStatus = JSON.stringify({ ...current_accadamic_status })

    data = { current_accadamic_status: currAccStatus, school_name, graduation_year }
  } else if (step === 'extra_curricular') {
    data = { extra_curricular: JSON.stringify(extra_curricular) }
  } else if (step === 'accadamic_intrests') {
    data = { accadamic_intrests: JSON.stringify(accadamic_intrests) }
  }

  data.profile_picture = profile_img
  data.cover_picture = cover_img

  await Onboardings.update(data, { where: { user_id: userId } })

  return {}
}

module.exports.updateParentProfile = async (body, step, userId) => {
  let onboarding = await Onboardings.findOne({ where: { user_id: userId } })

  if (!onboarding) {
    throw ono({
      status: 400,
      message: 'User is not onboarded.',
    })
  }
  if (onboarding.user_type !== 2) {
    throw ono({
      status: 400,
      message: 'User is not Parent.',
    })
  }

  const { personal_information, profile_img, cover_img } = body

  let data = {}
  if (step === 'personal_information') {
    data = { ...personal_information }
  }

  if (profile_img) data.profile_picture = profile_img
  if (cover_img) data.cover_picture = cover_img
  await Onboardings.update({ ...data }, { where: { user_id: userId } })
  return {}
}

module.exports.getProfileData = async (user) => {
  const result = await getProfileData([user.id])

  if (result === null)
    throw ono({
      status: 400,
      message: 'User is not onboarded.',
    })

  return result[0]
}

module.exports.getChildrenOfParentProfile = async (user) => {
  let parentChilds = await ParentChild.findAll({ where: { parent_id: user.id } })

  const childrenUserIds = parentChilds.map((pc) => pc.child_id)

  const result = await getProfileData(childrenUserIds)
  return result
}

module.exports.getParentsOfChildProfile = async (user) => {
  let parentChilds = await ParentChild.findAll({ where: { child_id: user.id } })

  const parentUserIds = parentChilds.map((pc) => pc.parent_id)

  const result = await getProfileData(parentUserIds)
  return result
}

module.exports.inviteChild = async (user, body) => {
  let childsOfParent = await ParentChild.findAll({ where: { child_id: user.id } })

  if (childsOfParent.length >= 3) {
    throw ono({
      status: 400,
      message: 'No of children limit exceded.',
    })
  }

  await InviteChildren.create({
    invitee_id: user.id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
  })

  await mailService.sendMail({
    toAddresses: [body.email],
    templateName: 'InviteUser',
    templateData: {
      child_first_name: body.first_name,
      parent_first_name: user.first_name,
      url: body.onboard_via === 'web' ? process.env.FRONTEND_URL : process.env.MOBILE_URL,
    },
  })

  return body.first_name + ' is invited.'
}

module.exports.inviteParent = async (user, body) => {
  let parentsOfChild = await ParentChild.findAll({ where: { child_id: user.id } })

  if (parentsOfChild.length >= 2) {
    throw ono({
      status: 400,
      message: 'No of parents limit exceded.',
    })
  }

  await InviteParent.create({
    invitee_id: user.id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
  })

  await mailService.sendMail({
    toAddresses: [body.email],
    templateName: 'InviteUser',
    templateData: {
      child_first_name: user.first_name,
      parent_first_name: body.first_name,
      url: body.onboard_via === 'web' ? process.env.FRONTEND_URL : process.env.MOBILE_URL,
    },
  })

  return body.first_name + ' is invited.'
}

module.exports.myInvitations = async (user) => {
  const onboarding = await Onboardings.findOne({ where: { user_id: user.id } })

  let model = onboarding.user_type === 2 ? InviteChild : InviteParent

  const invitations = model.findAll({
    where: {
      invitee_id: user.id,
    },
    attributes: ['first_name', 'last_name', 'email'],
  })
  return invitations
}

module.exports.deleteInvitation = async (user, body) => {
  const onboarding = await Onboardings.findOne({ where: { user_id: user.id } })

  let model = onboarding.user_type === 2 ? InviteChildren : InviteParent
  const record = await model.findOne({
    where: { invitee_id: user.id, email: body.email },
  })

  if (record) {
    await record.destroy()
  } else {
    throw ono({
      status: 400,
      message: 'No such invitations with given email.',
    })
  }
  return
}
