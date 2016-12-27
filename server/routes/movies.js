import 'babel-polyfill'
import Router from 'koa-router'
import Request from 'request-promise'
import tmdbApiKey from '../secrets'
import { tmdbApiUrl, omdbApiUrl } from '../global'
import { baseApi } from '../config'

const api = 'movies'

const router = new Router();

router.prefix(`/${baseApi}/${api}`)

/* eslint-disable no-unused-vars, no-param-reassign, new-cap */

// GET /api/movies/search
router.get('/search', async(ctx) => {
  try {
    // Get keyword ID from TMDB
    const keywordUrl = `${tmdbApiUrl}/search/keyword?api_key=${tmdbApiKey}` +
      `&query=${ctx.request.query.search}&page=1`
    const response = await Request.get(keywordUrl)

    // Use keyword ID to get list of movies
    const keyword = JSON.parse(response).results[0].id
    const movieUrl = `${tmdbApiUrl}/discover/movie?api_key=${tmdbApiKey}` +
      '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=' +
      `${ctx.request.query.page}&with_keywords=${keyword}`
    let movies = await Request.get(movieUrl)

    movies = JSON.parse(movies)

    // Format the poster url
    for (let i = 0; i < movies.results.length; i++) {
      movies.results[i].poster_path = `http://image.tmdb.org/t/p/w500/${movies.results[i].poster_path}`
    }

    ctx.body = movies
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError' || err.statusCode === 404) {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// GET /api/movies/:id
router.get('/:id', async(ctx) => {
  try {
    // Get movie details from TMDB to have IMDB ID
    const tmdbUrl = `${tmdbApiUrl}/movie/${ctx.params.id}?api_key=${tmdbApiKey}` +
      `&language=en-US`
    let tmdbMovie = await Request.get(tmdbUrl)

    tmdbMovie = JSON.parse(tmdbMovie)

    // Get movie details from OMDB with IMDB ID
    const omdbUrl = `${omdbApiUrl}/?i=${tmdbMovie.imdb_id}&plot=full&r=jsonc&tomatoes=true`
    let info = await Request.get(omdbUrl)

    info = JSON.parse(info)

    if (!info.Plot || info.Plot === 'N/A') {
      info.Plot = tmdbMovie.overview
    }

    if (!info.Genre || info.Genre === 'N/A') {
      info.Genre = ''

      for (let i = 0; i < tmdbMovie.genres.length; i++) {
        info.Genre += tmdbMovie.genres[i].name

        if (i !== tmdbMovie.genres.length - 1) {
          info.Genre += ', '
        }
      }
    }

    if (!info.Runtime || info.Runtime === 'N/A') {
      info.Runtime = `${tmdbMovie.runtime}` // Convert to String
    }

    ctx.body = info
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError' || err.statusCode === 404) {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

/* eslint-enable no-unused-vars, no-param-reassign, new-cap */

export default router
