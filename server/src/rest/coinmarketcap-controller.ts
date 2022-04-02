import { RestController } from './rest-controller';
import express from 'express';
import { validateBotRequestHeaders } from './filter/validate-bot-request-headers';
import { findMarketCapSummaryApi } from './controller-api/bot/find-market-cap-summary-api';

export class CoinmarketcapController extends RestController {
  configureRoutes = (): express.Application => {
    const { app } = this;

    app
      .route('/coinmarketcap/mcap-summary')
      .get(
        validateBotRequestHeaders,
        async (_: express.Request, res: express.Response) => {
          const { cmcSummary } = await findMarketCapSummaryApi();
          res.json({ cmcSummary });
        },
      );

    return app;
  };
}
