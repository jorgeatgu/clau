const areaInput = () => {
    const margin = {
        top: 16,
        right: 16,
        bottom: 24,
        left: 32
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-input');
    const svg = chart.select('svg');
    const scales = {};
    const temp = 'ºC';

    const setupScales = () => {
        const countX = d3.scaleTime().domain([1951, 2018]);

        const countY = d3.scaleLinear().domain([0, 20]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-lluvia-input-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-input-container');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format('d'))
            .ticks(13);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat((d) => d + temp)
            .tickSize(-width)
            .ticks(6);

        g.select('.axis-y')
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    function updateChart(data) {
        const w = chart.node().offsetWidth;
        const h = 400;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-lluvia-input-container');

        g.attr('transform', translate);

        const area = d3
            .area()
            .x((d) => scales.count.x(d.fecha))
            .y0(height)
            .y1((d) => scales.count.y(d.max));

        updateScales(width, height);

        const container = chart.select('.area-input-container');

        const layer = container.selectAll('.area').data([data]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area area-bgc7');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area);

        drawAxes(g);
    }

    function update(mes) {
        d3.csv('csv/total-media-limpio.csv', (data) => {
            data = data.filter(function(d) {
                return String(d.mes).match(mes);
            });

            data.forEach((d) => (d.max = +d.max));

            scales.count.x.range([0, width]);
            scales.count.y.range([height, 0]);

            const countX = d3.scaleTime().domain([1951, 2018]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d) => d.max - 5),
                    d3.max(data, (d) => d.max + 5)
                ]);

            scales.count = { x: countX, y: countY };
            updateChart(data);
        });
    }

    const resize = () => {
        d3.csv('csv/total-media-limpio.csv', (data) => {
            const mesActual = d3
                .select('#mes-mensual-minima')
                .select('select')
                .property('value');

            data = data.filter((d) => String(d.mes).match(mesActual));
            updateChart(data);
        });
    };

    const menuMes = () => {
        d3.csv('csv/total-media-limpio.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const nest = d3
                    .nest()
                    .key((d) => d.mes)
                    .entries(data);

                const mesMenuMensualMinima = d3.select('#mes-mensual-minima');

                mesMenuMensualMinima
                    .append('select')
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

                mesMenuMensualMinima.on('change', function() {
                    const mes = d3
                        .select(this)
                        .select('select')
                        .property('value');
                    update(mes);
                });
            }
        });
    };

    const loadData = () => {
        d3.csv('csv/total-media-limpio.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                data = data.filter((d) => String(d.mes).match(/Enero/));

                data.forEach((d) => {
                    d.max = +d.max;
                });
                setupElements();
                setupScales();
                updateChart(data);
            }
        });
    };

    window.addEventListener('resize', resize);
    loadData();
    menuMes();
};

areaInput();
