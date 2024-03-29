import { RestClient } from './rest.client';
import * as fs from 'fs';
import puppeteerExtra from 'puppeteer-extra';
import { Browser, ScreenshotClip, Viewport } from 'puppeteer';
import { createLogger } from '../../util/log';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const logger = createLogger();

puppeteerExtra.use(StealthPlugin());

const getBrowser = async (): Promise<Browser> => {
    try {
        return await puppeteerExtra.launch({
            headless: true,
            args: ['--no-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*'],
        });
    } catch (e) {
        return await puppeteerExtra.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*'],
        });
    }
};

export abstract class PuppeteerRestClient extends RestClient {
    private readonly screenshotPath: string;
    private readonly url: string;
    private readonly viewport: Viewport = {
        width: 1000,
        height: 1200,
    };
    private readonly timeout: number = 3000;
    private readonly clip: ScreenshotClip;

    constructor({ screenshotPath, url, clip }: { screenshotPath: string; url: string; clip: ScreenshotClip }) {
        super();
        this.screenshotPath = screenshotPath;
        this.url = url;
        this.clip = clip;
    }

    retrieveScreenshot: () => Promise<{ base64Img: string; originUrl: string }> = async () => {
        if (await this.returnPreviouslySavedScreenshot()) {
            logger.info('Not updating screenshot');
            return await this.createResponse();
        }

        if (this.screenshotExists()) {
            logger.info('Deleting existing screenshot');
            await fs.promises.unlink(this.screenshotPath);
        }

        logger.info('Configuring browser');

        const browser: Browser = await getBrowser();

        const page = await browser.newPage();
        await page.setViewport(this.viewport);
        await page.setDefaultNavigationTimeout(120000);

        await page.goto(this.url);
        await page.waitForTimeout(this.timeout);

        logger.info('Creating new screenshot');
        await page.screenshot({
            path: this.screenshotPath,
            clip: this.clip,
        });
        await browser.close();

        return await this.createResponse();
    };

    isFileFromTheSameDay = (date: Date) => {
        return date.getUTCDate() === new Date().getUTCDate();
    };

    private async returnPreviouslySavedScreenshot(): Promise<boolean> {
        return (
            this.screenshotExists() &&
            this.isFileFromTheSameDay((await fs.promises.stat(this.screenshotPath)).birthtime)
        );
    }

    private screenshotExists(): boolean {
        return fs.existsSync(this.screenshotPath);
    }

    private async createResponse(): Promise<{
        originUrl: string;
        base64Img: string;
    }> {
        return {
            base64Img: await fs.promises.readFile(this.screenshotPath, 'base64'),
            originUrl: this.url,
        };
    }
}
