import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { DocumentService } from './document.service';
import { getUnixTimestamp } from 'src/utils/timestamp';
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  

  @Post('upload')
  async uploadDocument(
    @Res() res,
    @Request() req,
    @Body('file_name') fileName: string,
    @Body('file_type') fileType: string,
    @Body('days_to_delete') daysDelete: number,
    @Body('password') password: string,
    @Body('encrypted_file') encryptedFile: string,
    @Body('deletion_key') deletionKey: string,
    @Body('file_size') fileSize: number,
  ) {
    
    const doc = this.documentService.uploadDocumentToDb(
      fileName,
      fileType,
      daysDelete,
      password,
      encryptedFile,
      deletionKey,
      fileSize,
    );

    res.status(201).send(doc)
    return
  }
}
