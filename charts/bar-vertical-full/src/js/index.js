import wesPalette from './../../../../src/js/color.js';

wesPalette();

const barVerticalFull = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.vertical-full-lluvia');
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

        const countY = d3.scaleLinear().domain([0, 60]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.vertical-full-lluvia-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'vertical-full-lluvia-container-dos');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format('d'));

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.vertical-full-lluvia-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.vertical-full-lluvia-container-dos');

        const layer = container.selectAll('.bar-vertical').data(dataz);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'bar-vertical');

        layer
            .merge(newLayer)
            .attr('width', width / dataz.length)
            .attr('x', (d) => scales.count.x(d.fecha))
            .attr('y', (d) => scales.count.y(d.dias))
            .attr('height', (d) => height - scales.count.y(d.dias));

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/dias-de-lluvia.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.dias_lluvia = d.dias;
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

barVerticalFull();
