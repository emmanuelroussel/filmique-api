import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import cors from 'kcors'
import logger from 'koa-logger'
import routing from './routes/'
import { port } from './config'

// Create Koa Application
const app = new Koa()

app
  .use(logger())
  .use(bodyParser())
  .use(cors(
    { origin: 'http://localhost:8080' },
    { allowMethods: 'GET' }
  ))

routing(app)

// Start the application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))

export default app
