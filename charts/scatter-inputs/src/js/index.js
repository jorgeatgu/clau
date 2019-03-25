const scatterInput = () => {
    const margin = { top: 48, right: 16, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.scatter-inputs');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const temp = 'ºC';

    const getYear = (stringDate) => stringDate.split('-')[2];

    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.year),
                d3.max(dataz, (d) => d.year)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.minima),
                d3.max(dataz, (d) => d.minima)
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.scatter-inputs-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-inputs-container-dos');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([10, width]);
        scales.count.y.range([height, -10]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(10)
            .tickFormat(d3.format('d'))
            .tickSize(-height)
            .ticks(20);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + temp)
            .tickSize(-width)
            .ticks(6);

        g.select('.axis-y')
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 500;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.scatter-inputs-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-inputs-container-dos');

        const layer = container
            .selectAll('.scatter-inputs-circles')
            .data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'scatter-inputs-circles');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('cx', (d) => scales.count.x(d.year))
            .attr('cy', (d) => scales.count.y(d.minima))
            .attr('r', 6)
            .style('fill', '#257d98')
            .attr('fill-opacity', 0.5);

        drawAxes(g);
    };

    d3.select('#update').on('click', (dataz) => {
        updateMax();
    });

    d3.select('#updateMin').on('click', (dataz) => {
        updateMin();
    });

    const updateMax = () => {
        let valueDateDay = d3.select('#updateButtonDay').property('value');
        let valueDateMonth = d3.select('#updateButtonMonth').property('value');
        if (valueDateDay < 10) valueDateDay = ('0' + valueDateDay).slice(-2);
        if (valueDateMonth < 10) {
            valueDateMonth = ('0' + valueDateMonth).slice(-2);
        }
        let valueDate = valueDateDay + '-' + valueDateMonth;
        let reValueDate = new RegExp('^.*' + valueDate + '.*', 'gi');

        d3.csv('csv/temperaturas.csv', (dataz) => {
            dataz = dataz.filter((d) => String(d.fecha).match(reValueDate));

            dataz.forEach((d) => {
                d.maxima = +d.maxima;
                d.minima = +d.minima;
                d.year = getYear(d.fecha);
            });

            scales.count.x.range([10, width]);
            scales.count.y.range([height, -10]);

            const countX = d3
                .scaleTime()
                .domain([
                    d3.min(dataz, (d) => d.year),
                    d3.max(dataz, (d) => d.year)
                ]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(dataz, (d) => d.maxima),
                    d3.max(dataz, (d) => d.maxima)
                ]);

            scales.count = { x: countX, y: countY };

            const translate =
                'translate(' + margin.left + ',' + margin.top + ')';

            const g = svg.select('.scatter-inputs-container');

            g.attr('transform', translate);

            updateScales(width, height);

            const container = chart.select('.scatter-inputs-container-dos');

            const layer = container
                .selectAll('.scatter-inputs-circles')
                .data(dataz);

            const newLayer = layer
                .enter()
                .append('circle')
                .attr('class', 'scatter-inputs-circles');

            layer
                .merge(newLayer)
                .transition()
                .duration(600)
                .ease(d3.easeLinear)
                .attr('cx', (d) => scales.count.x(d.year))
                .attr('cy', (d) => scales.count.y(d.maxima))
                .attr('r', 6)
                .style('fill', '#dc7176')
                .attr('fill-opacity', 0.5);

            drawAxes(g);
        });
    };

    const updateMin = () => {
        let valueDateDay = d3.select('#updateButtonDay').property('value');
        let valueDateMonth = d3.select('#updateButtonMonth').property('value');
        if (valueDateDay < 10) valueDateDay = ('0' + valueDateDay).slice(-2);
        if (valueDateMonth < 10) {
            valueDateMonth = ('0' + valueDateMonth).slice(-2);
        }
        let valueDate = valueDateDay + '-' + valueDateMonth;
        let reValueDate = new RegExp('^.*' + valueDate + '.*', 'gi');

        d3.csv('csv/temperaturas.csv', (dataz) => {
            dataz = dataz.filter((d) => String(d.fecha).match(reValueDate));

            dataz.forEach((d) => {
                d.maxima = +d.maxima;
                d.minima = +d.minima;
                d.year = getYear(d.fecha);
            });

            scales.count.x.range([10, width]);
            scales.count.y.range([height, -10]);

            const countX = d3
                .scaleTime()
                .domain([
                    d3.min(dataz, (d) => d.year),
                    d3.max(dataz, (d) => d.year)
                ]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(dataz, (d) => d.minima),
                    d3.max(dataz, (d) => d.minima)
                ]);

            scales.count = { x: countX, y: countY };

            updateChart(dataz);
        });
    };

    const resize = () => {
        let valueDateDay = d3.select('#updateButtonDay').property('value');
        let valueDateMonth = d3.select('#updateButtonMonth').property('value');

        let valueDateResize = valueDateDay + '-' + valueDateMonth;

        d3.csv('csv/temperaturas.csv', (dataz) => {
            dataz = dataz.filter((d) => String(d.fecha).match(valueDateResize));

            dataz.forEach((d) => {
                d.maxima = +d.maxima;
                d.minima = +d.minima;
                d.year = getYear(d.fecha);
            });

            scales.count.x.range([10, width]);
            scales.count.y.range([height, -10]);

            const countX = d3
                .scaleTime()
                .domain([
                    d3.min(dataz, (d) => d.year),
                    d3.max(dataz, (d) => d.year)
                ]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(dataz, (d) => d.minima),
                    d3.max(dataz, (d) => d.minima)
                ]);

            scales.count = { x: countX, y: countY };

            updateChart(dataz);
        });
    };

    const loadData = () => {
        d3.csv('csv/temperaturas.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;

                dataz = data.filter((d) => String(d.fecha).match(/02-01/));

                dataz.forEach((d) => {
                    d.maxima = +d.maxima;
                    d.minima = +d.minima;
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

scatterInput();
