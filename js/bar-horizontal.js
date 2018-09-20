'use strict';

function barHorizontal() {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    var margin = { top: 24, right: 24, bottom: 24, left: 64 };
    var width = 0;
    var height = 0;
    var chart = d3.select('.chart-lluvia-bar-horizontal');
    var svg = chart.select('svg');
    var scales = {};
    var dataz = void 0;

    //Escala para los ejes X e Y
    function setupScales() {

        var countX = d3.scaleLinear().domain([0, d3.max(dataz, function (d) {
            return d.dias;
        })]);

        var countY = d3.scaleBand().domain(dataz.map(function (d) {
            return d.fecha;
        })).paddingInner(0.1).paddingOuter(0.5);

        scales.count = { x: countX, y: countY };
    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    function setupElements() {

        var g = svg.select('.chart-lluvia-bar-horizontal-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-chart-horizontal');
    }

    //Actualizando escalas
    function updateScales(width, height) {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    function drawAxes(g) {

        var axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format("d")).tickSize(-height);

        g.select(".axis-x").attr("transform", "translate(0," + height + ")").call(axisX);

        var axisY = d3.axisLeft(scales.count.y).ticks(1).tickFormat(d3.format("d"));

        g.select(".axis-y").call(axisY);
    }

    function updateChart(dataz) {
        var w = chart.node().offsetWidth;
        var h = window.innerHeight;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        var translate = "translate(" + margin.left + "," + margin.top + ")";

        var g = svg.select('.chart-lluvia-bar-horizontal-container');

        g.attr("transform", translate);

        updateScales(width, height);

        var container = chart.select('.area-container-chart-horizontal');

        var layer = container.selectAll('.bar-horizontal').data(dataz);

        var newLayer = layer.enter().append('rect').attr('class', 'bar-horizontal');

        layer.merge(newLayer).attr("x", 0).attr("y", function (d) {
            return scales.count.y(d.fecha);
        }).attr("height", height / dataz.length - 2).attr("width", function (d) {
            return scales.count.x(d.dias);
        });

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
}

barHorizontal();