const area = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    const setupScales = () => {
        const countX = d3.scaleTime().domain([1951, 2017]);

        const countY = d3.scaleLinear().domain([0, 60]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container');
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
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.container');

        g.attr('transform', translate);

        const area = d3
            .area()
            .x((d) => scales.count.x(d.fecha))
            .y0(height)
            .y1((d) => scales.count.y(d.dias))
            .curve(d3.curveCardinal.tension(0.6));
        updateScales(width, height);

        const container = chart.select('.area-container');

        const layer = container.selectAll('.area').data([dataz]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area);

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

area();
