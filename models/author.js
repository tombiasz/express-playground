const moment = require('moment');
const mongoose = require('mongoose');


const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema
  .virtual('name')
  .get(function getName() {
    return `${this.family_name}, ${this.first_name}`;
  });

AuthorSchema
  .virtual('url')
  .get(function getURL() {
    return `/catalog/author/${this.id}`;
  });

AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function getDateOfBirthFormatted() {
    const { date_of_birth } = this;
    if (!date_of_birth) {
      return '';
    }
    return moment(date_of_birth).format('YYYY-MM-DD');
  });

AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function getDateOfDeathFormatted() {
    const { date_of_death } = this;
    if (!date_of_death) {
      return '';
    }
    return moment(date_of_death).format('YYYY-MM-DD');
  });

AuthorSchema
  .virtual('lifespan')
  .get(function getLifespan() {
    const { date_of_birth_formatted, date_of_death_formatted } = this;
    if (date_of_birth_formatted !== '' && date_of_death_formatted !== '') {
      return `${date_of_birth_formatted} - ${date_of_death_formatted}`;
    }
    if (date_of_birth_formatted !== '') {
      return this.date_of_birth_formatted;
    }
    return '';
  });

module.exports = mongoose.model('Author', AuthorSchema);
