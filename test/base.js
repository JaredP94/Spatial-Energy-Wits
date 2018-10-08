let test = require("tape");

test("Hello World: hello should greet the world", function(t) {
    let hello = "world";
    t.equal(hello, "world");
    t.end();
});

test("JSON objects can be defined and accessed without JSON parser", function(t) {
    let expectedColor = '#427378';
    let expectedScore = 75;
    let graphData = [
        {
            "id": "FIS",
            "order": 1,
            "score": 75,
            "weight": 1,
            "color": '#FF6633',
            "label": "graph 1"
        },
        {
            "id": "AO",
            "order": 2,
            "score": 43,
            "weight": 1,
            "color": '#427378',
            "label": "graph 2"
        }
    ];

    t.equal(graphData[1].color, expectedColor);
    t.equal(graphData[0].score, expectedScore);
    t.end();
})