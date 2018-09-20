function areaTooltip() {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-tooltip');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const bisectDate = d3.bisector(d => d.fecha).left;

    //Escala para los ejes X e Y
    function setupScales() {

        const countX = d3.scaleTime()
            .domain([1951, 2017]);

        const countY = d3.scaleLinear()
            .domain([0, 60]);

        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    function setupElements() {

        const g = svg.select('.chart-lluvia-tooltip-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-container');

        g.append('rect').attr('class', 'overlay');

        g.append('g').attr('class', 'focus').style("display", "none");

    }

    //Actualizando escalas
    function updateScales(width, height){
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    function drawAxes(g) {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(13)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)

        const focus = g.select('.focus');

        const overlay = g.select('.overlay');

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("class", "circle-focus")
            .attr("r", 8);

        focus.append("text")
            .attr("class", "text-focus")
            .attr("x", -10)
            .attr("y", -20)
            .attr("dy", ".31em");

        overlay.attr("width", width + margin.left + margin.right )
            .attr("height", height )
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            const x0 = scales.count.x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataz, x0, 1),
                d0 = dataz[i - 1],
                d1 = dataz[i],
                d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + scales.count.x(d.fecha) + "," + scales.count.y(d.dias_lluvia) + ")");
            focus.select("text").text(d.dias_lluvia);
            focus.select('.x-hover-line').attr("y2", height - scales.count.y(d.dias_lluvia));
            focus.select('.y-hover-line').attr('x1', 0 - scales.count.x(d.fecha));
        }

    }

    function updateChart(datazz) {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-lluvia-tooltip-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d =>  scales.count.x(d.fecha))
            .y0(height)
            .y1(d =>  scales.count.y(d.dias))
            .curve(d3.curveCardinal.tension(0.6));

        updateScales(width, height)

        const container = chart.select('.area-container')


        const layer = container.selectAll('.area')
               .data([dataz])

        const newLayer = layer.enter()
                .append('path')
                .attr('class', 'area')

        layer.merge(newLayer)
            .attr('d', area)

        drawAxes(g)

    }

    function resize() {
        updateChart(dataz)
    }

    // LOAD THE DATA
    function loadData() {

        d3.csv('csv/dias-de-lluvia.csv', function(error, data) {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.fecha = d.fecha;
                          d.dias_lluvia = d.dias;
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

areaTooltip()
