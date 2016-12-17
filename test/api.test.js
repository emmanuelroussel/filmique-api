import app from '../server/'
import supertest from 'supertest'
import { expect, should } from 'chai'

const temp = {}
const request = supertest.agent(app.listen())
should()

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
