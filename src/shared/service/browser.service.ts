import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class BrowserService implements OnModuleInit, OnApplicationShutdown {
  private browser: Browser | null = null;
  private readonly logger = new Logger(BrowserService.name);

  async onModuleInit() {
    try {
      await this.initBrowser();
    } catch (err) {
      this.logger.warn('Initial browser launch failed; will retry on demand');
    }
  }

  async onApplicationShutdown(signal?: string) {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (err) {
        this.logger.error('Error closing browser on shutdown', err as any);
      }
      this.browser = null;
    }
  }

  private async initBrowser(): Promise<void> {
    if (this.browser) return;
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.logger.log('Puppeteer browser launched');
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      await this.initBrowser();
    }
    return this.browser as Browser;
  }
}
