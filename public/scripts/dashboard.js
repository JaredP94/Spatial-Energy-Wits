function loadingAnimation(){
    let margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    let width = 300;
    let height =300;

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
    document.getElementById("chart").style.display = "none";
}

function showLoadingAnimation() {
    document.getElementById("chart").style.display = "block";
}

function queryDatabase(start, end, metric) {
    let payload = {
        start: start,
        end: end,
        metric: metric,
    };

    $.ajax({
        url: "/dataQuery",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        async: true,
        success: function (resp) {
            console.log(resp);
        }
    });
}

function htmlbodyHeightUpdate() {
    let height3 = $(window).height();
    let height1 = $('.nav').height() + 50;
    height2 = $('.main').height();
    if (height2 > height3) {
        $('html').height(Math.max(height1, height3, height2) + 10);
        $('body').height(Math.max(height1, height3, height2) + 10);
    }
    else {
        $('html').height(Math.max(height1, height3, height2));
        $('body').height(Math.max(height1, height3, height2));
    }

}
$(document).ready(function () {
    htmlbodyHeightUpdate();
    $(window).resize(function () {
        htmlbodyHeightUpdate();
    });
    $(window).scroll(function () {
        height2 = $('.main').height();
        htmlbodyHeightUpdate();
    });
});

function graphBubbles() {
    let w = window.innerWidth * 0.68 * 0.95;
    let h = Math.ceil(w * 0.7);
    let oR = 0;
    let nTop = 0;

    let svgContainer = d3.select("#mainBubble")
        .style("height", h + "px");

    let svg = d3.select("#mainBubble").append("svg")
        .attr("class", "mainBubbleSVG")
        .attr("width", w)
        .attr("height", h)
        .on("mouseleave", function () { return resetBubbles(); });

    d3.json("/cdn/data/graphs.json", function (error, root) {
        console.log(error);

        let bubbleObj = svg.selectAll(".topBubble")
            .data(root.children)
            .enter().append("g")
            .attr("id", function (d, i) { return "topBubbleAndText_" + i });

        console.log(root);
        nTop = root.children.length;
        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");

        let colVals = d3.scale.category10();

        bubbleObj.append("circle")
            .attr("class", "topBubble")
            .attr("id", function (d, i) { return "topBubble" + i; })
            .attr("r", function (d) { return oR; })
            .attr("cx", function (d, i) { return oR * (3 * (1 + i) - 1); })
            .attr("cy", (h + oR) / 3)
            .style("fill", function (d, i) { return colVals(i); }) // #1f77b4
            .style("opacity", 0.3)
            .on("mouseover", function (d, i) { return activateBubble(d, i); })
            .attr("cursor", "pointer");

        bubbleObj.append("text")
            .attr("class", "topBubbleText")
            .attr("x", function (d, i) { return oR * (3 * (1 + i) - 1); })
            .attr("y", (h + oR) / 3)
            .style("fill", function (d, i) { return colVals(i); }) // #1f77b4
            .attr("font-size", 30)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .text(function (d) { return d.name })
            .attr("cursor", "pointer")
            .on("mouseover", function (d, i) { return activateBubble(d, i); })
            .on("click", function (d, i) {
                window.open(d.address);
            });
    });

    resetBubbles = function () {
        w = window.innerWidth * 0.68 * 0.95;
        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");

        svg.attr("width", w);
        svg.attr("height", h);

        let t = svg.transition()
            .duration(250);

        t.selectAll(".topBubble")
            .attr("r", function (d) { return oR; })
            .attr("cx", function (d, i) { return oR * (3 * (1 + i) - 1); })
            .attr("cy", (h + oR) / 3);

        t.selectAll(".topBubbleText")
            .attr("font-size", 30)
            .attr("x", function (d, i) { return oR * (3 * (1 + i) - 1); })
            .attr("y", (h + oR) / 3);
    }

    function activateBubble(d, i) {
        // increase this bubble and decrease others
        let t = svg.transition()
            .duration(d3.event.altKey ? 7500 : 350);

        t.selectAll(".topBubble")
            .attr("cx", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("r", function (d, ii) {
                if (i == ii)
                    return oR * 1.8;
                else
                    return oR * 0.8;
            });

        t.selectAll(".topBubbleText")
            .attr("x", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("font-size", function (d, ii) {
                if (i == ii)
                    return 30 * 1.5;
                else
                    return 30 * 0.6;
            });
    }

    window.onresize = resetBubbles;
}

$(document).ready(function () {
    //loadingAnimation();
    //setTimeout(hideLoadingAnimation, 5000);
    graphBubbles();
    queryDatabase('2018/08/30 00:00', '2018/08/31 00:00', 'WITS_13_Jubilee_Road_kVarh');
})