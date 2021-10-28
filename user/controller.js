const UserModel = require("../models/userModel");
const ImageModel = require("../models/imageModel");


function createUser(userData, result) {

    // commit image file
    let userModel = new UserModel({
        ...userData
    });

    UserModel.createUser(userModel, function (err, response) {
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function createImage(imageData, result) {

    console.log("++++");
    console.log(imageData);
    // commit image file
    let imageModel = new ImageModel({
        ...imageData
    });
    console.log("imagemodel ok");
    //-----
    ImageModel.createImage(imageModel, function (err, response) {
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function getImageByUserId(email, result) {
    ImageModel.getImageByUserId(email, function (err, response) {
        console.log("--------");
        console.log(email);
        console.log(response);
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function deleteImageByUserId(email, result) {
    ImageModel.deleteImageByUserId(email, function (err, response) {
        console.log("--------");
        console.log(email);
        console.log(response);
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function getUser(email, result) {
    UserModel.getUser(email, function (err, response) {
        console.log("--------");
        console.log(email);
        console.log(response);
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function checkEmail(email, result) {
    UserModel.checkEmail(email, function (err, response) {
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}


function updateUser(email, user, result) {
    UserModel.updateUser(email, user, function (err, response) {
        if (err)
            result(err, response);
        else
            result(null, response);
    });
}

function s3_upload(bucketname, filename) {
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({ region: 'us-east-1' });
    // var credentials = new AWS.SharedIniFileCredentials({ profile: 'prod' });
    // AWS.config.credentials = credentials;

    // Create S3 service object
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = { Bucket: bucketname, Key: '', Body: '' };
    var file = filename;

    // Configure the file stream and obtain the upload parameters
    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });


}

function s3_delete(bucketname, filename) {
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({ region: 'us-east-1' });
    // var credentials = new AWS.SharedIniFileCredentials({ profile: 'prod' });
    // AWS.config.credentials = credentials;

    var s3 = new AWS.S3();

    var deleteParams = { Bucket: bucketname, Key: '' };
    var file = filename;

    // Configure the file stream and obtain the upload parameters


    var path = require('path');
    deleteParams.Key = path.basename(file);
    s3.deleteObject(deleteParams, function (err, data) {
        if (err) console.log(err, err.stack);  // error
        else console.log();                 // deleted
    });
}


module.exports = { s3_upload, s3_delete, deleteImageByUserId, getImageByUserId, createImage, createUser, getUser, checkEmail, updateUser };

