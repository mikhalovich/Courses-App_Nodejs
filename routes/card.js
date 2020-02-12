/* eslint-disable no-param-reassign */
const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    // eslint-disable-next-line no-underscore-dangle
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}

function computePrice(courses) {
  // eslint-disable-next-line arrow-body-style
  return courses.reduce((total, course) => {
    // eslint-disable-next-line no-return-assign
    return total += course.price * course.count;
  }, 0);
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);
  const cart = {
    courses,
    price: computePrice(courses),
  };

  res.status(200).json(cart);
});

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  res.render('card', {
    title: 'Card',
    isCard: true,
    courses,
    price: computePrice(courses),
  });
});

module.exports = router;
