

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'prod'});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();

var getParams = {Bucket: process.argv[2], Key: ''};
var file = process.argv[3];

var getParams = {
    Bucket: 'abc', // your bucket name,
    Key: 'abc.txt' // path to the object you're looking for
}

var path = require('path');
getParams.Key = path.basename(file);

s3.getObject(getParams, function(err, data) {
    // Handle any error and exit
    if (err)
        return err;

  // No error happened
  // Convert Body from a Buffer to a String
  let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
});