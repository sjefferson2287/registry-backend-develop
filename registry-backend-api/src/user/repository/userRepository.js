const models = require('../../../database/redgistryDatabase/models')
const { updateMastodonUserDetails } = require('../../common/services/mastodon.service')

const { Users, profiles, siblings_details, academic_details } = models

module.exports.getUserByAuth0_user_id = async (auth0_user_id) => {
  return await Users.findOne({ where: { auth0_user_id } })
}

module.exports.getProfileByUser_id = async (user_id) => {
  return await profiles.findOne({ where: { user_id } })
}

module.exports.getAccademicByIdUser_id = async (id, user_id) => {
  return await academic_details.findOne({ where: { id, user_id } })
}

module.exports.getUserProfileAccademicByUser_id = async (user_id) => {
  return await Users.findOne({
    where: { id: user_id },
    include: [
      {
        model: profiles,
        as: 'profiles',
        include: [
          {
            model: siblings_details,
            as: 'siblings_details',
          },
        ],
      },
    ],
  })
}

module.exports.updateUserProfile = async (auth0_user_id, body) => {
  const user = await this.getUserByAuth0_user_id(auth0_user_id)
  const profile = await this.getProfileByUser_id(user.id)

  if (!profile) {
    const data = await profiles.create({
      created_at: new Date(),
      updated_at: new Date(),
      user_id: user.id,
      first_name: body.first_name,
      last_name: body.last_name,
      cover_picture: body.cover_picture,
      profile_picture: body.profile_picture,
      dob: body.dob,
      gender: body.gender,
      state: body.state,
      city: body.city,
      zip_code: body.zip_code,
      languages: body.languages,
      about_me: body.about_me,
      ethnicity: body.ethnicity,
    })

    if (body.siblings_details && body.siblings_details.length !== 0) {
      await Promise.all(
        body.siblings_details.map(async (element) => {
          await siblings_details.create({
            created_at: new Date(),
            updated_at: new Date(),
            profile_id: data.id,
            name: element.name,
            relationship: element.relationship,
            email: element.email,
          })
        }),
      )
    }

    const mastodonData = await updateMastodonUserDetails({
      email: user.email,
      display_name: `${body.first_name || profile.first_name} ${body.last_name || profile.last_name}`,
      note: body.about_me,
      avatar: body.profile_picture,
      header: body.cover_picture,
    })

    const response = await this.getUserProfileAccademicByUser_id(user.id)
    response.dataValues.profiles.dataValues.about_me = mastodonData.note
    response.dataValues.profiles.dataValues.cover_picture = mastodonData.avatar
    response.dataValues.profiles.dataValues.profile_picture = mastodonData.header
    response.dataValues.profiles.dataValues.display_name = mastodonData.display_name

    return response
  }

  await profiles.update(
    {
      first_name: body.first_name,
      last_name: body.last_name,
      cover_picture: body.cover_picture,
      profile_picture: body.profile_picture,
      dob: body.dob,
      gender: body.gender,
      state: body.state,
      city: body.city,
      zip_code: body.zip_code,
      languages: body.languages,
      about_me: body.about_me,
      ethnicity: body.ethnicity,
    },
    { where: { user_id: user.id } },
  )

  if (body.siblings_details && body.siblings_details.length !== 0) {
    await Promise.all(
      body.siblings_details.map(async (element) => {
        if (!element.siblings_details_id) {
          await siblings_details.create({
            created_at: new Date(),
            updated_at: new Date(),
            profile_id: profile.id,
            name: element.name,
            relationship: element.relationship,
            email: element.email,
          })
        }

        if (element.siblings_details_id) {
          await siblings_details.update(
            {
              name: element.name,
              relationship: element.relationship,
              email: element.email,
            },
            { where: { id: element.siblings_details_id } },
          )
        }
      }),
    )
  }

  const mastodonData = await updateMastodonUserDetails({
    email: user.email,
    display_name: `${body.first_name || profile.first_name} ${body.last_name || profile.last_name}`,
    note: body.about_me,
    avatar: body.profile_picture,
    header: body.cover_picture,
  })

  const response = await this.getUserProfileAccademicByUser_id(user.id)
  response.dataValues.profiles.dataValues.about_me = mastodonData.note
  response.dataValues.profiles.dataValues.cover_picture = mastodonData.avatar
  response.dataValues.profiles.dataValues.profile_picture = mastodonData.header
  response.dataValues.profiles.dataValues.display_name = mastodonData.display_name

  return response
}

module.exports.updateAccademic = async (auth0_user_id, accademic_id, body) => {
  const user = await this.getUserByAuth0_user_id(auth0_user_id)
  const accademic = await this.getAccademicByIdUser_id(accademic_id, user.id)

  if (!accademic) {
    body.user_id = user.id
    body.created_at = new Date()
    body.updated_at = new Date()
    return await academic_details.create(body)
  }

  await academic_details.update(body, { where: { id: accademic_id, user_id: user.id } })
  return await this.getAccademicByIdUser_id(accademic_id, user.id)
}
