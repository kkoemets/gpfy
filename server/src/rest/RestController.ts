import express from 'express';
export abstract class RestController {
  app: express.Application;

  protected constructor(app: express.Application) {
    this.app = app;
  }

  abstract configureRoutes(): express.Application;
}
