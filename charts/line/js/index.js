const line=()=>{const t=24,a=24,e=24,s=24;let c=0,n=0;const l=d3.select(".line-lluvia"),i=l.select("svg"),o={};let r;const d=r=>{const d=l.node().offsetWidth;c=d-s-a,n=600-t-e,i.attr("width",d).attr("height",600);const u="translate("+s+","+t+")",x=i.select(".line-lluvia-container");x.attr("transform",u);const v=d3.line().x(t=>o.count.x(t.fecha)).y(t=>o.count.y(t.dias));((t,a)=>{o.count.x.range([0,t]),o.count.y.range([a,0])})(c,n);const m=l.select(".line-lluvia-container-dos"),p=m.selectAll(".line").data([r]),f=p.enter().append("path").attr("class","line").attr("stroke-width","1.5"),g=m.selectAll(".circles").data(r),h=g.enter().append("circle").attr("class","circles");p.merge(f).attr("d",v),g.merge(h).attr("cx",t=>o.count.x(t.fecha)).attr("cy",t=>o.count.y(t.dias_lluvia)).attr("r",3),(t=>{const a=d3.axisBottom(o.count.x).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform","translate(0,"+n+")").call(a);const e=d3.axisLeft(o.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-c);t.select(".axis-y").call(e)})(x)};window.addEventListener("resize",()=>{d(r)}),d3.csv("csv/dias-de-lluvia.csv",(t,a)=>{t?console.log(t):((r=a).forEach(t=>{t.dias_lluvia=t.dias}),(()=>{const t=i.select(".line-lluvia-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","line-lluvia-container-dos")})(),(()=>{const t=d3.scaleTime().domain([1951,2017]),a=d3.scaleLinear().domain([0,60]);o.count={x:t,y:a}})(),d(r))})};line();