import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class BrowserService implements OnModuleInit, OnApplicationShutdown {
  private browser: Browser;

  async onModuleInit() {
    this.browser = await puppeteer.launch();
  }

  async onApplicationShutdown(signal?: string) {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getBrowser(): Browser {
    return this.browser;
  }
}