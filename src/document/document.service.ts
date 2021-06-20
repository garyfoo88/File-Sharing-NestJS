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
    encrypted_file: string,
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
