'use strict'

const mongoose = require('mongoose');

const Allcaps = mongoose.model('allcaps', mongoose.Schema({}, {strict: false}));

module.exports = Allcaps;

