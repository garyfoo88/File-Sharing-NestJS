import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseDocument, Document } from './interfaces/document.interface';
import mongoose = require('mongoose');
import { getUnixTimestamp } from 'src/utils/timestamp';
import { compare, hash } from 'src/utils/crypto';
const MUUID = require('uuid-mongodb');

@Injectable()
export class DocumentService {
  constructor(@InjectModel('Document') private readonly documentModel: Model<MongooseDocument>) {}

  //Upload encrypted file to DB
  async uploadDocumentToDb(
    file_name: string,
    file_type: string,
    days_to_delete: number,
    password: string,
    encrypted_file: Object,
    encrypted_file_size: number,
  ) {
    const dateCreatedInEpoch = getUnixTimestamp();
    const documentId = mongoose.Types.ObjectId().toHexString();
    if (password !== '') {
      password = await hash(password);
    }
    const document: Document = {
      id: documentId,
      file_name,
      file_type,
      date_created: new Date(dateCreatedInEpoch * 1000),
      days_to_delete,
      password,
      encrypted_file,
      deletion_key: MUUID.v4().toString(),
      encrypted_file_size,
    };
    const session = await this.documentModel.db.startSession();
    session.startTransaction();

    const docs = await this.documentModel.create([document], { session: session });
    if (docs.length !== 1) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestException('DocumentErrorDescriptions.unableCreateInDB');
    }

    await session.commitTransaction();
    session.endSession();

    return docs;
  }

  //Fetch encrypted file from DB
  async downloadFileFromDb(id: string, password: string) {
    const session = await this.documentModel.db.startSession();
    session.startTransaction();
    const doc = await this.documentModel.findOne({ id }).session(session).exec();
    if (!doc) {
      await session.abortTransaction();
      session.endSession();
      throw new NotFoundException('File not found');
    }

    //if expiry date is more than 0
    if (doc.days_to_delete) {
      const isFileExpired = await this.checkIfDocPassedExpiry(doc.days_to_delete, doc.date_created);

      //Delete document if file is pass expiry
      if (isFileExpired) {
        await this.documentModel.findOneAndDelete({ id });
        session.endSession();
        return 'Document has been deleted';
      }
    }

    if (password === '' && doc.password === '') {
      session.endSession();
      return { document: doc.encrypted_file };
    }

    if (!(await compare(password, doc.password))) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestException('Invalid Password');
    }

    session.endSession();
    return { document: doc.encrypted_file };
  }

  //Function to check if document is passed expiry
  async checkIfDocPassedExpiry(days_expired: number, created_date: Date) {
    const dateCreatedInEpoch = getUnixTimestamp();
    const dateNow = new Date(dateCreatedInEpoch * 1000);

    const newDate1 = new Date(
      created_date.getFullYear(),
      created_date.getMonth(),
      created_date.getDate(),
    );
    const newDate2 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const millisBetween = newDate2.getTime() - newDate1.getTime();
    const days = millisBetween / millisecondsPerDay;
    const file_created_days = Math.abs(days);

    if (file_created_days >= days_expired) {
      return true;
    }

    return false;
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
