import express from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { INVERSIFY_TYPES } from '../injection/inversify-types';

@injectable()
export abstract class RestController {
  app: express.Application;

  constructor(
    @inject(INVERSIFY_TYPES.ExpressApplication) app: express.Application,
  ) {
    this.app = app;
  }

  abstract configureRoutes(): express.Application;
}
