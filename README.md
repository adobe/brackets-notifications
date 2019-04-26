This repo contains app notification JSON files for [Brackets](http://brackets.io) ([repo](https://github.com/adobe/brackets)). As an end user, you'll see them in the app whenever a new notification is added.

The notifications can be targeted based on platforms, version, extensions etc.

Brackets checks for app notifications by downloading a copy of this JSON info from a [fixed S3 URL](https://s3.amazonaws.com/files.brackets.io/notifications/stable). Updating this repo does not automatically push the changes "live" to S3. This repo is used to discuss changes and prepare translations before the notification files go live.

## Initial Setup
There is a nodejs script that will take care of uploading the app notifications into the S3 bucket. The script will preserve all attributes on existing files in the S3 bucket.
In order to deploy the app notifications to S3, some required libs have to be installed upfront.

1. cd into `scripts`
2. run `npm install`
3. edit `config.json` from the `scripts` directory and replace the placeholder with your **AWS AccessKey** and **SecretKey** 

## Prepare the app notification

**NOTE**: Running this script will replace the current files in the S3 bucket. There is no backup of the existing files and the app notifications are immediately visible to everybody using Brackets.

1. Make sure the JSON parses cleanly (you can use http://jsonlint.com, but the errors might not be as good as calling `JSON.parse()`).
2. Check the files into this repo's master.
3. Open a terminal and cd into `scripts`.
4. run `node deployAppNotifications.js`