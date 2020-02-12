const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  name: String,
  password: {
    type: String,
    required: true,
  },

  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },

        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  // eslint-disable-next-line arrow-body-style
  const idx = items.findIndex((c) => {
    // eslint-disable-next-line no-underscore-dangle
    return c.courseId.toString() === course._id.toString();
  });

  if (idx >= 0) {
    // eslint-disable-next-line operator-assignment
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      // eslint-disable-next-line no-underscore-dangle
      courseId: course._id,
      count: 1,
    });
  }

  this.cart = { items };
  return this.save();
};

// eslint-disable-next-line func-names
userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex((c) => c.courseId.toString() === id.toString());

  if (items[idx].count === 1) {
    items = items.filter((c) => c.courseId.toString() !== id.toString());
  } else {
    // eslint-disable-next-line no-plusplus
    items[idx].count--;
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model('User', userSchema);
