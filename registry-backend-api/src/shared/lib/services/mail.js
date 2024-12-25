'use strict'
const AWS = require('aws-sdk')
const { join } = require('path')

AWS.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: process.env.AMAZON_REGION,
})

module.exports.sendMail = async (mailData) => {
  try {
    const params = {
      Source: process.env.MAIL_SENDER_NAME + ' <' + process.env.MAIL_SENDER_EMAIL + '>',
      Destinations: [
        {
          Destination: {
            ToAddresses: mailData.toAddresses,
            CcAddresses: mailData.ccAddresses ?? [],
            BccAddresses: mailData.bccAddresses ?? [],
          },
        },
      ],
      Template: mailData.templateName,
      DefaultTemplateData: mailData.templateData ? JSON.stringify(mailData.templateData) : JSON.stringify({}),
    }
    console.log(params)
    const mail = await new AWS.SES(this.SesConfig).sendBulkTemplatedEmail(params).promise()
    console.log(mail)
    return mail.Status
  } catch (e) {
    console.log(e)
    return e.statusCode
  }
}

// /**
//  * Create new template
//  */
module.exports.createTemplate = (event) => {
  const params = require(join(__dirname, '../templates', JSON.parse(event.body).template + '.json'))
  return new AWS.SES(this.SesConfig)
    .createTemplate(params)
    .promise()
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.log('Error Create' + err)
    })
}

// /**
//  * Get template
//  */
// async getTemplate(name: string) {
//   const params = {
//     TemplateName: name,
//   };
//   return new AWS.SES(this.SesConfig)
//     .getTemplate(params)
//     .promise()
//     .then((res: any) => res)
//     .catch((err) => {
//       console.log('Error Get' + err);
//     });
// }

// /**
//  * Get template
//  */
// async deleteTemplate(name: string) {
//   const params = {
//     TemplateName: name,
//   };

//   return new AWS.SES(this.SesConfig)
//     .deleteTemplate(params)
//     .promise()
//     .then((res) => res)
//     .catch((err) => {
//       console.log('Error Get' + err);
//     });
// }

// /**
//  * Update template
//  */
//   async updateTemplate(templateFile: string) {
//   const params = require(join(
//     __dirname,
//     '../../../../../',
//     'src/templates/' + templateFile + '.json',
//   ));
//   return new AWS.SES(this.SesConfig)
//     .updateTemplate(params)
//     .promise()
//     .then((res) => res)
//     .catch((err) => {
//       console.log('Error Update' + err);
//     });
// }
