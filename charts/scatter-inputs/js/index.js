import wesPalette from"./../../../../src/js/color.js";wesPalette();const scatterInput=()=>{const t=48,a=16,e=24,n=32;let c=0,i=0;const s=d3.select(".scatter-inputs"),r=s.select("svg"),o={};let m;const l=t=>t.split("-")[2],d=(t,a)=>{o.count.x.range([10,t]),o.count.y.range([a,-10])},u=t=>{const a=d3.axisBottom(o.count.x).tickPadding(10).tickFormat(d3.format("d")).tickSize(-i).ticks(20);t.select(".axis-x").attr("transform","translate(0,"+i+")").transition().duration(600).ease(d3.easeLinear).call(a);const e=d3.axisLeft(o.count.y).tickFormat(t=>t+"ºC").tickSize(-c).ticks(6);t.select(".axis-y").transition().duration(600).ease(d3.easeLinear).call(e)},p=m=>{const l=s.node().offsetWidth;c=l-n-a,i=500-t-e,r.attr("width",l).attr("height",500);const p="translate("+n+","+t+")",x=r.select(".scatter-inputs-container");x.attr("transform",p),d(c,i);const y=s.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").data(m),f=y.enter().append("circle").attr("class","scatter-inputs-circles");y.merge(f).transition().duration(600).ease(d3.easeLinear).attr("cx",t=>o.count.x(t.year)).attr("cy",t=>o.count.y(t.minima)).attr("r",6).style("fill","#257d98").attr("fill-opacity",.5),u(x)};d3.select("#update").on("click",t=>{x()}),d3.select("#updateMin").on("click",t=>{y()});const x=()=>{let a=d3.select("#updateButtonDay").property("value"),e=d3.select("#updateButtonMonth").property("value");a<10&&(a=("0"+a).slice(-2)),e<10&&(e=("0"+e).slice(-2));let m=new RegExp("^.*"+(a+"-"+e)+".*","gi");d3.csv("csv/temperaturas.csv",a=>{(a=a.filter(t=>String(t.fecha).match(m))).forEach(t=>{t.maxima=+t.maxima,t.minima=+t.minima,t.year=l(t.fecha)}),o.count.x.range([10,c]),o.count.y.range([i,-10]);const e=d3.scaleTime().domain([d3.min(a,t=>t.year),d3.max(a,t=>t.year)]),p=d3.scaleLinear().domain([d3.min(a,t=>t.maxima),d3.max(a,t=>t.maxima)]);o.count={x:e,y:p};const x="translate("+n+","+t+")",y=r.select(".scatter-inputs-container");y.attr("transform",x),d(c,i);const f=s.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").data(a),g=f.enter().append("circle").attr("class","scatter-inputs-circles");f.merge(g).transition().duration(600).ease(d3.easeLinear).attr("cx",t=>o.count.x(t.year)).attr("cy",t=>o.count.y(t.maxima)).attr("r",6).style("fill","#dc7176").attr("fill-opacity",.5),u(y)})},y=()=>{let t=d3.select("#updateButtonDay").property("value"),a=d3.select("#updateButtonMonth").property("value");t<10&&(t=("0"+t).slice(-2)),a<10&&(a=("0"+a).slice(-2));let e=new RegExp("^.*"+(t+"-"+a)+".*","gi");d3.csv("csv/temperaturas.csv",t=>{(t=t.filter(t=>String(t.fecha).match(e))).forEach(t=>{t.maxima=+t.maxima,t.minima=+t.minima,t.year=l(t.fecha)}),o.count.x.range([10,c]),o.count.y.range([i,-10]);const a=d3.scaleTime().domain([d3.min(t,t=>t.year),d3.max(t,t=>t.year)]),n=d3.scaleLinear().domain([d3.min(t,t=>t.minima),d3.max(t,t=>t.minima)]);o.count={x:a,y:n},p(t)})};window.addEventListener("resize",()=>{let t=d3.select("#updateButtonDay").property("value")+"-"+d3.select("#updateButtonMonth").property("value");d3.csv("csv/temperaturas.csv",a=>{(a=a.filter(a=>String(a.fecha).match(t))).forEach(t=>{t.maxima=+t.maxima,t.minima=+t.minima,t.year=l(t.fecha)}),o.count.x.range([10,c]),o.count.y.range([i,-10]);const e=d3.scaleTime().domain([d3.min(a,t=>t.year),d3.max(a,t=>t.year)]),n=d3.scaleLinear().domain([d3.min(a,t=>t.minima),d3.max(a,t=>t.minima)]);o.count={x:e,y:n},p(a)})}),d3.csv("csv/temperaturas.csv",(t,a)=>{t?console.log(t):(m=a,(m=a.filter(t=>String(t.fecha).match(/02-01/))).forEach(t=>{t.maxima=+t.maxima,t.minima=+t.minima,t.year=l(t.fecha)}),(()=>{const t=r.select(".scatter-inputs-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","scatter-inputs-container-dos")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(m,t=>t.year),d3.max(m,t=>t.year)]),a=d3.scaleLinear().domain([d3.min(m,t=>t.minima),d3.max(m,t=>t.minima)]);o.count={x:t,y:a}})(),p(m))})};scatterInput();