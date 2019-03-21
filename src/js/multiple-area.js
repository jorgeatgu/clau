const multipleLines = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-multiple-lines');
    const svg = chart.selectAll('svg');
    const scales = {};
    const colors = ['#c4cdf6', '#0a60a8', '#b28bef', '#5c2f8e'];
    const color = d3.scaleOrdinal(colors);
    let parseDate = d3.timeParse('%x');
    let dataz;

    const setupScales = () => {
        const countX = d3
            .scaleTime()
            .domain([
                d3.min(dataz, (d) => d.fecha),
                d3.max(dataz, (d) => d.fecha),
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.votos),
                d3.max(dataz, (d) => d.votos),
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-multiple-lines-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-multiple-lines-container-dos');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.timeFormat('%Y'))
            .ticks(5);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .tickSizeInner(-width)
            .ticks(5);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.chart-multiple-lines-container');

        g.attr('transform', translate);

        const nestData = d3
            .nest()
            .key((d) => d.presentada)
            .entries(dataz);

        const area = d3
            .area()
            .x((d) => scales.count.x(d.fecha))
            .y0(height)
            .y1((d) => scales.count.y(d.votos))
            .curve(d3.curveBasis);

        updateScales(width, height);

        const container = chart.select('.chart-multiple-lines-container-dos');

        container
            .selectAll('.area')
            .remove()
            .exit()
            .data(nestData);

        nestData.forEach((d) => {
            container
                .append('path')
                .attr('class', 'area ' + d.key)
                .style('fill', () => (d.color = color(d.key)))
                .style('opacity', 0.85)
                .attr('d', area(d.values));
        });

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/legislatura-cha-votos-a-favor.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;

                dataz.forEach((d) => {
                    d.votos = +d.votos;
                    d.fecha = parseDate(d.fecha);
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

multipleLines();
