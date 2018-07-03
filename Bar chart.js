function updateViz(data, callAgain=true)
{
   var v = d3.select("#viz").selectAll("rect").data(data);
   v.exit().remove();
   v.enter().append("rect").merge(v)
  .attr("width",15)
  .attr("height",function(d){return (d*10);})
  .attr("x",function(d,i){ return i*20;})
  .attr("y",function(d){return ((height/2.0)-(5.0*d));})
  .attr("tokenid",function(d,i){return d*i*64})
  .attr("fill","steelblue ");
  
  if (callAgain) {
data.push(20);
	callAgain = false;
	updateViz(data,callAgain);
	}
}

