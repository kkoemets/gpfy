import { RestController } from './rest-controller';
import express from 'express';
import { findContractSummaryApi } from './controller-api/bot/contract/find-contract-summary-api';
import { validateBotRequestHeaders } from './filter/validate-bot-request-headers';
import { findContractSummaryByNameApi } from './controller-api/bot/contract/find-contract-summary-by-name-api';

export class ContractController extends RestController {
  configureRoutes = (): express.Application => {
    const { app } = this;
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
