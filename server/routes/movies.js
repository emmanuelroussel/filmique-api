import 'babel-polyfill'
import Router from 'koa-router'
import Request from 'request-promise'
import tmdbApiKey from '../secrets'
import tmdbApiUrl from '../global'
import { baseApi } from '../config'

const api = 'movies'

const router = new Router();

router.prefix(`/${baseApi}/${api}`)

/* eslint-disable no-unused-vars, no-param-reassign, new-cap */

// GET /api/movies/search
router.get('/:search/:page', async(ctx) => {
  try {
    // Get keyword ID from TMDB
    const keywordUrl = `${tmdbApiUrl}/search/keyword?api_key=${tmdbApiKey}` +
      `&query=${ctx.params.search}&page=1`
    const response = await Request.get(keywordUrl)

    // Use keyword ID to get list of movies
    const keyword = JSON.parse(response).results[0].id
    const movieUrl = `${tmdbApiUrl}/discover/movie?api_key=${tmdbApiKey}` +
      '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=' +
      `${ctx.params.page}&with_keywords=${keyword}`
    let movies = await Request.get(movieUrl)

    movies = JSON.parse(movies)

    // Format the poster url
    for (let i = 0; i < movies.results.length; i++) {
      movies.results[i].poster_path = `http://image.tmdb.org/t/p/w500/${movies.results[i].poster_path}`
    }

    ctx.body = movies
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

/* eslint-enable no-unused-vars, no-param-reassign, new-cap */

export default router
