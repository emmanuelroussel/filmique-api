import app from '../server/'
import supertest from 'supertest'
import { expect, should } from 'chai'

const temp = {}
const request = supertest.agent(app.listen())
should()

describe('POST /movies', () => {
  it('should add a city', (done) => {
    request
      .post('/api/movies')
      .set('Accept', 'application/json')
      .send({
        name: 'Bangkok',
        totalPopulation: 8249117,
        country: 'Thailand',
        zipCode: 1200,
      })
      .expect(200, (err, res) => {
        temp.idCity = res.body._id;
        done()
      })
  })
})

describe('GET /movies', () => {
  it('should get all movies', (done) => {
    request
      .get('/api/movies')
      .expect(200, (err, res) => {
        expect(res.body.length).to.be.at.least(1);
        done()
      })
  })
})

describe('GET /movies/:id', () => {
  it('should get a movie', (done) => {
    request
      .get(`/api/movies/${temp.idCity}`)
      .expect(200, (err, res) => {
        res.body.name.should.equal('Bangkok')
        res.body.totalPopulation.should.equal(8249117)
        res.body.country.should.equal('Thailand')
        res.body.zipCode.should.equal(1200)
        res.body._id.should.equal(temp.idCity)
        done()
      })
  })
})

describe('PUT /movies', () => {
  it('should update a movie', (done) => {
    request
      .put(`/api/movies/${temp.idCity}`)
      .set('Accept', 'application/json')
      .send({
        name: 'Chiang Mai',
        totalPopulation: 148477,
        country: 'Thailand',
        zipCode: 50000,
      })
      .expect(200, (err, res) => {
        temp.idCity = res.body._id;
        done()
      })
  })

  it('should get updated movie', (done) => {
    request
      .get(`/api/movies/${temp.idCity}`)
      .expect(200, (err, res) => {
        res.body.name.should.equal('Chiang Mai')
        res.body.totalPopulation.should.equal(148477)
        res.body.country.should.equal('Thailand')
        res.body.zipCode.should.equal(50000)
        res.body._id.should.equal(temp.idCity)
        done()
      })
  })
})

describe('DELETE /movies', () => {
  it('should delete a movie', (done) => {
    request
      .delete(`/api/movies/${temp.idCity}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        done()
      })
  })

  it('should get error', (done) => {
    request
      .get(`/api/movies/${temp.idCity}`)
      .expect(404, () => {
        done()
      })
  })
})
