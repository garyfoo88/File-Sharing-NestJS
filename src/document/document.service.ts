import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseDocument } from './interfaces/document.interface';
import mongoose = require('mongoose');

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document') private readonly documentModel: Model<MongooseDocument>
  ){}

  uploadDocumentToDb(

  ) {
    const documentId = mongoose.Types.ObjectId().toHexString();
    console.log(documentId)
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
