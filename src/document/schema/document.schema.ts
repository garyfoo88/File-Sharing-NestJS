import * as mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  file_type: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
  days_to_delete: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  encrypted_file: {
    type: String,
    required: true,
  },
  deletion_key: {
    type: String,
    required: true,
  },
  encrypted_file_size: {
    type: Number,
    required: true,
  },
});

export { DocumentSchema };
