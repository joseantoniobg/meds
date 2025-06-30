import { Injectable } from '@nestjs/common';
import { BrowserService } from './browser.service';

@Injectable()
export class PdfService {
  constructor(private readonly browserService: BrowserService) {}

  async generatePdfFromHtml(html: string): Promise<Uint8Array<ArrayBufferLike>> {
    const browser = this.browserService.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', margin: {
                                                          top: 0,
                                                          bottom: 0,
                                                          left: 0,
                                                          right: 0
                                                      },
                                  landscape: true,
                                  printBackground: true
                                });
      return pdf;
    } finally {
      // Always close the page
      await page.close();
    }
  }
}