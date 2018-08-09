'use strict';

//Estructura similar a la que utilizan en algunos proyectos de pudding.cool
var margin = { top: 24, right: 24, bottom: 24, left: 24 };
var width = 0;
var height = 0;
var ratio = 1.75;
var transitionDuration = 300;
var chart = d3.select('.chart-lluvia');
var svg = chart.select('svg');
var scales = {};
var dataz = void 0;

//Escala para los ejes X e Y
function setupScales() {

    var countX = d3.scaleTime().domain([1951, 2017]);

    var countY = d3.scaleLinear().domain([0, 60]);

    scales.count = { x: countX, y: countY };
}

//Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
function setupElements() {

    var g = svg.select('.container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'area-container');
}

//Actualizando escalas
function updateScales(width, height) {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
}

//Dibujando ejes
function drawAxes(g) {

    var axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format("d")).ticks(13);

    g.select(".axis-x").attr("transform", "translate(0," + height + ")").call(axisX);

    var axisY = d3.axisLeft(scales.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-width);

    g.select(".axis-y").transition().duration(transitionDuration).call(axisY);
}

function updateChart(dataz) {
    var w = chart.node().offsetWidth;
    var h = 600;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    var translate = "translate(" + margin.left + "," + margin.top + ")";

    var g = svg.select('.container');

    g.attr("transform", translate);

    var area = d3.area().x(function (d) {
        return scales.count.x(d.fecha);
    }).y0(height).y1(function (d) {
        return scales.count.y(d.dias);
    }).curve(d3.curveCardinal.tension(0.6));
    updateScales(width, height);

    var container = chart.select('.area-container');

    var layer = container.selectAll('.area').data([dataz]);

    var newLayer = layer.enter().append('path').attr('class', 'area');

    layer.merge(newLayer).attr('d', area);

    drawAxes(g);
}

function resize() {
    updateChart(dataz);
}

// LOAD THE DATA
function loadData() {

    d3.csv('csv/dias-de-lluvia.csv', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            dataz = data;
            dataz.forEach(function (d) {
                d.fecha = d.fecha;
                d.dias_lluvia = d.dias;
            });
            setupElements();
            setupScales();
            updateChart(dataz);
        }
    });
}

window.addEventListener('resize', resize);

loadData();