const bcrypt = require('bcryptjs')

const saltRounds = 10

const salt = bcrypt.genSaltSync(saltRounds)

const hashPassword = (password) => bcrypt.hashSync(password, salt)

const comparePassword = (hashedPassword, password) => bcrypt.compareSync(password, hashedPassword)

const generatePolicy = (principalId, context, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  authResponse.context = context
  return authResponse
}

module.exports = {
  hashPassword,
  comparePassword,
  generatePolicy,
}
