import wesPalette from './../../../../src/js/color.js';

wesPalette();

const barscatter = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-lluvia-scatter');
    const svg = chart.select('svg');
    const scales = {};
    const temp = 'ºC';
    let dataz;

    const getYear = (stringDate) => stringDate.split('-')[2];

    const removeYear = (stringDay) => {
        const inicio = 0;
        const fin = 5;
        return stringDay.substring(inicio, fin);
    };

    const setupScales = () => {
        const countX = d3.scaleLinear().domain([
            d3.min(dataz, function(d) {
                return d.year;
            }),
            d3.max(dataz, function(d) {
                return d.year;
            })
        ]);

        const countY = d3.scaleLinear().domain([
            d3.min(dataz, function(d) {
                return d.minima;
            }),
            d3.max(dataz, function(d) {
                return d.minima;
            })
        ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-lluvia-scatter-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-chart-scatter');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 20]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(20);

        g.select('.axis-x')
    .attr('transform', `translate(0,${height})`)
    .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(function(d) {
                return d + temp;
            })
            .tickSize(-width)
            .ticks(5);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-lluvia-scatter-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.area-container-chart-scatter');

        const layer = container.selectAll('.scatter-circles').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'scatter-circles');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.year))
            .attr('cy', (d) => scales.count.y(d.minima))
            .attr('r', 6)
            .attr('fill-opacity', 0.6);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/tropicales-por-dia.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.dias = removeYear(d.fecha);
                    d.minima = d.min;
                    d.year = getYear(d.fecha);
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

barscatter();
