const ono = require('@jsdevtools/ono')
const models = require('../../../database/redgistryDatabase/models')
const { updateMastodonUserDetails } = require('../../common/services/mastodon.service')
const { tokenGenerator } = require('../../shared/lib/helper/twilio-chat')
const mailService = require('../../shared/lib/services/mail')

const { Onboardings, UsersTypes, Users, InviteChildren, InviteParent, ParentChild, cities, States } = models

module.exports.viewUserByAuth0Id = async (auth0_user_id) => {
  const data = await Users.findOne({ where: { auth0_user_id } })

  if (!data) {
    throw ono({
      status: 404,
      message: 'User not found.',
    })
  }

  return data
}

module.exports.viewOnboardingById = async (onboard_id) => {
  const data = await Onboardings.findOne({
    where: { id: onboard_id },
    include: [{ model: UsersTypes, as: 'UsersType' }],
  })

  return data
}

module.exports.viewOnboardingByUserId = async (id) => {
  const user = await Users.findOne({
    where: { id },
    attributes: ['email', 'id'],
    include: [
      {
        model: Onboardings,
        as: 'onboarding',
        attributes: ['first_name', 'last_name', 'over_13'],
        include: [
          {
            model: UsersTypes,
            as: 'UsersType',
            attributes: ['id', 'user_type'],
          },
          {
            model: States,
            as: 'state_detail',
            attributes: ['name', 'code'],
          },
          {
            model: cities,
            as: 'city_detail',
            attributes: ['name'],
          },
        ],
      },
      {
        model: ParentChild,
        as: 'parents',
        attributes: ['id'],
        include: [
          {
            model: Users,
            as: 'child',
            attributes: ['email'],
            include: [
              {
                model: Onboardings,
                as: 'onboarding',
                attributes: ['first_name', 'last_name', 'over_13'],
                include: [
                  {
                    model: States,
                    as: 'state_detail',
                    attributes: ['name', 'code'],
                  },
                  {
                    model: cities,
                    as: 'city_detail',
                    attributes: ['name'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: ParentChild,
        as: 'children',
        attributes: ['id'],
        include: [
          {
            model: Users,
            as: 'parent',
            attributes: ['email'],
            include: [
              {
                model: Onboardings,
                as: 'onboarding',
                attributes: ['first_name', 'last_name', 'over_13'],
                include: [
                  {
                    model: States,
                    as: 'state_detail',
                    attributes: ['name', 'code'],
                  },
                  {
                    model: cities,
                    as: 'city_detail',
                    attributes: ['name'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })

  if (!user) {
    throw ono({
      status: 400,
      message: 'User not onboarded.',
    })
  }

  return user
}

module.exports.viewUsersTypes = async () => {
  const data = await UsersTypes.findAll({ order: [['id', 'ASC']] })

  return data
}

module.exports.createStudentOnboarding = async (body) => {
  const user = await this.viewUserByAuth0Id(body.auth0_user_id)
  let onboardUser = await Onboardings.findOne({
    where: { user_id: user.id },
  })

  if (onboardUser) {
    throw ono({
      status: 400,
      message: 'Student already onboarded.',
    })
  }

  onboardUser = await updateMastodonUserDetails({
    display_name: body.first_name ?? '' + ' ' + body.last_name ?? '',
    email: user.email,
  })

  const onboarding = await Onboardings.create({
    user_id: user.id,
    user_type: body.user_type,
    first_name: body.first_name,
    last_name: body.last_name,
    state: body.state,
    city: body.city,
    zip_code: body.zip_code,
    school_name: body.school,
    graduation_year: body.graduation_year,
  })

  if (user.email) {
    const userInvited = await InviteChildren.findOne({
      where: {
        email: user.email,
      },
    })
    if (userInvited) {
      ParentChild.create({
        parent_id: userInvited.invitee_id,
        child_id: user.id,
      })

      InviteChildren.destroy({
        where: {
          id: userInvited.id,
        },
      })
    }
  }

  // regestering the user in twilio chat
  tokenGenerator(user.id)
  return this.viewOnboardingById(onboarding.id)
}

module.exports.createParentOnboarding = async (body) => {
  const user = await this.viewUserByAuth0Id(body.auth0_user_id)

  let onboardUser = await Onboardings.findOne({
    where: { user_id: user.id },
  })

  if (onboardUser) {
    throw ono({
      status: 400,
      message: 'User already onboarded.',
    })
  }

  updateMastodonUserDetails({
    display_name: body.first_name ?? '' + ' ' + body.last_name ?? '',
    email: user.email,
  })

  const onboarding = await Onboardings.create({
    user_id: user.id,
    user_type: body.user_type,
    first_name: body.first_name,
    last_name: body.last_name,
    state: body.state,
    city: body.city,
    zip_code: body.zip_code,
  })

  if (user.email) {
    const userInvited = await InviteParent.findOne({
      where: {
        email: user.email,
      },
    })
    if (userInvited) {
      ParentChild.create({
        parent_id: user.id,
        child_id: userInvited.invitee_id,
      })

      InviteParent.destroy({
        where: {
          id: userInvited.id,
        },
      })
    }
  }

  if (body.child) {
    await InviteChildren.create({
      invitee_id: user.id,
      first_name: body.child.first_name,
      last_name: body.child.last_name,
      email: body.child.email,
      school: body.child.school,
      graduation_year: body.child.graduation_year,
    })

    await mailService.sendMail({
      toAddresses: [body.child.email],
      templateName: 'InviteUser',
      templateData: {
        child_first_name: body.child.first_name,
        parent_first_name: body.first_name,
        url: body.onboard_via === 'web' ? process.env.FRONTEND_URL : process.env.MOBILE_URL,
      },
    })
  }

  // regestering the user in twilio chat
  tokenGenerator(user.id)
  return this.viewOnboardingById(onboarding.id)
}

module.exports.getInvitedUserDetail = async (email) => {
  const user = await InviteChildren.findOne({
    where: {
      email,
    },
  })
  if (!user) {
    throw ono({
      status: 400,
      message: 'Invalid user details',
    })
  }

  return user
}
