import 'babel-polyfill'
import City from '../models/city'
import Router from 'koa-router'
import { baseApi } from '../config'

const api = 'movies'

const router = new Router();

router.prefix(`/${baseApi}/${api}`)

/* eslint-disable no-unused-vars, no-param-reassign, new-cap */

// GET /api/movies
router.get('/', async(ctx) =>
  ctx.body = await City.find())

// POST /api/movies
router.post('/', async(ctx) => {
  try {
    const city = await new City(ctx.request.body).save()
    ctx.body = city
  } catch (err) {
    ctx.throw(422)
  }
})

// GET /api/movies/id
router.get('/:id', async(ctx) => {
  try {
    const city = await City.findById(ctx.params.id)
    if (!city) {
      ctx.throw(404)
    }
    ctx.body = city
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// PUT /api/movies/id
router.put('/:id', async(ctx) => {
  try {
    const city = await City.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!city) {
      ctx.throw(404)
    }
    ctx.body = city
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// DELETE /api/movies/id
router.delete('/:id', async(ctx) => {
  try {
    const city = await City.findByIdAndRemove(ctx.params.id)
    if (!city) {
      ctx.throw(404)
    }
    ctx.body = city
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

/* eslint-enable no-unused-vars, no-param-reassign, new-cap */

export default router
