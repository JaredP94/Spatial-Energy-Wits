function renderAsterPlot(queryData) {
    let headers = [
        'WITS_3_Jubilee_Road_kVarh',
        'WITS_13_Jubilee_Road_kVarh',
        'WITS_WC_David_Webster_Hall_kVarh',
        'WITS_WC_Barnato_Sub_TRF_1_kVarh',
        'WITS_The_Junction_ePitstop_kVarh',
        'WITS_WC_Barnato_Sub_Residence_A___D_kVarh',
        'WITS_WC_Barnato_Sub_TRF_2_kVarh',
        'WITS_The_Junction_HT_kVarh'
    ];
    let buildings = [
        '3 Jubilee Road', 
        '13 Jubilee Road', 
        'David Webster Hall', 
        'Barnato Sub TRF 1',
        'Junction ePitstop',
        'Barnato Sub Res',
        'Barnato Sub TRF 2',
        'Junction HT'
    ];
    let studentOccupancy = [
        100, 
        250, 
        500, 
        800, 
        800,
        500,
        400,
        1500
    ];
    let indices = [];
    let data = [];

    for (let data_index = 0; data_index < queryData.length; data_index++) {
        data.push(queryData[data_index][0]);
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] == data[data_index].metric) indices.push(i);
        }
    }

    let values = [];
    let totals = [];

    data.forEach(function (d) { // Make every date in the csv data a javascript date object format
        values.push(d.dps)
    });

    values.forEach(function (d) {
        let sum = 0;
        let extractedValues = d.map(function (value, index) { return value[1]; });
        if (extractedValues.length) {
            sum = extractedValues.reduce(function (a, b) { return a + b; });
        }
        totals.push(sum);
    });

    let student_totals = [];

    for (let i = 0; i < totals.length; i++) {
        student_totals.push(totals[i] / studentOccupancy[indices[i]]);
    }

    let maxRatio = Math.max.apply(Math, student_totals);

    let width = 700,
        height = 600,
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
            return (radius - innerRadius) * (d.data.score / maxRatio) + innerRadius;
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

    let graphData = [
        {
            "id": "FIS",
            "order": 1,
            "score": student_totals[0],
            "weight": 1,
            "color": colorArray[0],
            "label": buildings[indices[0]]
        },
        {
            "id": "AO",
            "order": 2,
            "score": student_totals[1],
            "weight": 1,
            "color": colorArray[1],
            "label": buildings[indices[1]]
        },
        {
            "id": "NP",
            "order": 3,
            "score": student_totals[2],
            "weight": 1,
            "color": colorArray[2],
            "label": buildings[indices[2]]
        },
        {
            "id": "CS",
            "order": 4,
            "score": student_totals[3],
            "weight": 1,
            "color": colorArray[3],
            "label": buildings[indices[3]]
        },
        {
            "id": "CP",
            "order": 5,
            "score": student_totals[4],
            "weight": 1,
            "color": colorArray[4],
            "label": buildings[indices[4]]
        },
        {
            "id": "FD",
            "order": 6,
            "score": student_totals[5],
            "weight": 1,
            "color": colorArray[5],
            "label": buildings[indices[5]]
        },
        {
            "id": "RD",
            "order": 7,
            "score": student_totals[6],
            "weight": 1,
            "color": colorArray[6],
            "label": buildings[indices[6]]
        },
        {
            "id": "QW",
            "order": 8,
            "score": student_totals[7],
            "weight": 1,
            "color": colorArray[7],
            "label": buildings[indices[7]]
        }
    ];

    graphData.forEach(function (d) {
        d.id = d.id;
        d.order = +d.order;
        d.color = d.color;
        d.weight = +d.weight;
        d.score = +d.score;
        d.width = +d.weight;
        d.label = d.label;
    });

    let path = svg.selectAll(".solidArc")
        .data(pie(graphData))
        .enter().append("path")
        .attr("fill", function (d) { return d.data.color; })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    let outerPath = svg.selectAll(".outlineArc")
        .data(pie(graphData))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "outlineArc")
        .attr("d", outlineArc);


    // calculate the weighted mean score
    let score =
        graphData.reduce(function (a, b) {
            //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
            return a + (b.score * b.weight);
        }, 0) /
        graphData.reduce(function (a, b) {
            return a + b.weight;
        }, 0);

    svg.append("svg:text")
        .attr("class", "aster-score")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text(Math.round(score) + " kVArh/stud");

}