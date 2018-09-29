function renderAsterPlot(queryData) {
    let width = 700,
        height = 700,
        radius = Math.min(width, height) / 2,
        innerRadius = 0.3 * radius;

    let pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.width; });

    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
        });

    let arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) {
            return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
        });

    let outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    let svg = d3.select("#aster-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.call(tip);

    d3.csv('/cdn/data/aster_data.csv', function (error, data) {

        data.forEach(function (d) {
            d.id = d.id;
            d.order = +d.order;
            d.color = d.color;
            d.weight = +d.weight;
            d.score = +d.score;
            d.width = +d.weight;
            d.label = d.label;
        });

        let path = svg.selectAll(".solidArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", function (d) { return d.data.color; })
            .attr("class", "solidArc")
            .attr("stroke", "gray")
            .attr("d", arc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        let outerPath = svg.selectAll(".outlineArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("class", "outlineArc")
            .attr("d", outlineArc);


        // calculate the weighted mean score
        let score =
            data.reduce(function (a, b) {
                //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
                return a + (b.score * b.weight);
            }, 0) /
            data.reduce(function (a, b) {
                return a + b.weight;
            }, 0);

        svg.append("svg:text")
            .attr("class", "aster-score")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle") // text-align: right
            .text(Math.round(score));

    });
}