import * as mongoose from 'mongoose';

interface MongooseDocument extends mongoose.Document {
  id: string;
  file_name: string,
  file_type: string,
  date_created: Date;
  days_to_delete?: number;
  password?: string;
  encrypted_file: string;
  deletion_key: string;
  encrypted_file_size: number;
}

interface Document {
    id: string;
    file_name: string,
    file_type: string,
    date_created: Date;
    days_to_delete?: number;
    password?: string;
    encrypted_file: string;
    deletion_key: string;
    encrypted_file_size: number;
  }

export { MongooseDocument, Document };