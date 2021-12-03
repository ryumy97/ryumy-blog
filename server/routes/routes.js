const router = require('express').Router();

const blog = require('./blog');

router.use('/api', blog);

module.exports = router;