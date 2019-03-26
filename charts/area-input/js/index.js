import wesPalette from"./../../color.js";wesPalette();const areaInput=()=>{const t={top:16,right:16,bottom:24,left:32};let e=0,a=0;const n=d3.select(".chart-lluvia-input"),s=n.select("svg"),c={},i=(t,e)=>{c.count.x.range([0,t]),c.count.y.range([e,0])},o=t=>{const n=d3.axisBottom(c.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform",`translate(0,${a})`).transition().duration(300).ease(d3.easeLinear).call(n);const s=d3.axisLeft(c.count.y).tickPadding(5).tickFormat(t=>t+"ºC").tickSize(-e).ticks(6);t.select(".axis-y").transition().duration(300).ease(d3.easeLinear).call(s)};function r(r){const l=n.node().offsetWidth;e=l-t.left-t.right,a=400-t.top-t.bottom,s.attr("width",l).attr("height",400);const d=`translate(${t.left},${t.top})`,m=s.select(".chart-lluvia-input-container");m.attr("transform",d);const p=d3.area().x(t=>c.count.x(t.fecha)).y0(a).y1(t=>c.count.y(t.max));i(e,a);const u=n.select(".area-input-container").selectAll(".area").data([r]),x=u.enter().append("path").attr("class","area area-bgc7");u.merge(x).transition().duration(600).ease(d3.easeLinear).attr("d",p),o(m)}window.addEventListener("resize",()=>{d3.csv("csv/total-media-limpio.csv",t=>{const e=d3.select("#mes-mensual-minima").select("select").property("value");r(t=t.filter(t=>String(t.mes).match(e)))})}),d3.csv("csv/total-media-limpio.csv",(t,e)=>{t?console.log(t):((e=e.filter(t=>String(t.mes).match(/Enero/))).forEach(t=>t.max=+t.max),(()=>{const t=s.select(".chart-lluvia-input-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","area-input-container")})(),(()=>{const t=d3.scaleTime().domain([1951,2018]),e=d3.scaleLinear().domain([0,20]);c.count={x:t,y:e}})(),r(e))}),d3.csv("csv/total-media-limpio.csv",(t,n)=>{if(t)console.log(t);else{const t=d3.nest().key(t=>t.mes).entries(n),s=d3.select("#mes-mensual-minima");s.append("select").selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),s.on("change",function(){!function(t){d3.csv("csv/total-media-limpio.csv",n=>{(n=n.filter(function(e){return String(e.mes).match(t)})).forEach(t=>t.max=+t.max),c.count.x.range([0,e]),c.count.y.range([a,0]);const s=d3.scaleTime().domain([1951,2018]),i=d3.scaleLinear().domain([d3.min(n,t=>t.max-5),d3.max(n,t=>t.max+5)]);c.count={x:s,y:i},r(n)})}(d3.select(this).select("select").property("value"))})}})};areaInput();