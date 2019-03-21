function directionalDot(){const t=16,e=16,a=32,r=48;let i=0,n=0;const c=d3.select(".chart-diff-records"),s=c.select("svg"),o={};let d;const l=d=>{const l=c.node().offsetWidth;i=l-r-e,n=600-t-a,s.attr("width",l).attr("height",600);const f=`translate(${r},${t})`,m=s.select(".chart-diff-records-container");m.attr("transform",f),((t,e)=>{o.count.x.range([15,t]),o.count.y.range([e,0])})(i,n);const u=c.select(".chart-diff-records-container-bis"),x=u.selectAll(".circle-primero").data(d);x.exit().remove();const g=u.selectAll(".circle-segundo").data(d);g.exit().remove();const p=u.selectAll(".circle-lines").data(d);p.exit().remove();const h=x.enter().append("circle").attr("class","circle-primero"),y=g.enter().append("circle").attr("class","circle-segundo"),k=p.enter().append("line").attr("class","circle-lines");p.merge(k).transition().duration(500).ease(d3.easeLinear).attr("x1",t=>o.count.x(t.dia)).attr("y1",t=>o.count.y(t.primero)+6).attr("x2",t=>o.count.x(t.dia)).attr("y2",t=>o.count.y(t.segundo)-6).attr("stroke",t=>0===t.diff?"none":"#111"),x.merge(h).transition().duration(500).ease(d3.easeLinear).attr("r",t=>0===t.diff?0:6).attr("cy",t=>o.count.y(t.primero)).attr("cx",t=>o.count.x(t.dia)).attr("fill","#63a3b2"),g.merge(y).transition().duration(500).ease(d3.easeLinear).attr("r",t=>0===t.diff?0:6).attr("cy",t=>o.count.y(t.segundo)).attr("cx",t=>o.count.x(t.dia)).attr("fill","#0583a0"),(t=>{const e=d3.axisBottom(o.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(31);t.select(".axis-x").attr("transform",`translate(0,${n})`).transition().duration(500).ease(d3.easeLinear).call(e);const a=d3.axisLeft(o.count.y).tickPadding(5).tickFormat(t=>t+"ºC").ticks(15).tickSizeInner(-i);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(a)})(m)};window.addEventListener("resize",()=>{l(d)}),d3.csv("csv/Albacete-dos-records.csv",(t,e)=>{t?console.log(t):((d=e.filter(t=>String(t.mes).match("Enero"))).forEach(t=>{t.fecha=+t.fecha,t.primero=+t.primero,t.segundo=+t.segundo,t.diff=t.primero-t.segundo,t.dia=+t.dia}),(()=>{const t=s.select(".chart-diff-records-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-diff-records-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(d,t=>t.dia),d3.max(d,t=>t.dia)]),e=d3.scaleLinear().domain([d3.min(d,t=>t.segundo-1),d3.max(d,t=>t.primero+1)]);o.count={x:t,y:e}})(),l(d))})}directionalDot();