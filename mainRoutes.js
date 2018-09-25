var path = require("path");
var express = require("express");
var client = require('opentsdb-client')();
var mQuery = require('opentsdb-mquery')();

var mainRouter = express.Router();

mainRouter.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'landingPage.html'));
});

mainRouter.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

mainRouter.post("/dataQuery", function (req, res) {
    let start = req.body.start;
    let end = req.body.end;
    let frequency = req.body.frequency;
    let metric = req.body.metric;

    mQuery
        .aggregator('sum')
        .downsample(frequency)
        .rate(false)
        .metric(metric)
        .tags('DataLoggerName', metric)

    client
        .host('35.240.2.119')
        .port(4242)
        .ms(true)
        .arrays(true)
        .tsuids(false)
        .annotations('all')
        .start(start)
        .end(end)
        .queries(mQuery)
        .get(function onData(error, data) {
            if (error) {
                console.error(JSON.stringify(error));
                return;
            }
            res.send(data);
        });
});

module.exports = mainRouter;