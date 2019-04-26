/*globals require, console */
'use strict';

var AWS   = require('aws-sdk'),
    fs    = require('fs'),
    path  = require('path');

// Constant
var BASE_PATH = '../notifications/stable';

function getConfig() {
    var config;

    try {
        config = JSON.parse(fs.readFileSync('./config.json'));

        var accessKeyId = config['aws.accesskey'],
            secretAccessKey = config['aws.secretkey'],
            bucketName = config['s3.bucket'];

        // simple check to determine if the placeholder have been replaced with proper keys
        if (accessKeyId && (accessKeyId.indexOf('<') !== -1 || accessKeyId.indexOf('>') !== -1)) {
            throw new Error('Configuration error: Please provide a valid aws.accesskey');
        }

        if (accessKeyId && (secretAccessKey.indexOf('<') !== -1 || secretAccessKey.indexOf('>') !== -1)) {
            throw new Error('Configuration error: Please provide a valid aws.secretkey');
        }

        if (!accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('Configuration error: aws.accesskey, aws.secretkey, or s3.bucket missing');
        }

        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw new Error(e);
        }
    }

    return config;
}

function upload() {
    var config = getConfig(),
        s3 = new AWS.S3({
            sslEnabled: true
        });

    fs.readdir(BASE_PATH, function (err, files) {
        if (!files) {
            console.error('No files to upload');
        } else {
            files.forEach(function (file) {
                var content = fs.readFileSync(path.join(BASE_PATH, file));

                s3.putObject({
                    Bucket: config['s3.bucket'],
                    Key: file,
                    ACL: 'public-read',
                    ContentType: 'application/json',
                    Body: content
                }, function (err, data) {
                    if (err) {
                        console.log('Error writing %s %s', file, err);
                    }

                    console.log('Uploaded %s to S3', file);
                });
            });
        }
    });
}

// Upload to S3
upload();
