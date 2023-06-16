# Grindery Embed App

The Grindery Embed App is a web application designed to be embedded into an iframe. It facilitates communication between the embedded app and the parent window using postMessages in JSON-RPC 2.0 format.

## Communication Messages

The App sends the following messages to the parent window:

1. **Resize**: This message is sent to the parent once the App has been loaded and whenever there is a window.resize event. It informs the parent window about the desired height of the iframe.  
   Example:

```json
{
  "jsonrpc": "2.0",
  "method": "gr_resize",
  "params": {
    "height": 1024
  }
}
```

2. **Complete**: This message is sent when the App's processing is complete. Upon receiving this message, the parent page can close the iframe.  
   Example:

```json
{
  "jsonrpc": "2.0",
  "method": "gr_complete"
}
```

The App expects the following message from the parent window:

1. **Initialization**: This message can be sent to the App to provide initial configuration parameters. It should be sent after the first "gr_resize" notification to ensure the embedded page is ready to receive messages.  
   Example:

```json
{
  "jsonrpc": "2.0",
  "method": "gr_initialize",
  "params": {
    "paramName1": "paramValue1",
    "paramName2": "paramValue2"
  }
}
```

## Configuration

The embed app URL parameters and query strings can be used to configure the app. The app URL is `embed.grindery.io`.

To specify trigger and action Connectors, add params to the URL. More information about Connectors can be found in the [Grindery Nexus Schema V2](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors) repository.

List of available connectors: [Grindery Nexus Schema V2 Connectors](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/cds)

For example, to set up Slack notifications when a new record is added to Airtable, use the following URL: `embed.grindery.io/airtable/slack`

Additionally, it is possible to specify the exact trigger and/or action operation and prefill input fields with values using GET parameters.

The available configuration options are as follows:

| Configuration Option          | Required | Description                                             |
| ----------------------------- | -------- | ------------------------------------------------------- |
| {trigger connector key}       | yes      | First segment of the URL                                |
| {action connector key}        | yes      | Second segment of the URL                               |
| trigger                       | no       | GET parameter: key of the trigger operation             |
| action                        | no       | GET parameter: key of the action operation              |
| trigger.input.{inputFieldKey} | no       | GET parameter: value for the input field of the trigger |
| action.input.{inputFieldKey}  | no       | GET parameter: value for the input field of the action  |

## Development

This project was bootstrapped with [Create React App](https://create-react-app.dev/).

### Available Scripts

In the project directory, you can run the following scripts:

- yarn start: Runs the app in development mode. Open http://localhost:3000 to view it in the browser. The page will reload if you make edits, and lint errors will be displayed in the console.

- yarn test: Launches the test runner in interactive watch mode. Refer to the documentation for more information on running tests.

- yarn build: Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include hashes. Your app is ready to be deployed!

## License

This project is licensed under the MIT License.
