import { RestController } from './rest-controller';
import express from 'express';
import { validateBotRequestHeaders } from './filter/validate-bot-request-headers';
import { findMarketCapSummaryApi } from './controller-api/bot/find-market-cap-summary-api';
import {
  findContractSummaryApi,
  findContractSummaryByNameApi,
} from './controller-api/bot/crypto-data-controller-api';

export class CryptoDataController extends RestController {
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

    app
      .route('/bot/contract/summary')
      .get(
        validateBotRequestHeaders,
        async (req: express.Request, res: express.Response) => {
          const contract: string | undefined = req?.query?.contract
            ?.toString()
            ?.trim();
          const coinFullName: string | undefined = req?.query?.coinFullName
            ?.toString()
            ?.trim();
          if (![contract, coinFullName].filter((el) => el).length) {
            throw new Error();
          }

          const summaryText = contract
            ? await findContractSummaryApi(contract)
            : await findContractSummaryByNameApi(coinFullName || '').catch(
                () => 'Could not find price for ' + coinFullName,
              );
          res.json({ summaryText });
        },
      );

    return app;
  };
}
