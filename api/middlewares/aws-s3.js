const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: process.env.region
})

module.exports = AWS.S3()