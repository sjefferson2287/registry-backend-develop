// const AWS = require('aws-sdk')

// AWS.config.update({ region: process.env.AMAZON_REGION })
// const s3 = new AWS.S3();

// const uploadBucket = process.env.S3_ROOT_UPLOAD_BUCKET

// module.exports.getpresignedurl = async (event, context, callback) => {
//     const body = event.body ? event.body : event;
//     console.log(body);
//     const data = JSON.parse(body);
//     console.log('getUploadURL started');
//     let actionId = data.foldername + "/" + Date.now() + "_" + data.filename;
//     const result = await getPresignedURL(actionId);
//     console.log('Result: ', result);
//     return result
// };

// const getPresignedURL = async function (actionId) {
//     var s3Params = {
//         Bucket: uploadBucket,
//         Key: actionId,
//         Expires: 900,
//         ContentType: 'application/octet-stream'
//     };
//     return new Promise((resolve, reject) => {
//         // Get signed URL
//         let s3URI = "s3://" + uploadBucket + "/" + actionId;

//         let uploadURL = s3.getSignedUrl('putObject', s3Params)
//         resolve({
//             "statusCode": 200,
//             "isBase64Encoded": false,
//             "headers": {
//                 "Access-Control-Allow-Origin": "*"
//             },
//             "body": JSON.stringify({
//                 "uploadURL": uploadURL,
//                 "s3URI": s3URI,
//                 "Filename": `${actionId}`
//             })
//         })
//     })

// }
