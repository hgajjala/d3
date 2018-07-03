function updateViz(data)
{
 var c = d3.select("#viz").selectAll("circle").data(data);
  c.exit().remove();
  c.enter().append("circle").merge(c)
  .attr("cx", function(d,i) {return ((width/2)+ d.x);})
  .attr("cy", function(d,i) {return ((height/2)+ d.y);})
  .attr("r", function(d,i) {return (d.r/2);})
  .attr("fill","green");
}
  
  