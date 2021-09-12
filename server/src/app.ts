import * as express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as cors from "cors";
import debug from "debug";
import { RestController } from "./rest/rest-controller";
import { MonitoringController } from "./rest/monitoring-controller";
import { getLogger } from "./util/get-logger";
import { ContractController } from "./rest/contract-controller";

import "express-async-errors";
import { CoinmarketcapController } from "./rest/coinmarketcap-controller";
import { LookIntoBitcoinController } from "./rest/look-into-bitcoin-controller";

const log = getLogger();

const app: express.Application = express();
export const server: http.Server = http.createServer(app);
const port = 3001;
const routes: Array<RestController> = [
  new MonitoringController(app),
  new ContractController(app),
  new CoinmarketcapController(app),
  new LookIntoBitcoinController(app)
];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/app-request-${Date.now()}.log`
    })
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
};

if (process.env.DEBUG) {
  process.on("unhandledRejection", function(reason) {
    debugLog("Unhandled Rejection:", reason);
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
