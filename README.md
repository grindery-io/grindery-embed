# Grindery Embed App: Your Ultimate Integration Tool

The Grindery Embed App enables swift and effortless construction of an integrations directory for your web application.

Boost your website's capabilities with Grindery Embed App. This powerful tool effortlessly embeds into your existing webpages through an iframe, providing your users with a platform to link and customize interactions between a variety of web2 and web3 applications, services, dApps, and blockchain smart-contracts.

Grindery Embed App operates as a simplified workflow builder, meticulously designed to facilitate the creation and configuration of workflows. With a focus on usability, the app provides predefined parameters, including a diverse set of connectors and operations to streamline the integration process.

## Table of Contents

- [Communication](#communication)
- [Configuration](#configuration)
- [Development](#development)

## Communication

The App sends the following post messages to the parent window:

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

The Grindery Embed App is configurable via URL parameters and query strings.

The base app url is `embed.grindery.io`. By adding parameters to the URL, you can specify trigger and action Connectors. More information about Connectors can be found in the [Grindery Nexus Schema V2](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors) repository.

A full list of available connectors can be found here: [Grindery Nexus Schema V2 Connectors](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/cds)

For example, to set up Slack notifications when a new record is added to Airtable, you can use this URL: `embed.grindery.io/airtable/slack`

GET parameters can be used to specify the exact trigger and/or action operation and prefill input fields with values.

The available configuration options are as follows:

| Configuration Option            | Required | Description                                             |
| ------------------------------- | -------- | ------------------------------------------------------- |
| `{trigger connector key}`       | yes      | First segment of the URL: trigger connector key         |
| `{action connector key}`        | yes      | Second segment of the URL: action connector key         |
| `trigger`                       | no       | GET parameter: key of the trigger operation             |
| `action`                        | no       | GET parameter: key of the action operation              |
| `trigger.input.{inputFieldKey}` | no       | GET parameter: value for the input field of the trigger |
| `action.input.{inputFieldKey}`  | no       | GET parameter: value for the input field of the action  |

## Development

This project was bootstrapped with [Create React App](https://create-react-app.dev/).

### Available Scripts

In the project directory, you can run the following scripts:

- yarn start: Runs the app in development mode. Open http://localhost:3000 to view it in the browser. The page will reload if you make edits, and lint errors will be displayed in the console.

- yarn test: Launches the test runner in interactive watch mode. Refer to the documentation for more information on running tests.

- yarn build: Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include hashes. Your app is ready to be deployed!

## License

This project is licensed under the MIT License.
