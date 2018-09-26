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
    var chart = document.getElementById("chart");
    while (chart.firstChild) {
        chart.removeChild(chart.firstChild);
    }
}

function showLoadingAnimation() {
    loadingAnimation();
}

function queryDatabase(start, end, frequency, metric, graph) {
    let payload = {
        start: start,
        end: end,
        frequency: frequency,
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
            //console.log(resp);
            graphLoaded();
            if (graph == "line") setTimeout(renderLineGraph.bind(null, resp), 2000);
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
        //console.log(error);

        let bubbleObj = svg.selectAll(".topBubble")
            .data(root.children)
            .enter().append("g")
            .attr("id", function (d, i) { return "topBubbleAndText_" + i });

        //console.log(root);
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
            .attr("cursor", "pointer")
            .on("click", function (d, i) {
                if (d.address == "bubble1") graph1();
            });

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
                if (d.address == "bubble1") graph1();
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

function renderLineGraph(queryData){
    let margin = { top: 20, right: 200, bottom: 100, left: 50 },
        margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    let parseDate = d3.time.format("%Y%m%d").parse;
    let bisectDate = d3.bisector(function (d) { return d.date; }).left;

    let xScale = d3.time.scale()
        .range([0, width]),

        xScale2 = d3.time.scale()
            .range([0, width]); // Duplicate xScale for brushing ref later

    let yScale = d3.scale.linear()
        .range([height, 0]);

    // 40 Custom DDV colors 
    let color = d3.scale.ordinal().range(["#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);


    let xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom"),

        xAxis2 = d3.svg.axis() // xAxis for brush slider
            .scale(xScale2)
            .orient("bottom");

    let yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    let line = d3.svg.line()
        .interpolate("basis")
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.rating); })
        .defined(function (d) { return d.rating; });  // Hiding line value defaults of 0 for missing data

    let maxY; // Defined later to update yAxis

    let svg = d3.select("#line-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
        .call(makeResponsive)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create invisible rect for mouse tracking
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white");

    //for slider part-----------------------------------------------------------------------------------

    let context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + 410 + ")")
        .attr("class", "context");

    //append clip path for lines plotted, hiding those part out of bounds
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    //end slider part----------------------------------------------------------------------------------- 
    let data = queryData[0];
        //console.log(data);
    let headers = new Array();
    headers['date'] = 'date';
    headers['Energy'] = 'energy';
    color.domain(d3.keys(headers).filter(function (key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
        return key !== "date";
    }));

    data.dps.forEach(function (d) { // Make every date in the csv data a javascript date object format
        d[0] = new Date(d[0]);
        // let date = String(d[0].getFullYear()) + String(d[0].getMonth()) + String(d[0].getDate());
        // d[0] = parseDate(date);
        //console.log(d[0]);
    });

    let categories = color.domain().map(function (name) { // Nest the data into an array of objects with new keys
        return {
            name: name, // "name": the csv headers except date
            values: data.dps.map(function (d) { // "values": which has an array of the dates and ratings
                return {
                    date: d[0],
                    rating: d[1],
                };
            }),
            visible: (name === "Energy" ? true : false) // "visible": all false except for economy which is true.
        };
    });

    xScale.domain(d3.extent(data.dps, function (d) { return d[0]; })); // extent = highest and lowest points, domain is data, range is bouding box

    yScale.domain([0,
        d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
    ]);

    xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

    //for slider part-----------------------------------------------------------------------------------

    let brush = d3.svg.brush()//for slider bar at the bottom
        .x(xScale2)
        .on("brush", brushed);

    context.append("g") // Create brushing xAxis
        .attr("class", "x axis1")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    let contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
        .interpolate("monotone")
        .x(function (d) { return xScale2(d.date); }) // x is scaled to xScale2
        .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
        .y1(0); // Top line of area, 0 (area chart not inverted)

    //plot the rect as the bar at the bottom
    context.append("path") // Path is created using svg.area details
        .attr("class", "area")
        .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator 
        .attr("fill", "#F1F1F2");

    //append the brush for the selection of subsection  
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2) // Make brush rects same height 
        .attr("fill", "#E6E7E8");
    //end slider part-----------------------------------------------------------------------------------

    // draw line graph
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("x", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("kVArh");

    let issue = svg.selectAll(".issue")
        .data(categories) // Select nested data and append to new svg group elements
        .enter().append("g")
        .attr("class", "issue");

    issue.append("path")
        .attr("class", "line")
        .style("pointer-events", "none") // Stop line interferring with cursor
        .attr("id", function (d) {
            return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
        })
        .attr("d", function (d) {
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
        })
        .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
        .style("stroke", function (d) { return color(d.name); });

    // draw legend
    let legendSpace = 450 / categories.length; // 450/number of issues (ex. 40)    

    issue.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", width + (margin.right / 3) - 15)
        .attr("y", function (d, i) { return (legendSpace) + i * (legendSpace) - 8; })  // spacing
        .attr("fill", function (d) {
            return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
        })
        .attr("class", "legend-box")

        .on("click", function (d) { // On click make d.visible 
            d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

            maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
            yScale.domain([0, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            svg.select(".y.axis")
                .transition()
                .call(yAxis);

            issue.select("path")
                .transition()
                .attr("d", function (d) {
                    return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                })

            issue.select("rect")
                .transition()
                .attr("fill", function (d) {
                    return d.visible ? color(d.name) : "#F1F1F2";
                });
        })

        .on("mouseover", function (d) {

            d3.select(this)
                .transition()
                .attr("fill", function (d) { return color(d.name); });

            d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
                .transition()
                .style("stroke-width", 2.5);
        })

        .on("mouseout", function (d) {

            d3.select(this)
                .transition()
                .attr("fill", function (d) {
                    return d.visible ? color(d.name) : "#F1F1F2";
                });

            d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
                .transition()
                .style("stroke-width", 1.5);
        })

    issue.append("text")
        .attr("x", width + (margin.right / 3))
        .attr("y", function (d, i) { return (legendSpace) + i * (legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
        .text(function (d) { return d.name; });

        // Hover line 
    let hoverLineGroup = svg.append("g")
        .attr("class", "hover-line");

    let hoverLine = hoverLineGroup // Create line with basic attributes
        .append("line")
        .attr("id", "hover-line")
        .attr("x1", 10).attr("x2", 10)
        .attr("y1", 0).attr("y2", height + 10)
        .style("pointer-events", "none") // Stop line interferring with cursor
        .style("opacity", 1e-6); // Set opacity to zero 

    let hoverDate = hoverLineGroup
        .append('text')
        .attr("class", "hover-text")
        .attr("y", height - (height - 40)) // hover date text position
        .attr("x", width - 150) // hover date text position
        .style("fill", "#E6E7E8");

    let columnNames = d3.keys(data[0]) //grab the key values from your first data row
        //these are the same as your column names
        .slice(1); //remove the first column name (`date`);

    let focus = issue.select("g") // create group elements to house tooltip text
        .data(columnNames) // bind each column name date to each g element
        .enter().append("g") //create one <g> for each columnName
        .attr("class", "focus");

    focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
        .attr("class", "tooltip")
        .attr("x", width + 20) // position tooltips  
        .attr("y", function (d, i) { return (legendSpace) + i * (legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       

    // Add mouseover events for hover line.
    d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
        .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
        .on("mouseout", function () {
            hoverDate
                .text(null) // on mouseout remove text for hover date

            d3.select("#hover-line")
                .style("opacity", 1e-6); // On mouse out making line invisible
        });

    function mousemove() {
        let mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
        let graph_x = xScale.invert(mouse_x); // 
        let format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year

        hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year

        d3.select("#hover-line") // select hover-line and changing attributes to mouse position
            .attr("x1", mouse_x)
            .attr("x2", mouse_x)
            .style("opacity", 1); // Making line visible

        // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

        let x0 = xScale.invert(d3.mouse(this)[0]), /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
            i = bisectDate(data, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
            /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
            d0 = data[i - 1],
            d1 = data[i],
            /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
        /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/

        //d is now the data row for the date closest to the mouse position

        focus.select("text").text(function (columnName) {
            //because you didn't explictly set any data on the <text>
            //elements, each one inherits the data from the focus <g>

            return (d[columnName]);
        });
    }

    //for brusher of the slider bar at the bottom
    function brushed() {

        xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

        svg.select(".x.axis") // replot xAxis with transition when brush used
            .transition()
            .call(xAxis);

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

        svg.select(".y.axis") // Redraw yAxis
            .transition()
            .call(yAxis);

        issue.select("path") // Redraw lines based on brush xAxis scale and domain
            .transition()
            .attr("d", function (d) {
                return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
            });
    }

    function findMaxY(data) {  // Define function "findMaxY"
        let maxYValues = data.map(function (d) {
            if (d.visible) {
                return d3.max(d.values, function (value) { // Return max rating value
                    return value.rating;
                })
            }
        });
        return d3.max(maxYValues);
    }
}

function makeResponsive(svg) {
    let container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspectRatio = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);


    function resize() {
        let targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspectRatio) - 60);
    }
}

function graphLoading() {
    showLoadingAnimation();
}

function graphLoaded() {
    setTimeout(hideLoadingAnimation, 2000);
}


function renderBubbles() {
    document.getElementById("mainBubble").style.display = "block";
}

function hideBubbles() {
    document.getElementById("mainBubble").style.display = "none";
}

function graph1() {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    graphLoading();
    queryDatabase('2018/01/30 00:00', '2018/06/31 00:00', '6h-avg', ['WITS_13_Jubilee_Road_kVarh', 'WITS_3_Jubilee_Road_kVarh'], 'line');
}

function resetGraph1() {
    var lineChart = document.getElementById("line-chart");
    while (lineChart.firstChild) {
        lineChart.removeChild(lineChart.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes())
}

function resetGraphs() {
    resetGraph1();
}

$(document).ready(function () {
    graphBubbles();
    renderBubbles();
    //queryDatabase('2018/08/30 00:00', '2018/08/31 00:00', 'WITS_13_Jubilee_Road_kVarh');
})