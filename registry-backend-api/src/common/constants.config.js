module.exports = {
  RECORD_CREATED: {
    CODE: 201,
    MESSAGE: 'Record created successfully',
  },
  RECORD_UPDATED: {
    CODE: 200,
    MESSAGE: 'Record updated successfully',
  },
  RECORD_DELETED: {
    CODE: 200,
    MESSAGE: 'Record deleted successfully',
  },
  RECORD_NOT_FOUND: {
    CODE: 404,
    MESSAGE: 'Record not found',
  },
  VALIDATION: {
    CODE: 400,
    MESSAGE: 'Validation error',
  },
  SUCCESS: {
    CODE: 200,
    MESSAGE: 'Success',
  },
  PATH_NOT_FOUND: {
    CODE: 404,
    MESSAGE: 'Invalid URL',
  },
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: 'Unauthorized',
  },
  INTERNAL_SERVER_ERROR: {
    CODE: 500,
    MESSAGE: 'Something went wrong.',
  },
  FORBIDDEN: {
    CODE: 403,
    MESSAGE: 'Forbidden',
  },
  AWS_SES_CONFIG: {
    region: process.env.AWS_REGION_NAME,
    apiVersion: process.env.AWS_API_VERSION,
    accessKeyId: process.env.AWS_ACCESS_KEY_NAME,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
}
