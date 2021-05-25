import * as express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import * as cors from 'cors';
import debug from 'debug';
import { RestController } from './rest/RestController';
import { MonitoringController } from './rest/MonitoringController';
import { getLogger } from './util/get-logger';

const log = getLogger();

const app: express.Application = express();
export const server: http.Server = http.createServer(app);
const port = 3001;
const routes: Array<RestController> = [new MonitoringController(app)];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
  ),
};

if (process.env.DEBUG) {
  process.on('unhandledRejection', function (reason) {
    debugLog('Unhandled Rejection:', reason);
    process.exit(1);
  });
} else {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.forEach((controller) => controller.configureRoutes());
server.listen(port, () => {
  log.info(`Server running at http://localhost:${port}`);

  routes.forEach((route: RestController) => {
    debugLog(`Routes configured for ${route}`);
  });
});
