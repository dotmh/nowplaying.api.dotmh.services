![DotMH](https://github.com/dotmh/dotmh/raw/master/logo.png)

# Now Playing API

![Last.fm](https://img.shields.io/badge/last.fm-D51007?style=for-the-badge&logo=last.fm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000?style=for-the-badge&logo=deno&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-%23FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge&)](https://opensource.org/licenses/Apache-2.0)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge&)](code_of_conduct.md)

A small API using [Deno](https://deno.com) that will get the currently playing information for a user from [Last fm](https://last.fm) and return it. It is designed to be easily deployed to [Deno Deploy](https://deno.com/deploy).

# Getting Started

The easiest and only supported way to deploy this is to use [Deno Deploy](https://deno.com/deploy).

## Magic

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/dotmh/nowplaying.api.dotmh.services.git)

- Get your last.fm API Key from <https://www.last.fm/api/accounts>
- click the "Deploy on Deno" button above
- Click the "Add Environment Variables" button
- Add the following
  - add `LASTFM_API_KEY` with your API Key from Last.fm
  - add `CONFIG_USER` with the last.fm username
- Click "Create App"
- execute a get request to the URL to make sure it is working
- Party

## Manual

- fork this repo
- create an account on and/or login to <https://console.deno.com/>
- Get your last.fm API Key from <https://www.last.fm/api/accounts>
- on the Deno Deploy dashboard click "New App"
- Connect Deno deploy to your GitHub account
- Select the fork of this repo you made
- Click the "Add Environment Variables" button
- Add the following
  - add `LASTFM_API_KEY` with your API Key from Last.fm
  - add `CONFIG_USER` with the last.fm username
- Click "Create App"
- execute a get request to the URL to make sure it is working
- Party

# Developing

- Install Deno from <https://deno.com/>
- Get a Last.fm API Key from <https://www.last.fm/api/accounts>
- Clone this repo
- Created a `.env` file in the root of the project
  - add `LASTFM_API_KEY` with your API Key from Last.fm
  - add `CONFIG_USER` with the last.fm username
- run `deno run dev`

# API

The only endpoint is

## GET /

Arguments: none

### Response:

#### Success:

application/json

```typescript
{
    state: "success",
    data: {
      images: { src: string, size: "small" | "medium" | "large" | "extralarge" }[];
      artist: string;
      album: string;
      track: string;
      user: string;
      nowPlaying: boolean;
  }
}
```

#### Error:

application/json

```typescript
{
    state: "error",
    data: string
}
```
