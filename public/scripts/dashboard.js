function graphLoad(graphType, year) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    renderFilters();
    graphLoading();
    let startDate = year.toString() + '/01/01 00:00';
    let endDate = (year + 1).toString() + '/01/01 00:00';
    if (graphType == 'line'){
        queryMetrics(startDate, endDate, '6h-avg', graphType);
    }
    else if (graphType == 'circle') {
        queryMetrics(startDate, endDate, '30d-sum', graphType);
    }
    else if (graphType == 'aster') {
        queryMetrics(startDate, endDate, '30d-sum', graphType);
    }
}

function resetGraph(graphID) {
    var graph = document.getElementById(graphID);
    while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes() || document.getElementById("circle-pack").hasChildNodes() || document.getElementById("aster-chart").hasChildNodes())
}

function whichGraphRendered() {
    if (document.getElementById("line-chart").hasChildNodes()) return 'line';
    else if (document.getElementById("circle-pack").hasChildNodes()) return 'circle';
    else if (document.getElementById("aster-chart").hasChildNodes()) return 'aster';
}

function updateYear(year) {
    let graph = whichGraphRendered();
    graphLoad(graph, year);
}

function updateSampling(samplePeriod) {
    let graph = whichGraphRendered();
    graphLoad(graph, samplePeriod);
}

function resetGraphs() {
    resetGraph("line-chart");
    resetGraph("circle-pack");
    resetGraph("aster-chart");
}

function renderFilters() {
    document.getElementById('filter-sidebar').style.display = 'block';
}

$(function () {
    graphBubbles();
    renderBubbles();
})