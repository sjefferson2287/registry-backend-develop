const constants = require('../constants.config')
const AWS = require('aws-sdk')

module.exports.sendVerificationEmail = async (emailTo, name, otp) => {
  try {
    const params = {
      Source: process.env.SENDER_NAME + ' <' + process.env.SENDER_EMAIL + '>',
      Destination: {
        ToAddresses: [emailTo],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: `Your pin is ${otp}. Please confirm your email address.`,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<table border='0' cellpadding='0' cellspacing='0' width='100%' style='border-collapse:collapse; padding:0; margin:0px;'>
              <tr valign='top'>
                <td align='center'>
                  <table> <h2 style='color: #50b5ff'> WELCOME TO REDGISTRY </h2> </table>
                  <table> <p> Hello ${name}, We're delighted to have you onboard !!.</p> </table>
                  <table> <p> Thank you for signing up, Enter this code to confirm your email.</p> </table>
                  <table style='color: #ffff'> <div style='background-color: #50b5ff; color: #ffff; border: 0; padding: 5px 20px; text-decoration: none; display: inline-block; font-size: 25px; font-weight: 900;  margin: 20px 00px 20px 00px;'> ${otp} </div> </table>
                </td>
              </tr>
            </table>`,
          },
        },
      },
    }

    const data = await new AWS.SES({ ...constants.AWS_SES_CONFIG }).sendEmail(params).promise()
    return {
      status: true,
      data: data,
      message: 'Mail Sent Successfully',
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    }
  }
}

module.exports.sendChangePasswordEmail = async (emailTo, name, otp) => {
  try {
    const params = {
      Source: process.env.SENDER_NAME + ' <' + process.env.SENDER_EMAIL + '>',
      Destination: {
        ToAddresses: [emailTo],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: `Your pin is ${otp}. Please confirm to change your password.`,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<table border='0' cellpadding='0' cellspacing='0' width='100%' style='border-collapse:collapse; padding:0; margin:0px;'>
              <tr valign='top'>
                <td align='center'>
                  <table> <h2 style='color: #50b5ff'> WELCOME TO REDGISTRY </h2> </table>
                  <table> <p> Hello ${name}, We're delighted to have you onboard !!.</p> </table>
                  <table> <p> Thank you for verifying your email, Enter this code to change your password.</p> </table>
                  <table style='color: #ffff'> <div style='background-color: #50b5ff; color: #ffff; border: 0; padding: 5px 20px; text-decoration: none; display: inline-block; font-size: 25px; font-weight: 900;  margin: 20px 00px 20px 00px;'> ${otp} </div> </table>
                </td>
              </tr>
            </table>`,
          },
        },
      },
    }

    const data = await new AWS.SES({ ...constants.AWS_SES_CONFIG }).sendEmail(params).promise()
    return {
      status: true,
      data: data,
      message: 'Mail Sent Successfully',
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    }
  }
}
