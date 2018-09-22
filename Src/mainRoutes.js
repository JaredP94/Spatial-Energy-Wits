var path = require("path");
var express = require("express");
var mainRouter = express.Router();

mainRouter.get('/', function(req, res) {
    res.send('Hello world');
});

module.exports = mainRouter;