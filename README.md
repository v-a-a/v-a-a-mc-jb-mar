# Marketing Cloud Journey Builder - Custom Activity Filter Contact Example

This repository contains a custom activity example for Marketing Cloud Journey Builder.

## Journey Builder

Journey Builder is a marketing planning tool that integrates the various channels and services in the Salesforce
ecosystem. The application empowers marketers to manage the customer life cycle by composing a Journey workflow on a
drag-and-drop canvas.

Learn more about [Journey Builder](https://www.salesforce.com/products/marketing-cloud/journey-management/)

![JB](https://user-images.githubusercontent.com/876030/80716658-4db7ab00-8ace-11ea-9775-9b373cf0a18e.png)

## Helpful links

- <https://www.youtube.com/watch?v=Naa31iOZFlI> watch carefully
- <https://salesforce.stackexchange.com/questions/145410/update-contact-with-custom-activity-outargument>
- <https://salesforce.stackexchange.com/questions/221821/get-the-name-of-the-data-extension-you-are-working-with-custom-activity/221888#221888>
- <https://github.com/pptonio/marketing-cloud-custom-activity>
- <https://github.com/devsutd/journey-builder-activity-template>
- <https://github.com/salesforce-marketingcloud/sfmc-example-jb-custom-activity>
- <https://github.com/mslabina/sfmc-servicecloud-customsplit>
- <https://github.com/sfm-cz/journeybuilder-custom-activity>

## Commit messages

Commit message template:

<type>[optional scope]: <description>

[optional body]

[optional footer]

type must be one of the following values:

| Type     | Description                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| build    | 🛠 Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)          |
| ci       | ⚙️ Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| docs     | 📚 Documentation only changes                                                                                  |
| feat     | ✨ A new feature                                                                                               |
| fix      | 🐛 A bug Fix                                                                                                   |
| perf     | 🚀 A code change that improves performance                                                                     |
| refactor | 📦 A code change that neither fixes a bug nor adds a feature                                                   |
| revert   | 🗑 Reverts a previous commit                                                                                    |
| style    | 💎 Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| test     | 🚨 Adding missing tests or correcting existing tests                                                           |
| progress | Work in progress (only outside master branch)                                                                  |

## How to work with Journey Builder locally

1. Sign up free account and install/unpack ngrok:  
   [setup](https://dashboard.ngrok.com/get-started/setup);  
   [local testing](https://ghostinspector.com/docs/test-local-and-firewalled-websites/)
2. Find your authentication token in ngrok site. Set your authentication token:  
   run ngrok.exe: `ngrok authtoken <myGeneratedToken>`;  
   press Enter
3. In terminal: run this command with actual URL and port:  
   `ngrok http -host-header=rewrite http://localhost:<port>`
4. ngrok will provide URL like - `https://*...*.ngrok.io` - `http` and `https`
   Use `https` URL as Endpoint URL in Journey Builder properties in Marketing Cloud site.
5. Marketing Cloud will see your changes for localhost work.

## Pre-Requisites

- Node.js (if you'd like to test locally)
- A Marketing Cloud Account with Journey Builder
- A publicly accessible web server (this template was built using a free [Heroku](https://heroku.com) account with SSL support)

## Getting Started

The quickest way to get started is to install [Node.js](https://nodejs.org/) then run the app locally:

```bash
# Install package dependencies
npm install
```

Create `.env` file with keys and values from `.env.example` file.

Run the Express app in development mode

```bash
npm run dev
// npm run dev:debug // with debugger
```

A webapp will be available at `http://localhost:3000/`

## Configure

### Step 1. Configure web server

This guide covers Heroku, skip this step if you are familiar on how to deploy a Node.js app

1. Fork or clone this repository
2. Login into [Heroku](https://heroku.com)
3. Click on New > Create new app
4. Give a name to the app and click on "Create App"
5. Choose your preferred deployment method (Github or Heroku Cli are nice to work with)
6. Deploy your code based on the selected deployment method
7. Once your code is deployed, click on the "Open app" button and verify you see your app (in any working state)

### Step 2. Configure your package in Marketing Cloud

1. Login to Marketing Cloud and Navigate to Setup > Apps > Installed Packages
2. Click on New and enter a Name and a Description for your package. Click Save.
3. **Copy the `JWT Signing Secret` value from the Summary section and save it for later**
4. Click on Add Component, select Journey Builder Activity and Click next
5. Enter the information about the activity, select Custom category, enter [url of your activity (heroku for prod or ngrok for locally)] as your Endpoint URL
6. Click Save

#### JWT: Encode with Customer Key

JWT logic can be commented if need (`"application/jwt"`, `useJwt: true`, `decoded` variable in `execute` backend method).

It works without this instruction: <https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/encode-custom-activities-using-jwt-customer-key.htm>

We use this way:

1. Navigate to Setup > Installed Packages
2. Open your package
3. Copy `JWT Signing Secret` and paste `JWT_SECRET` env variable.

### Step 3. Configure Activity

- Open /frontend/images and replace with the icons for the activity to your liking

### Step 4. Add Heroku vars

1. Log back into Heroku and navigate to your app
2. Click on "Settings"
3. Click on "Reveal config vars"
4. Add a new var called jwtSecret and paste the App Signature you got from step 3 when configuring your package in Marketing Cloud

### Step 5. Testing your Activity

1. Login into Marketing Cloud and navigate to Journey Builder
2. You should be able to see your custom activity and drag it into the canvas!

## Warnings

1. Field names (spelling options) in Salesforce in DataExtension can be different.
2. For example, you can see `Record Type ID: this ID value isn't valid for the user` if select `Business User`. But it will work for `Internal User`.
