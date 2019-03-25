const multipleLines=()=>{const t=24,e=24,a=24,s=24;let c=0,n=0,o=0,l=0;const i=d3.select(".chart-multiple-lines"),r=i.selectAll("svg"),d={},m=d3.scaleOrdinal(["#c4cdf6","#0a60a8","#b28bef","#5c2f8e"]);let x,f=d3.timeParse("%x");const h=x=>{o=i.node().offsetWidth,c=o-s-e,n=(l=600)-t-a,r.attr("width",o).attr("height",l);const f="translate("+s+","+t+")",h=r.select(".chart-multiple-lines-container");h.attr("transform",f);const p=d3.nest().key(t=>t.presentada).entries(x),u=d3.area().x(t=>d.count.x(t.fecha)).y0(n).y1(t=>d.count.y(t.votos)).curve(d3.curveBasis);((t,e)=>{d.count.x.range([0,t]),d.count.y.range([e,0])})(c,n);const v=i.select(".chart-multiple-lines-container-dos");v.selectAll(".area").remove().exit().data(p),p.forEach(t=>{v.append("path").attr("class","area "+t.key).style("fill",()=>t.color=m(t.key)).style("opacity",.85).attr("d",u(t.values))}),(t=>{const e=d3.axisBottom(d.count.x).tickFormat(d3.timeFormat("%Y")).ticks(5);t.select(".axis-x").attr("transform","translate(0,"+n+")").call(e);const a=d3.axisLeft(d.count.y).tickFormat(d3.format("d")).tickSizeInner(-c).ticks(5);t.select(".axis-y").call(a)})(h)};window.addEventListener("resize",()=>{h(x)}),d3.csv("csv/legislatura-cha-votos-a-favor.csv",(t,e)=>{t?console.log(t):((x=e).forEach(t=>{t.votos=+t.votos,t.fecha=f(t.fecha)}),(()=>{const t=r.select(".chart-multiple-lines-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-multiple-lines-container-dos")})(),(()=>{const t=d3.scaleTime().domain([d3.min(x,t=>t.fecha),d3.max(x,t=>t.fecha)]),e=d3.scaleLinear().domain([d3.min(x,t=>t.votos),d3.max(x,t=>t.votos)]);d.count={x:t,y:e}})(),h(x))})};multipleLines();