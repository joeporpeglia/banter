# Banter

A multiplayer game without any rules or objectives yet..

## Project setup

1. Install `yarn` and VS Code.
2. Open the root folder in your terminal
3. Run `yarn`
4. Run `code banter.code-workspace`
5. Run `yarn start` - should display output from all 3 workspaces as they compile

## Notes:

- Uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to link packages together.
- No dependencies are hoisted (`package.json > nohoist`) to prevent build tools from breaking.
- TODO: Build a Docker image and host on DigitalOcean.
- TODO: NGINX reverse proxy for node server.
- TODO: server client from NGINX server?
