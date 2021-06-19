import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseDocument, Document } from './interfaces/document.interface';
import mongoose = require('mongoose');
import { getUnixTimestamp } from 'src/utils/timestamp';

@Injectable()
export class DocumentService {
  constructor(@InjectModel('Document') private readonly documentModel: Model<MongooseDocument>) {}

  uploadDocumentToDb(
    file_name: string,
    file_type: string,
    days_to_delete: number,
    password: string,
    encrypted_file: string,
    deletion_key: string,
    encrypted_file_size: number,
  ) {
    const dateCreatedInEpoch = getUnixTimestamp();
    const documentId = mongoose.Types.ObjectId().toHexString();
    const document: Document = {
      id: documentId,
      file_name,
      file_type,
      date_created: new Date(dateCreatedInEpoch * 1000),
      days_to_delete,
      password,
      encrypted_file,
      deletion_key,
      encrypted_file_size,
    };

    return(document);
  }

  processHexString(hexString: string) {
    const hexStringWithoutPrefix = this.removeHexPrefix(hexString);

    return hexStringWithoutPrefix.toLowerCase();
  }

  private removeHexPrefix(hexString: string) {
    const firstTwoChars = hexString.substring(0, 2);

    if (firstTwoChars.toLowerCase() === '0x') {
      const stringWithoutPrefix = hexString.substring(2);
      return stringWithoutPrefix;
    } else {
      return hexString;
    }
  }
}
