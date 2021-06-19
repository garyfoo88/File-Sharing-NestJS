import { Controller, Get, Post } from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  async uploadDocument(

  ) {
      this.documentService.uploadDocumentToDb()
  }
}
