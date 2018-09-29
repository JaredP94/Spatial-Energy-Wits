function renderCirclePack(queryData) {
    let headers = ['WITS_3_Jubilee_Road_kVarh', 'WITS_13_Jubilee_Road_kVarh', 'WITS_The_Junction_HT_kVarh', 'WITS_WC_David_Webster_Hall_kVarh', 'WITS_WC_Barnato_Sub_TRF_1_kVarh'];    
    let indices = [];
    let data = [];

    for (let data_index = 0; data_index < queryData.length; data_index++) {
        data.push(queryData[data_index][0]);
        for (let i = 0; i < headers.length; i++){
            if (headers[i] == data[data_index].metric) indices.push(i);
        }
    }

    let values = [];
    let totals = new Array();

    data.forEach(function (d) { // Make every date in the csv data a javascript date object format
        values.push(d.dps)
    });

    for (let i = 0; i < values.length; i++){
        let sum = 0;
        let extractedValues = values[i].map(function (value, index) {  return value[1]; });
        if (extractedValues.length) {
            sum = extractedValues.reduce(function (a, b) { return a + b; });
        }
        totals[indices[i]] = sum;
    }

    let marg = { top: 20, right: 200, bottom: 100, left: 50 },
        width = 1280 - marg.left - marg.right,
        height = 670 - marg.top - marg.bottom,
        r = 490,
        x = d3.scale.linear().range([0, r]),
        y = d3.scale.linear().range([0, r]),
        node,
        root;

    var pack = d3.layout.pack()
        .size([r, r])
        .value(function (d) { return d.size; });

    var vis = d3.select("#circle-pack").insert("svg:svg", "h2")
        .attr("width", width)
        .attr("height", height)
        .call(makeResponsiveCircle)
        .append("svg:g")
        .attr("transform", "translate(" + (width - r) / 2 + "," + (height - r) / 2 + ")");
    
    let graphData = {
        "name": "Residence Consumption",
        "children": [
            {
                "name": "",
                "children": [{
                    "name": "3 Jubilee",
                    "size": totals[0]
                },
                {
                    "name": "13 Jubilee",
                    "size": totals[1]
                },
                {
                    "name": "Junction HT",
                    "size": totals[2]
                }]
            },
            {
                "name": "David Webster Hall",
                "children": [{
                    "name": "",
                    "size": totals[3]
                }]
            },
            {
                "name": "Barnato Sub TRF 1",
                "children": [{
                    "name": "",
                    "size": totals[4]
                }]
            }]
    }

        node = root = graphData;
        let nodes = pack.nodes(root);

        vis.selectAll("circle")
            .data(nodes)
            .enter().append("svg:circle")
            .attr("class", function (d) { return d.children ? "parent" : "child"; })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.r; })
            .on("click", function (d) { return zoom(node == d ? root : d); });

        vis.selectAll("text")
            .data(nodes)
            .enter().append("svg:text")
            .attr("class", function (d) { return d.children ? "parent" : "child"; })
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function (d) { return d.r > 20 ? 1 : 0; })
            .text(function (d) {
                return d.name;
            });

        d3.select(window).on("click", function () { zoom(root); });

    function zoom(d, i) {
        let k = r / d.r / 2;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);

        var t = vis.transition()
            .duration(d3.event.altKey ? 7500 : 750);

        t.selectAll("circle")
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); })
            .attr("r", function (d) { return k * d.r; });
        // updateCounter is a hacky way to determine when transition is finished
        var updateCounter = 0;

        t.selectAll("text")
            .style("opacity", 0)
            .attr("x", function (d) { return x(d.x); })
            .attr("y", function (d) { return y(d.y); })
            .each(function (d, i) {
                updateCounter++;
            })
            .each("end", function (d, i) {
                updateCounter--;
                if (updateCounter == 0) {
                    adjustLabels(k);
                }
            });
        node = d;
        d3.event.stopPropagation();
    }

    function adjustLabels(k) {
        vis.selectAll("text")
            .style("opacity", function (d) {
                return k * d.r > 20 ? 1 : 0;
            })
            .text(function (d) {
                return d.name;
            })
            .filter(function (d) {
                d.tw = this.getComputedTextLength();
                return (Math.PI * (k * d.r) / 2) < d.tw;
            })
            .each(function (d) {
                var proposedLabel = d.name;
                var proposedLabelArray = proposedLabel.split('');
                while ((d.tw > (Math.PI * (k * d.r) / 2) && proposedLabelArray.length)) {
                    // pull out 3 chars at a time to speed things up (one at a time is too slow)
                    proposedLabelArray.pop(); proposedLabelArray.pop(); proposedLabelArray.pop();
                    if (proposedLabelArray.length === 0) {
                        proposedLabel = "";
                    } else {
                        proposedLabel = proposedLabelArray.join('') + "..."; // manually truncate with ellipsis
                    }
                    d3.select(this).text(proposedLabel);
                    d.tw = this.getComputedTextLength();
                }
            });
    }
}