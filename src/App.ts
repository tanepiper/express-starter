import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { ApiRouter } from './routes';
import { expressLogger } from './imports';
type Application = express.Application;

/// Creates and configures an Express web server.
class App {
  /** Express app instance */
  private instance = express();
  private apiRouter = new ApiRouter().export();

  /** Configure Express instance */
  constructor() {
    this.setup();
    this.middlewares();
    this.routes();
  }

  /** Configure Express settings */
  private setup() {
    this.instance.set('trust proxy', 'loopback');
  }

  /** Configure Express middleware */
  private middlewares() {
    this.instance.use(expressLogger);
    this.instance.use('/api', bodyParser.json());
    this.instance.use('/api', bodyParser.urlencoded({ extended: false }));
  }

  /** Configure API endpoints */
  private routes() {
    const staticDir = path.join(__dirname, '..', 'static');
    const indexDir = path.resolve(staticDir, 'index.html');

    // Configure API route
    this.instance.use('/api', this.apiRouter);

    // Configure to serve index and assets from static as a fallback mechanism
    // (Ideally, you should be using NGINX to serve static assets! Express is
    //   best used as an API server, as it is generally slower than NGINX.)
    this.instance.get('/', (req, res) => res.sendFile(indexDir));
    this.instance.use(express.static(staticDir));
  }

  /** Exports the App's internal Express instance */
  export = (): Application => this.instance;
}

export default App;
