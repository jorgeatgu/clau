const areaStack = () => {

    const margin = { top: 24, right: 24, bottom: 24, left: 48 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.area-stack');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain(d3.extent(dataz, d => d.year ))

        const countY = d3.scaleLinear()
            .domain([0, 2000]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.area-stack-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-stack-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(5)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .tickSizeInner(-width)
            .ticks(5)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.area-stack-container')

        g.attr("transform", translate)

        const keys = dataz.columns.slice(1)

        const area = d3.area()
            .x((d, i) => scales.count.x(d.data.year))
            .y0(d => scales.count.y(d[0]))
            .y1(d => scales.count.y(d[1]))
            .curve(d3.curveCardinal.tension(0.6));

        const stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderInsideOut)

        const stackedData = stack(dataz);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#375b8b", "#3295e9", "#625ad0", "#bfd6fa", "#49cbca"])


        updateScales(width, height)

        const container = chart.select('.area-stack-container-bis')

        const layer = container.selectAll('.area')
            .data(stackedData)

        const newLayer = layer.enter()
            .append('path')
            .attr('class', 'area')

        layer.merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .style("fill", d => color(d.key) )
            .attr('d', area)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/accidentes.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach(d => {
                    d.year = d.year;
                });
                setupElements()
                setupScales()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

areaStack()
