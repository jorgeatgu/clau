var margin = {top:50, right:50, bottom:0, left:50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var histHeight = height / 5;

var parseDate = d3.timeParse("%d/%m/%Y");
var formatDateIntoYear = d3.timeFormat("%Y");

var startDate = new Date("1951, 01, 01"),
    endDate = new Date("2019, 01, 01");

// x scale for time
var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

// y scale for histogram
var y = d3.scaleLinear()
    .range([histHeight, 0]);


////////// histogram set up //////////

// set parameters for histogram
var histogram = d3.histogram()
    .value(function(d) { return d.date; })
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeYear));

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var hist = svg.append("g")
    .attr("class", "histogram")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


////////// plot set up //////////

var dataset;

var plot = svg.append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


////////// load data //////////

d3.csv("csv/histogram.csv", prepare, function(data) {

  // group data for bars
  var bins = histogram(data);

  // y domain based on binned data
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);

  var bar = hist.selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      });

  bar.append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
      .attr("height", function(d) { return histHeight - y(d.length); })
      .attr("fill", function(d) { return "#f97d5a" });

  dataset = data;
  drawPlot(dataset);

})


////////// slider //////////

var currentValue = 0;

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+histHeight+5) + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          update(x.invert(currentValue));
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);


function drawPlot(data) {
  var locations = plot.selectAll(".location")
    .data(data);

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", 100)
    .style("fill", function(d) { return "#f97d5a" })
    .style("opacity", 0.65)
    .attr("r", 5)
    .transition()
    .duration(400)
    .attr("cy", function(d) { return Math.random()*((height/2+50)-(height/2-50))+(height/2-50); })

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}

function update(h) {
  handle.attr("cx", x(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function(d) {
    return d.date < h;
  })
  drawPlot(newData);

  // histogram bar colours
}

function prepare(d) {
  d.date = parseDate(d.date);
  d.value = +d.value;
  return d;
}
