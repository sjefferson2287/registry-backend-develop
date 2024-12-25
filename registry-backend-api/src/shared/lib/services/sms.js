const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const phone = process.env.TWILIO_PHONE
const client = require('twilio')(accountSid, authToken)

module.exports.sendSms = async (messageBody) => {
  const message = await client.messages.create({
    body: messageBody.message,
    from: phone,
    to: messageBody.phone,
  })
  console.log(message)
  return true
}

// // Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// const { default: ono } = require('@jsdevtools/ono');
// // Set region
// AWS.config.update({ region: 'us-east-2' });

// module.exports.sendSms = async (messageBody) => {
//     // Create publish parameters
//     var params = {
//         Message: messageBody.message, /* required */
//         PhoneNumber: messageBody.phone,
//     };

//     try {
//         // Create promise and SNS service object
//         await new AWS.SNS({ apiVersion: '2010-03-31' }).setSMSAttributes({
//             attributes: {
//                 DefaultSMSType: 'Transactional'
//             }
//         }).promise();
//         var publishTextPromise = await new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
//         return true;
//     } catch (e) {
//         console.log(e);
//         return false
//     }

// }
