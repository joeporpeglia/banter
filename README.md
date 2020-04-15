# Banter

Monorepo for the Banter server, client, and core game.

## Notes:

- Uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to link packages together.
- No dependencies are hoisted (`package.json > nohoist`) to prevent build tools from breaking.
- TODO: Build a Docker image and host on DigitalOcean.
- TODO: NGINX reverse proxy for node server.
- TODO: server client from NGINX server?
