'use strict';

function barscatter() {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    var margin = { top: 24, right: 24, bottom: 24, left: 24 };
    var width = 0;
    var height = 0;
    var w = 0;
    var h = 0;
    var chart = d3.select('.chart-lluvia-scatter');
    var svg = chart.select('svg');
    var scales = {};
    var temp = "º";
    var dataz = void 0;

    function getYear(stringDate) {
        return stringDate.split('-')[2];
    }

    function removeYear(stringDay) {
        var inicio = 0;
        var fin = 5;
        return stringDay.substring(0, 5);
    }

    //Escala para los ejes X e Y
    function setupScales() {

        var countX = d3.scaleLinear().domain([d3.min(dataz, function (d) {
            return d.year;
        }), d3.max(dataz, function (d) {
            return d.year;
        })]);

        var countY = d3.scaleLinear().domain([d3.min(dataz, function (d) {
            return d.minima;
        }), d3.max(dataz, function (d) {
            return d.minima;
        })]);

        scales.count = { x: countX, y: countY };
    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    function setupElements() {

        var g = svg.select('.chart-lluvia-scatter-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-chart-scatter');
    }

    //Actualizando escalas
    function updateScales(width, height) {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 20]);
    }

    //Dibujando ejes
    function drawAxes(g) {

        var axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format("d")).ticks(20);

        g.select(".axis-x").attr("transform", "translate(0," + height + ")").call(axisX);

        var axisY = d3.axisLeft(scales.count.y).tickFormat(function (d) {
            return d + temp;
        }).tickSize(-width).ticks(5);

        g.select(".axis-y").call(axisY);
    }

    function updateChart(dataz) {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        var translate = "translate(" + margin.left + "," + margin.top + ")";

        var g = svg.select('.chart-lluvia-scatter-container');

        g.attr("transform", translate);

        updateScales(width, height);

        var container = chart.select('.area-container-chart-scatter');

        var layer = container.selectAll('.scatter-circles').data(dataz);

        var newLayer = layer.enter().append('circle').attr('class', 'scatter-circles');

        layer.merge(newLayer).attr("cx", function (d) {
            return scales.count.x(d.year);
        }).attr("cy", function (d) {
            return scales.count.y(d.minima);
        }).attr("r", 6).style("fill", "#DD435C").attr('fill-opacity', .5);

        drawAxes(g);
    }

    function resize() {
        updateChart(dataz);
    }

    // LOAD THE DATA
    function loadData() {

        d3.csv('csv/tropicales-por-dia.csv', function (error, data) {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach(function (d) {
                    d.fecha = d.fecha;
                    d.dias = removeYear(d.fecha);
                    d.minima = d.min;
                    d.year = getYear(d.fecha);
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    }

    window.addEventListener('resize', resize);

    loadData();
}

barscatter();