

// (function (global) {
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight ||0);

var svg = d3.select("#details")
    .append("svg")
    .style("cursor","move");

svg.attr("viewBox", "50 10 " + width + " " + height )
    .attr("preserveAspectRatio", "xMinYMin");

var zoom = d3.zoom()
    .on("zoom", function () {
        var transform = d3.zoomTransform(this);
        map.attr("transform", "transform(" + 
                d3.event.scale + ")");
    });

svg.call(zoom);

var map = svg.append("g")
    .attr("class", "map");

 d3.queue()
    .defer(d3.json,"us-states.json")
    .defer(d3.csv,"Drving_under_influence.csv")
    .await(function (error, us, data){
        if (error){
            console.error('oh dear, something went wrong: '+ error);
         }
        else {
            drawMap(us, data);
        }
    });

function drawMap(us, data){

    var projection = d3.geoAlbersUsa()
        .scale(800)
        .translate([width/2, height/3]);

    var path = d3.geoPath().projection(projection);

    var color = d3.scaleThreshold()
        .domain([2293, 4462, 6631, 8800, 10969, 13138])
        .range(["#034e7b", "#0570b0", "#74a9cf", "#fb6a4a", "#de2d26", "#b2182b"]);

    var features = us.features;
    var totalById = {};
    i=0;
    data.forEach(function (d) {
        totalById[d.State] = {Total: d.Total, Prevalence: d.Prevalence }
        if(d.State == us.features[i].properties.name){
            d.geometry=us.features[i].geometry;
        }
        i+=1;
        
        }   
    );

    us.features.forEach(function(d){
        d.details = totalById[d.properties.name] ? totalById[d.properties.name] : {};
    });


    map.append("g")
        .selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return d.details && d.details.Total ? color(d.details.Total) : undefined;
            })                              
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");

            d3.select(".State")
                .text(d.properties.name);

            d3.select(".Total")
                .text(d.details && d.details.Total && "Total Fatalities: " + d.details.Total || "¯\\_(ツ)_/¯");
            
            d3.select(".Prevalence")
                .text(d.details && d.details.Prevalence && "Prevalence%: " + d.details.Prevalence || "¯\\_(ツ)_/¯");

            d3.select('.details')
                .style('visibility', "visible");
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);

            d3.select(".details")
                .style('visibility', "hidden");
        });

        svg.selectAll("circle")
        .data(data)     
        .enter()
        .append("circle")  
        .attr("cx", function(d){
                 return projection([d.Longitude, d.Latitude])[0];
                })
        .attr("cy",  function(d){
                return projection([d.Longitude, d.Latitude])[1];
                })
        .attr("r", function(d){
                return Math.sqrt(d.Prevalence) * 4;
                }  
              )
        .style("fill", "#FDCC08")
        .style("opacity", 1)
    
        
    }