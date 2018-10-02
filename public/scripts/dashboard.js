let currentYear = 2018;
let currentSampling = '6h';

function graphLoad(graphType) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    renderFilters();
    graphLoading();
    let startDate = currentYear.toString() + '/01/01 00:00';
    let endDate = (currentYear + 1).toString() + '/01/01 00:00';
    if (graphType == 'line'){
        queryMetrics(startDate, endDate, currentSampling.toString() + '-avg', graphType);
    }
    else if (graphType == 'circle') {
        queryMetrics(startDate, endDate, currentSampling.toString() + '-sum', graphType);
    }
    else if (graphType == 'aster') {
        queryMetrics(startDate, endDate, currentSampling.toString() + '-sum', graphType);
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
    currentYear = year;
    let graph = whichGraphRendered();
    graphLoad(graph);
}

function updateSampling(samplePeriod) {
    currentSampling = samplePeriod;
    let graph = whichGraphRendered();
    graphLoad(graph);
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