function barVertical(){const t={top:24,right:24,bottom:24,left:24};let a=0,e=0,n=0,o=0;const c=d3.select(".chart-multiple-lines"),r={};let s;d3.scaleOrdinal(["#9a1622","#e30613","#0080b8","#f07a36"]);const i=d3.timeParse("%x");function l(s){n=c.node().offsetWidth,o=600,a=n-t.left-t.right,e=o-t.top-t.bottom;const i=d3.nest().key(function(t){return t.presentada}).entries(s);console.log(i),i.forEach(function(t){t.maxPrice=d3.max(t.values,function(t){return t.votos})}),c.selectAll("svg").data(i).enter().append("svg").attr("width",n).attr("height",o).append("g").attr("class","area-container-chart-vertical").append("g").attr("class","axis axis-x");const l="translate("+t.left+","+t.top+")";c.select(".chart-lluvia-bar-vertical-container").attr("transform",l);const d=d3.area().x(t=>r.count.x(t.fecha)).y0(e).y1(t=>r.count.y(t.votos)).curve(d3.curveCardinal.tension(.6));!function(t,a){r.count.x.range([0,t]),r.count.y.range([a,0])}(a,e);const f=c.select(".area-container-chart-vertical").selectAll(".area").data([s]),u=f.enter().append("path").attr("class","area").attr("class",t=>t.key);f.merge(u).attr("d",t=>d(t.values))}window.addEventListener("resize",function(){l(s)}),d3.csv("csv/legislatura-psoe-votos-a-favor.csv",function(t,a){t?console.log(t):((s=a).forEach(t=>{t.votos=+t.votos,t.fecha=i(t.fecha)}),function(){const t=d3.scaleTime().domain([d3.min(s,t=>t.fecha),d3.max(s,t=>t.fecha)]),a=d3.scaleLinear().domain([d3.min(s,t=>t.votos),d3.max(s,t=>t.votos)]);r.count={x:t,y:a}}(),l(s))})}barVertical();