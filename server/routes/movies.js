import 'babel-polyfill'
import Router from 'koa-router'
import Request from 'request-promise'
import tmdbApiKey from '../secrets'
import { tmdbApiUrl, omdbApiUrl } from '../global'
import { baseApi } from '../config'

const router = new Router();

router.prefix(`/${baseApi}`)

/* eslint-disable no-unused-vars, no-param-reassign, new-cap */

async function getMovieFromTmdb(tmdbId) {
  const url = `${tmdbApiUrl}/movie/${tmdbId}?api_key=${tmdbApiKey}` +
    `&language=en-US&append_to_response=videos`
  const movie = await Request.get(url)

  return JSON.parse(movie)
}

async function getMovieFromOmdb(imdbId) {
  const url = `${omdbApiUrl}/?i=${imdbId}&plot=full&r=jsonc&tomatoes=true`
  const movie = await Request.get(url)

  return JSON.parse(movie)
}

function findTrailer(video) {
  return video.type === 'Trailer' && video.site === 'YouTube'
}

// GET /api/movies/:id
router.get('/movies/:id', async(ctx) => {
  try {
    const tmdbId = ctx.params.id

    const tmdbMovie = await getMovieFromTmdb(tmdbId)

    const info = await getMovieFromOmdb(tmdbMovie.imdb_id)

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

    if (tmdbMovie.videos.results) {
      const trailer = tmdbMovie.videos.results.find(findTrailer)

      if (trailer) {
        info.TrailerUrl = `https://www.youtube.com/watch?v=${tmdbMovie.videos.results.find(findTrailer).key}`
      }
    }

    ctx.body = info
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
