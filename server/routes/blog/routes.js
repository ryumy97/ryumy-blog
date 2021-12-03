const router = require('express').Router();

const { getPosts } = require('./handler/blog');

router.get('/blog', getPosts);

module.exports = router;