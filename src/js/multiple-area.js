function barVertical() {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-multiple-lines');
    const scales = {};
    let dataz;
    const colors = ["#9a1622", "#e30613", "#0080b8", "#f07a36"]
    const color = d3.scaleOrdinal(colors);
    const parseDate = d3.timeParse("%x");

    //Escala para los ejes X e Y
    function setupScales() {

        const countX = d3.scaleTime()
            .domain([d3.min(dataz, d => d.fecha),d3.max(dataz, d => d.fecha)]);

        const countY = d3.scaleLinear()
            .domain([d3.min(dataz, d => d.votos),d3.max(dataz, d => d.votos)]);

        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    // function setupElements() {

    //     chart.append('g').attr('.chart-lluvia-bar-vertical-container');

    //     const g = svg.append('g')


    //     g.append('g').attr('class', 'axis axis-x');

    //     g.append('g').attr('class', 'axis axis-y');

    //     g.append('g').attr('class', 'area-container-chart-vertical');

    // }

    //Actualizando escalas
    function updateScales(width, height){
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    function drawAxes(g) {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(5);

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-w)

        g.select(".axis-y")
            .call(axisY)

    }

    function updateChart(dataz) {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        const symbols = d3.nest()
            .key(function(d) { return d.presentada; })
            .entries(dataz);

            console.log(symbols)

        symbols.forEach(function(s) {
            s.maxPrice = d3.max(s.values, function(d) { return d.votos; });
        });

        chart
            .selectAll("svg")
            .data(symbols)
            .enter()
            .append("svg")
            .attr('width', w)
            .attr('height', h)
            .append('g').attr('class', 'area-container-chart-vertical')
            .append('g').attr('class', 'axis axis-x');

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = chart.select('.chart-lluvia-bar-vertical-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d => scales.count.x(d.fecha))
            .y0(height)
            .y1(d => scales.count.y(d.votos))
            .curve(d3.curveCardinal.tension(0.6));

        updateScales(width, height)

        const container = chart.select('.area-container-chart-vertical')

        const layer = container.selectAll('.area')
               .data([dataz])

        const newLayer = layer.enter()
                .append('path')
                .attr('class', 'area')
                .attr('class', d => d.key)

        layer.merge(newLayer)
            .attr("d", d => area(d.values));

    }

    function resize() {
        updateChart(dataz)
    }

    // LOAD THE DATA
    function loadData() {

        d3.csv('csv/legislatura-psoe-votos-a-favor.csv', function(error, data) {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach( d => {
                          d.votos = +d.votos;
                          d.fecha = parseDate(d.fecha);
                      });
                      // setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

barVertical()



