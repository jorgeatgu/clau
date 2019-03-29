import wesPalette from './../../../../src/js/color.js';

wesPalette();

const maxvul = () => {
    const margin = { top: 24, right: 48, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-temperature-max');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.fecha),
                d3.max(dataz, (d) => d.fecha)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.total),
                d3.max(dataz, (d) => d.total)
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-temperature-max-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'chart-temperature-max-container-bis');
    };

    const updateScales = (width) => {
        scales.count.x.range([0, width]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(6)
            .tickPadding(30);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height / 2 + ')')
            .call(axisX);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 200;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-temperature-max-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-temperature-max-container-bis');

        const layer = container.selectAll('.circles-max').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circles-max');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.fecha))
            .attr('cy', height / 2)
            .attr('r', 0)
            .transition()
            .delay(function(d, i) {
                return i * 10;
            })
            .duration(300)
            .attr('r', (d) => 3 * d.total)
            .attr('fill-opacity', 0.6);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/max-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = d.yearmax;
                    d.total = d.totalmax;
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

maxvul();
