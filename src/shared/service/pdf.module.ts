import { Module } from "@nestjs/common";
import { BrowserService } from "./browser.service";
import { PdfService } from "./pdf.service";

@Module({
  providers: [BrowserService, PdfService],
  exports: [PdfService],
})
export class PdfModule {}