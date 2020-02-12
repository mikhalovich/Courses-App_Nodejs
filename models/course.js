/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    require: true,
  },

  img: String,

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// eslint-disable-next-line func-names
courseSchema.method('toClient', function () {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

module.exports = model('Course', courseSchema);
