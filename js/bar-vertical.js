const barVertical=()=>{const t=24,a=24,e=24,c=24;let r=0,s=0,n=0,i=0;const l=d3.select(".chart-lluvia-bar-vertical"),o=l.select("svg"),d={};let h;const v=h=>{n=l.node().offsetWidth,r=n-c-a,s=(i=600)-t-e,o.attr("width",n).attr("height",i);const v="translate("+c+","+t+")",x=o.select(".chart-lluvia-bar-vertical-container");x.attr("transform",v),((t,a)=>{d.count.x.range([0,t]),d.count.y.range([a,0])})(r,s);const u=l.select(".area-container-chart-vertical").selectAll(".bar-vertical").data(h),g=u.enter().append("rect").attr("class","bar-vertical bar-bgc3");u.merge(g).attr("width",r/h.length-1).attr("x",t=>d.count.x(t.fecha)).attr("y",t=>d.count.y(t.dias)).attr("height",t=>s-d.count.y(t.dias)),(t=>{const a=d3.axisBottom(d.count.x).tickFormat(d3.format("d"));t.select(".axis-x").attr("transform","translate(0,"+s+")").call(a);const e=d3.axisLeft(d.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-n);t.select(".axis-y").call(e)})(x)};window.addEventListener("resize",()=>{v(h)}),d3.csv("csv/dias-de-lluvia.csv",(t,a)=>{t?console.log(t):((h=a).forEach(t=>{t.dias_lluvia=t.dias}),(()=>{const t=o.select(".chart-lluvia-bar-vertical-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","area-container-chart-vertical")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(h,t=>t.fecha),d3.max(h,t=>t.fecha)]),a=d3.scaleLinear().domain([0,60]);d.count={x:t,y:a}})(),v(h))})};barVertical();