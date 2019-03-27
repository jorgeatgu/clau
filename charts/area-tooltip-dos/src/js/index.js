import wesPalette from './../../../../src/js/color.js';

wesPalette();

const areaTooltipDue = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-tooltip-dos');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const bisectDate = d3.bisector((d) => d.fecha).left;
    const tooltipDates = chart
        .append('div')
        .attr('class', 'tooltip tooltip-lluvias')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3
            .scaleTime()
            .domain([
                d3.min(dataz, (d) => d.fecha),
                d3.max(dataz, (d) => d.fecha)
            ]);

        const countY = d3.scaleLinear().domain([0, 60]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-lluvia-tooltip-dos-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-dos');

        g.append('rect').attr('class', 'overlay');

        g.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', 0);

        g.select('.focus')
            .append('text')
            .attr('class', 'text-focus');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(13);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .ticks(5)
            .tickSizeInner(-width);

        g.select('.axis-y').call(axisY);

        const focus = g.select('.focus');

        const overlay = g.select('.overlay');

        const focusText = g.select('text-focus');

        focus.select('.x-hover-line').attr('y2', height);

        focusText
            .attr('x', -10)
            .attr('y', -20)
            .attr('dy', '.31em');

        overlay
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
                tooltipDates.style('opacity', 0);
            })
            .on('mousemove', mousemove);

        function mousemove() {
            const w = chart.node().offsetWidth;
            var x0 = scales.count.x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataz, x0, 1),
                d0 = dataz[i - 1],
                d1 = dataz[i],
                d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
            const positionX = scales.count.x(d.fecha) + 25;
            const postionWidthTooltip = positionX + 300;
            const positionRightTooltip = w - positionX;

            tooltipDates
                .style('opacity', 1)
                .html(
                    '<p class="tooltipYear"><span class="textYear">' +
                        d.fecha +
                        '</span>En <span>' +
                        d.dias +
                        '</span> días de lluvia se recogieron <span>' +
                        d.precipitacion_anual +
                        '</span> milímetros de agua.<p/>'
                )
                .style(
                    'left',
                    postionWidthTooltip > w ? 'auto' : positionX + 'px'
                )
                .style(
                    'right',
                    postionWidthTooltip > w
                        ? positionRightTooltip + 'px'
                        : 'auto'
                );

            focus
                .select('.x-hover-line')
                .attr(
                    'transform',
                    'translate(' + scales.count.x(d.fecha) + ',' + 0 + ')'
                );
        }
    };

    function updateChart(datazz) {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.chart-lluvia-tooltip-dos-container');

        g.attr('transform', translate);

        const area = d3
            .area()
            .x((d) => scales.count.x(d.fecha))
            .y0(height)
            .y1((d) => scales.count.y(d.dias))
            .curve(d3.curveCardinal.tension(0.6));

        updateScales(width, height);

        const container = chart.select('.area-container-dos');

        const layer = container.selectAll('.area').data([dataz]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area area-bgc2');

        layer.merge(newLayer).attr('d', area);

        drawAxes(g);
    }

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
                    d.fecha = d.fecha;
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

areaTooltipDue();
