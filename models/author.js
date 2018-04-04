var moment = require('moment');
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });

AuthorSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
  });

AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function () {
    if (!this.date_of_birth) {
      return '';
    }
    return moment(this.date_of_birth).format('YYYY-MM-DD');
  });

AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function () {
    if (!this.date_of_death) {
      return '';
    }
    return moment(this.date_of_death).format('YYYY-MM-DD');
  });

AuthorSchema
  .virtual('lifespan')
  .get(function () {
    if (this.date_of_birth_formatted !== '' && this.date_of_death_formatted !== '') {
      return this.date_of_birth_formatted + ' - ' + this.date_of_death_formatted;
    }
    if (this.date_of_birth_formatted !== '') {
      return this.date_of_birth_formatted;
    }
    return '';
  });

module.exports = mongoose.model('Author', AuthorSchema);
