function directionalDot() {
    const margin = {
        top: 16,
        right: 16,
        bottom: 32,
        left: 48
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-diff-records');
    const svg = chart.select('svg');
    const scales = {};
    const temp = 'ºC';
    let dataz;
    const setupScales = () => {
        const countX = d3
            .scaleTime()
            .domain([d3.min(dataz, (d) => d.dia), d3.max(dataz, (d) => d.dia)]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.segundo - 1),
                d3.max(dataz, (d) => d.primero + 1)
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-diff-records-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-diff-records-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([15, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format('d'))
            .ticks(31);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat((d) => d + temp)
            .ticks(15)
            .tickSizeInner(-width);

        g.select('.axis-y')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-diff-records-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-diff-records-container-bis');

        const layer = container.selectAll('.circle-primero').data(dataz);

        layer.exit().remove();

        const layerDos = container.selectAll('.circle-segundo').data(dataz);

        layerDos.exit().remove();

        const layerLine = container.selectAll('.circle-lines').data(dataz);

        layerLine.exit().remove();

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-primero');

        const newLayerDos = layerDos
            .enter()
            .append('circle')
            .attr('class', 'circle-segundo');

        const newLayerLines = layerLine
            .enter()
            .append('line')
            .attr('class', 'circle-lines');

        layerLine
            .merge(newLayerLines)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('x1', (d) => scales.count.x(d.dia))
            .attr('y1', (d) => scales.count.y(d.primero) + 6)
            .attr('x2', (d) => scales.count.x(d.dia))
            .attr('y2', (d) => scales.count.y(d.segundo) - 6)
            .attr('stroke', (d) => {
                if (d.diff === 0) {
                    return 'none';
                }
                return '#111';
            });

        layer
            .merge(newLayer)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', (d) => {
                if (d.diff === 0) {
                    return 0;
                }
                return 6;
            })
            .attr('cy', (d) => scales.count.y(d.primero))
            .attr('cx', (d) => scales.count.x(d.dia))
            .attr('fill', '#63a3b2');

        layerDos
            .merge(newLayerDos)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', (d) => {
                if (d.diff === 0) {
                    return 0;
                }
                return 6;
            })
            .attr('cy', (d) => scales.count.y(d.segundo))
            .attr('cx', (d) => scales.count.x(d.dia))
            .attr('fill', '#0583a0');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        const mes = 'Enero';
        d3.csv('csv/Albacete-dos-records.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data.filter((d) => String(d.mes).match(mes));
                dataz.forEach((d) => {
                    d.fecha = +d.fecha;
                    d.primero = +d.primero;
                    d.segundo = +d.segundo;
                    d.diff = d.primero - d.segundo;
                    d.dia = +d.dia;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
}

directionalDot();
