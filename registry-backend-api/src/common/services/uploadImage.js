const AWS = require('aws-sdk')
const multipart = require('aws-lambda-multipart-parser')

const bucket = 'heritage-vet-plus-server-buckets/images/assets'
const s3 = new AWS.S3({
  region: 'ap-south-1',
  Bucket: bucket,
  accessKeyId: 'AKIA6CVHAWEDOTYGNIW3',
  secretAccessKey: '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',
})

module.exports.uploadImage = async (event, context) => {
  const body = multipart.parse(event, context)
  const result = await s3.upload({ Bucket: bucket, Key: body.image.filename, Body: body.image.content }).promise()

  return result
}
