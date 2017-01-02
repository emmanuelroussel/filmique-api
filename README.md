# filmique-api

## Description
Koa 2 RESTful API using :

 - Koa 2
 - Mongodb + Mongoose
 - Babel
 - Asynchronous Functions (Async/Await)

Adapted from [koa-restful-boilerplate](https://github.com/jsnomad/koa-restful-boilerplate) boilerplate

## Getting Started
This Rest API uses the [TMDB](https://www.themoviedb.org) api to get movies. You will need your own api key to use it. The process to get one is described on [their docs](https://developers.themoviedb.org/3).

Once you got your key, create a file called `secrets.js` in the `server/` directory and replace the dummy content with your api key.
```
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
