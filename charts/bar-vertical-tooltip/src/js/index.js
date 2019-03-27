import wesPalette from './../../../../src/js/color.js';

wesPalette();

const barVerticalTooltip = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-bar-vertical-tooltip');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const tooltip = chart
        .append('div')
        .attr('class', 'tooltip-container')
        .style('opacity', 1);

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
        const g = svg.select('.chart-lluvia-bar-vertical-tooltip-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-chart-vertical-tooltip');
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

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .ticks(5)
            .tickSize(-width);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.chart-lluvia-bar-vertical-tooltip-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select(
            '.area-container-chart-vertical-tooltip'
        );

        const layer = container.selectAll('.bar-vertical').data(dataz);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'bar-vertical');

        layer
            .merge(newLayer)
            .on('mouseover', (d) => {
                tooltip
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
                tooltip.html(
                    '<div class="tooltip-lluvia-mes-container"><p class="tooltip-lluvia-mes">Lluvia acumulada en ' +
                        d.fecha +
                        '<span class="tooltip-lluvia-mes-total">: ' +
                        d.dias +
                        'mm</span><p/><p class="tooltip-lluvia-mes">Lluvia acumulada en ' +
                        d.fecha +
                        '<span class="tooltip-lluvia-mes-total">: ' +
                        d.precipitacion_anual +
                        'mm</span><p/></div>'
                );
            })
            .on('mouseout', (d) => {
                tooltip.style('opacity', 0);
            })
            .attr('width', width / dataz.length - 1)
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

barVerticalTooltip();
