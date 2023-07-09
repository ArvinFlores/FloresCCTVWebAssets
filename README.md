# FloresCCTVWebAssets

Static assets for FloresCCTV web application

## Preconditions

### Camera setup

Your camera must already be setup and be able to stream, you can follow the instructions listed on the README of the [streaming repo](https://github.com/ArvinFlores/FloresCCTVStreamServer) to set this up

### Install node

You will need node/npm installed, if you are on MacOS you can use a package manager like Homebrew to install:
```
brew install node
```

## Development

### Project setup

Open up a terminal window and clone the repo into your desired folder:

```
git clone git@github.com:ArvinFlores/FloresCCTVWebAssets.git
```
then install the dependencies by running:
```
npm install
```

### Create env file
In the root of the project, create a `.env.development` file and add the following
```
CAMERA_IP=<raspberry pi ip>
```
Where `<raspberry pi ip>` is whatever the IP address of the raspberry pi is on the LAN, [this section](https://github.com/ArvinFlores/FloresCCTVStreamServer#ssh-into-the-pi) on the server repo guide explains how you can find the raspberry pi on your LAN

### Start the dev server
You can run the following to start the development server on port 7777:
```
npm start
```
You should now be able to access the application on `https://localhost:7777`

Note: The dev server uses `https` so that the browser can access the device's microphone and camera

## Production

To create a production bundle run the following:
```
npm run build
```
This will place all of the production assets into the `build/` directory

Note: The assets are all hashed to take advantage of browser caching and will only change when the actual content of the file changes

## Scripts

| Script      | Description |
| ----------- | ----------- |
| start | starts the dev server on `https://localhost:7777` |
| lint | lints the js/ts files |
| build | creates production assets and places them in the `build/` directory |
| build:analyze | does the same as the `build` script but includes a bundle analysis report |
