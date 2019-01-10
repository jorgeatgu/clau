const barStackedVertical = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 48 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.bar-stack');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const colors = d3.scaleOrdinal()
        .range(["#2A7D97","#DB455E"]);

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleBand()
            .domain(dataz.map(d => d.fecha)).paddingInner(0.3);

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.max + 35)]);

        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.bar-stack-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'bar-stack-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.rangeRound([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .ticks(5)
            .tickFormat(d3.format("d"))

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .tickPadding(10)
            .ticks(5)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)

    }

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.bar-stack-container')

        g.attr("transform", translate)

        updateScales(width, height)

        const container = chart.select('.bar-stack-container-bis')

        const keys = dataz.columns.slice(1,3);
        colors.domain(keys)

        const stacked = d3.stack().keys(keys)(dataz);

        const layer = container.selectAll('.serie-vertical')
               .data(stacked)
               .enter()
               .append('g')
               .attr('class', 'serie-vertical')
               .attr("fill", d => colors(d.key) )

       const otherLayer = layer.selectAll('.bar-vertical')
            .data(function(d) { return d; })


        const newLayer = otherLayer.enter()
                .append('rect')
                .attr('class', 'bar-vertical')

        otherLayer.merge(newLayer)

            .attr("x", d => scales.count.x(d.data.fecha) )
            .attr("y", d => scales.count.y(d[1]))
            .attr("height", d => scales.count.y(d[0]) - scales.count.y(d[1]))
            .attr("width", scales.count.x.bandwidth());

        drawAxes(g)

    }

    const resize = () => {
        setupScales()
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/maximas-minimas.csv', type, (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                    dataz = data
                    dataz.forEach(d => {
                        d.min = d.minimas;
                        d.max = d.maximas;
                        d.fecha = d.fecha;
                    });
                    setupElements()
                    setupScales()
                    updateChart(dataz)
                }

        });
    }

    function type(d, i, columns) {
      for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
      d.total = t;
      return d;
    }

    window.addEventListener('resize', resize)

    loadData()

}

barStackedVertical()
