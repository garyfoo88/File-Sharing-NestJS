import { Body, Controller, Get, Post, Request, Res, Query, Delete } from '@nestjs/common';
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
    @Body('file_size') fileSize: number,
  ) {
    try {
      const doc = await this.documentService.uploadDocumentToDb(
        fileName,
        fileType,
        daysDelete,
        password,
        encryptedFile,
        fileSize,
      );

      const response = { id: doc[0].id, key: doc[0].deletion_key };
      res.status(201).send(response);
      return;
    } catch (err) {
      res.status(400).send({ error: err });
      return;
    }
  }

  @Get('download')
  async downloadEncryptedFile(@Res() res, @Query() params) {
    try {
      const id = params['id'];
      const password = params['password'];
      const doc = await this.documentService.downloadFileFromDb(id, password);
      res.status(200).send({ doc });
    } catch (err) {
      res.status(400).send({ error: err });
      return;
    }
  }

  @Delete('delete')
  async deleteDocument(@Res() res, @Query() params) {
    try{
      const id = params['id'];
      const deletion_key = params['deletion_key'];
      
    } catch(err) {

    }
  }
}
