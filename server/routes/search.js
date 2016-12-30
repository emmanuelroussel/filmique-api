import 'babel-polyfill'
import Router from 'koa-router'
import Request from 'request-promise'
import tmdbApiKey from '../secrets'
import { tmdbApiUrl } from '../global'
import { baseApi } from '../config'

const router = new Router();

router.prefix(`/${baseApi}`)

/* eslint-disable no-unused-vars, no-param-reassign, new-cap */

async function getKeywords(search) {
  const keywordUrl = `${tmdbApiUrl}/search/keyword?api_key=${tmdbApiKey}` +
    `&query=${search}&page=1`
  const keywords = await Request.get(keywordUrl)

  return JSON.parse(keywords)
}

async function getMovies(page, keyword) {
  const movieUrl = `${tmdbApiUrl}/discover/movie?api_key=${tmdbApiKey}` +
    '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=' +
    `${page}&with_keywords=${keyword}`
  const movies = await Request.get(movieUrl)

  return JSON.parse(movies)
}

// GET /api/search
router.get('/search', async(ctx) => {
  try {
    const {
      search,
      page,
    } = ctx.request.query

    const keywords = await getKeywords(search)
    if (keywords.results.length === 0) {
      ctx.throw(404)
    }

    const keyword = keywords.results[0].id
    const movies = await getMovies(page, keyword)
    if (movies.results.length === 0) {
      ctx.throw(404)
    }

    // Format the poster url
    for (let i = 0; i < movies.results.length; i++) {
      movies.results[i].poster_path = `http://image.tmdb.org/t/p/w342${movies.results[i].poster_path}`
    }

    ctx.body = movies
  } catch (err) {
    console.log(err)
    if (err.name === 'CastError' || err.name === 'NotFoundError' || err.statusCode === 404) {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

/* eslint-enable no-unused-vars, no-param-reassign, new-cap */

export default router
