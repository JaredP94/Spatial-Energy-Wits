function loadingAnimation() {
    let margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    let width = 300;
    let height = 300;

    //SVG container
    let svg = d3.select('#chart')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

    //SVG filter for the gooey effect
    let defs = svg.append("defs");
    let filter = defs.append("filter").attr("id", "gooeyCodeFilter");
    filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "10")
        .attr("color-interpolation-filters", "sRGB")
        .attr("result", "blur");
    filter.append("feColorMatrix")
        .attr("in", "blur")
        .attr("mode", "matrix")
        .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
        .attr("result", "gooey");

    //Create scale
    let xScale = d3.scale.linear()
        .domain([-1.25, 1.25])
        .range([-width / 2, width / 2]);

    //Create a wrapper for the circles that has the Gooey effect applied to it
    let circleWrapper = svg.append("g")
        .style("filter", "url(#gooeyCodeFilter)");

    //Create the circles that will move out and in the center circle
    let steps = 17;
    let colors = ["#F95B34", "#EE3E64", "#F36283", "#FF9C34", "#EBDE52", "#B7D84B", "#44ACCF"];
    let flyCircleData = [];

    for (let i = 0; i < steps; i++) {
        flyCircleData.push({
            fixedAngle: (i / steps) * (2 * Math.PI),
            randomAngle: (i / steps) * (2 * Math.PI),
            speed: Math.random() * 7000 + 3000,
            r: Math.floor(Math.random() * 10 + 15),
            color: colors[i % colors.length]
        })
    }

    //Set up the circles
    let flyCircles = circleWrapper.selectAll(".flyCircle")
        .data(flyCircleData)
        .enter().append("circle")
        .attr("class", "flyCircle")
        .style("fill", function (d) { return d.color; })
        .attr("cy", 0)
        .attr("cx", 0)
        .attr("r", 0)
        .transition().duration(500)
        .attr("cy", function (d) { return xScale(Math.sin(d.fixedAngle)); })
        .attr("cx", function (d) { return xScale(Math.cos(d.fixedAngle)); })
        .attr("r", function (d) { return d.r; })
        .each("end", goRound);

    //Continuously moves the circles with different speeds
    function goRound(d) {
        d3.select(this)
            .transition().duration(function (d) { return d.speed; })
            .ease("linear")
            .attrTween("transform", function () { return d3.interpolateString("rotate(0)", "rotate(360)"); })
            .each("end", goRound);
    }
}

function hideLoadingAnimation() {
    var chart = document.getElementById("chart");
    while (chart.firstChild) {
        chart.removeChild(chart.firstChild);
    }
}

function showLoadingAnimation() {
    loadingAnimation();
}

function graphLoading() {
    showLoadingAnimation();
}

function graphLoaded() {
    setTimeout(hideLoadingAnimation, 2000);
}