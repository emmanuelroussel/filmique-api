import app from '../server/'
import supertest from 'supertest'
import chai from 'chai'
import chaiThings from 'chai-things'

const request = supertest.agent(app.listen())

chai.should()
chai.expect()
chai.use(chaiThings)

describe('GET /search', () => {
  it('should get movies', (done) => {
    request
      .get('/api/search?search=space&page=1')
      .expect(200, (err, res) => {
        res.body.page.should.equal(1)
        res.body.results.should.be.an.array
        res.body.results.should.all.be.json
        res.body.results.should.all.have.property('title')
        res.body.results.should.all.have.property('poster_path')
        res.body.results.should.all.have.property('release_date')
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
        res.body.should.be.json
        res.body.should.have.property('Title')
        res.body.should.have.property('Rated')
        res.body.should.have.property('Runtime')
        res.body.should.have.property('Genre')
        res.body.should.have.property('Plot')
        res.body.should.have.property('imdbRating')
        res.body.should.have.property('tomatoMeter')
        res.body.should.have.property('TrailerUrl')
        done()
      })
  }).timeout(10000);
  it('should return 404 if id is invalid', (done) => {
    request
      .get('/api/movies/1')
      .expect(404)
      done()
  }).timeout(10000);
})
