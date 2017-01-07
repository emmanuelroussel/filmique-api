# filmique API
Rest api for filmique, a web app that helps you find movies to watch

## Description
RESTful API I built using [Koa 2](https://github.com/koajs/koa/tree/v2.x) to provide data for [filmique](https://github.com/emmanuelroussel/filmique-app). Adapted from [koa-restful-boilerplate](https://github.com/jsnomad/koa-restful-boilerplate).

This API is a simple wrapper around the [TMDb API](https://developers.themoviedb.org/3) and the [OMDb API](https://www.omdbapi.com/), so all the data comes from these two APIs.

Note: This was simply built to learn Koa 2 and Vue.js. I do not have control over the data returned by TMDb. Their API often returns very underground and weird movies.

## Getting Started
This API uses the TMDb API to search for movies. You will need your own api key to use it. The process to get one is described on [their docs](https://developers.themoviedb.org/3).

First, clone this repo. Then, once you got your api key from TMDb, create a file called `secrets.js` in the `server/` directory with the following content (make sure to replace `your tmdb api key` with your key).
``` javascript
const tmdbApiKey = 'your tmdb api key'

export default tmdbApiKey
```

Install dependencies
```
npm install
```

## Running
Start a Local Server
```
npm start
```

Run Test
```
npm test
```

Building and Running Production Server
```
npm run prod
```
