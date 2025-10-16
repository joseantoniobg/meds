import { Injectable, Logger } from '@nestjs/common';
import { BrowserService } from './browser.service';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(private readonly browserService: BrowserService) {}

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        landscape: true,
        printBackground: true,
      });

      // Puppeteer returns a Buffer
      return pdf as Buffer;
    } catch (err) {
      this.logger.error('Error generating PDF', err as any);
      throw err;
    } finally {
      // Always close the page
      try {
        await page.close();
      } catch (err) {
        this.logger.warn('Error closing Puppeteer page', err as any);
      }
    }
  }
}
