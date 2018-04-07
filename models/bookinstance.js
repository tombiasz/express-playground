const moment = require('moment');
const mongoose = require('mongoose');


const { Schema } = mongoose;
const STATUS_AVAILABLE = 'Available';
const STATUS_MAINTENANCE = 'Maintenance';
const STATUS_LOANED = 'Loaned';
const STATUS_RESERVED = 'Reserved';
const STATUSES = [
  STATUS_AVAILABLE,
  STATUS_MAINTENANCE,
  STATUS_LOANED,
  STATUS_RESERVED,
];

const BookInstanceSchema = new Schema({
  book: { type: Schema.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: { type: String, required: true, enum: STATUSES, default: STATUS_MAINTENANCE },
  due_back: { type: Date, default: Date.now },
});

BookInstanceSchema
  .virtual('url')
  .get(function getURL() {
    return `/catalog/bookinstance/${this.id}`;
  });

BookInstanceSchema
  .virtual('due_back_formatted')
  .get(function getDueBackFormatted() {
    return moment(this.due_back).format('MMMM Do, YYYY');
  });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
