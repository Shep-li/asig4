

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'prod'});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();

var deleteParams = {Bucket: process.argv[2], Key: ''};
var file = process.argv[3];

// Configure the file stream and obtain the upload parameters
var fs = require('fs');


var path = require('path');
deleteParams.Key = path.basename(file);
s3.deleteObject(deleteParams, function(err, data) {
  if (err) console.log(err, err.stack);  // error
  else     console.log();                 // deleted
});