const multipleLine = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.multiline-lluvia');
    const svg = chart.select('svg');
    const scales = {};
    let data;
    let dataComb;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([2008, 2017]);

        const countY = d3.scaleLinear()
            .domain([0, 650]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.multiline-lluvia-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'multiline-lluvia-container-dos');

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

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (data) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.multiline-lluvia-container')

        g.attr("transform", translate)


        updateScales(width, height)

        const dataComb = d3.nest()
            .key(d => d.puesto)
            .entries(data);


        const container = chart.select('.multiline-lluvia-container-dos')

        const colors = ["#b114c0", "#9C1B12", "#759CA7", "#CEBAC6", "#2D3065"]

        const color = d3.scaleOrdinal(colors);

        const line = d3.line()
            .x(d => scales.count.x(d.fecha))
            .y(d => scales.count.y(d.cantidad));

        lines = container.selectAll('.line').remove().exit().data(dataComb)

        dataComb.forEach(d => {

            container.append("path")
                .attr("class", "line " + d.key)
                .style("stroke", () => d.color = color(d.key))
                .attr("d", line(d.values));
        });

        drawAxes(g)

    }

    const resize = () => {

        d3.csv('csv/data-line-puestos.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                updateChart(data)
            }

        });
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/data-line-puestos.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                data.forEach(d => {
                    d.fecha = d.fecha;
                    d.cantidad = +d.cantidad;
                });

                setupElements()
                setupScales()
                updateChart(data)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

multipleLine();
