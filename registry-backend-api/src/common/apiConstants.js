const MASTODON_API = {
  TIMELINE: '/api/v1/timelines/public',
  NOTIFICATIONS: '/api/v1/notifications',
  O_AUTH_TOKEN: '/oauth/token',
  DELETE_STATUS: (id) => `/api/v1/statuses/${id}`,
  CREATE_STATUS: '/api/v1/statuses',
  STATUSES_CONTEXT: (id) => `/api/v1/statuses/${id}/context`,
  REBLOG: (id) => `/api/v1/statuses/${id}/reblog`,
  UN_REBLOG: (id) => `/api/v1/statuses/${id}/unreblog`,
  SEARCH: '/api/v2/search',
  ACCOUNTS_SEARCH: '/api/v1/accounts/search',
  POSTS: '/api/v1/posts',
  MEDIA: '/api/v2/media',

  ACCOUNTS: (id) => `/api/v1/accounts/${id}`,
  UPDATE_CREDENTIALS: '/api/v1/accounts/update_credentials',
  VERIFY_CREDENTIALS: '/api/v1/accounts/verify_credentials',
}

module.exports = {
  MASTODON_API,
}
