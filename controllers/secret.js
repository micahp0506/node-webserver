'use strict'

module.exports.index = (req, res) => {
    res.status(403).send('Access Denied!');
};
