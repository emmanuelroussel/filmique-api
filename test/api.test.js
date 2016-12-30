import app from '../server/'
import supertest from 'supertest'
import { expect, should } from 'chai'

const request = supertest.agent(app.listen())
should()

describe('GET /search', () => {
  it('should get movies', (done) => {
    request
      .get('/api/search?search=space&page=1')
      .expect(200, (err, res) => {
        res.body.page.should.equal(1)
        res.body.results[0].should.be.an('object')
        res.body.results[0].title.should.be.a('string')
        res.body.results[0].poster_path.should.be.a('string')
        res.body.results[0].overview.should.be.a('string')
        res.body.results[0].release_date.should.be.a('string')
        done()
      })
  })
  it('should return 404 if keyword does not exist', (done) => {
    request
      .get('/api/search?search=qahahjshdg&page=1')
      .expect(404)
      done()
  })
  it('should return 404 if search parameter is empty', (done) => {
    request
      .get('/api/search?search=&page=1')
      .expect(404)
      done()
  })
  it('should return 404 if page parameter is empty', (done) => {
    request
      .get('/api/search?search=space&page=')
      .expect(404)
      done()
  })
  it('should return 404 if both parameters are empty', (done) => {
    request
      .get('/api/search?search=&page=')
      .expect(404)
      done()
  })
})

describe('GET /movies/:id', () => {
  it('should get the movie\'s details', (done) => {
    request
      .get('/api/movies/157336')
      .expect(200, (err, res) => {
        res.body.should.be.an('object')
        res.body.Title.should.be.a('string')
        res.body.Rated.should.be.a('string')
        res.body.Runtime.should.be.a('string')
        res.body.Genre.should.be.a('string')
        res.body.Plot.should.be.a('string')
        res.body.imdbRating.should.be.a('string')
        res.body.tomatoMeter.should.be.a('string')
        done()
      })
  })
  it('should return 404 if id is invalid', (done) => {
    request
      .get('/api/movies/1')
      .expect(404)
      done()
  })
})
