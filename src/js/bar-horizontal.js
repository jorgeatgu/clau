const barHorizontal = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 64 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-bar-horizontal');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleLinear()
            .domain(
                [0,
                d3.max(dataz, d => d.dias)]
        );

        const countY = d3.scaleBand()
            .domain(dataz.map( d => d.fecha))
            .paddingInner(0.1)
            .paddingOuter(0.5);


        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-lluvia-bar-horizontal-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container-chart-horizontal');

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
            .tickSize(-height)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height  + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .ticks(1)
            .tickFormat(d3.format("d"))

        g.select(".axis-y")
            .call(axisY)

    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        h = dataz.length * 20;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-lluvia-bar-horizontal-container')

        g.attr("transform", translate)

        updateScales(width, height)

        const container = chart.select('.area-container-chart-horizontal')


        const layer = container.selectAll('.bar-horizontal')
               .data(dataz)

        const newLayer = layer.enter()
                .append('rect')
                .attr('class', 'bar-horizontal')


        layer.merge(newLayer)
            .attr("x", 0)
            .attr("y", d => scales.count.y(d.fecha))
            .attr("height", height / dataz.length - 2)
            .attr("width", d => scales.count.x(d.dias));

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/dias-de-lluvia.csv', (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.fecha = d.fecha;
                          d.dias_lluvia = d.dias;
                      });

                      dataz.sort((a, b) => a.dias_lluvia - b.dias_lluvia);
                      setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

barHorizontal()
