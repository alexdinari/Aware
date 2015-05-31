(function(){

  angular
    .module('ChangesApp')
    .controller('ClimateController', ClimateController);

    ClimateController.$inject = ['$http' , '$resource', '$state', '$stateParams'];

    function ClimateController($http, $resource, $state, $stateParams){
      var self = this;



			// Set the dimensions of the canvas / graph
			var margin = {top: 20, right: 20, bottom: 20, left: 50},
			    width = 1000,
			    height = 500;  

			// Parse the date / time
			var parseDate = d3.time.format("%d-%b-%y").parse,
			    bisectDate = d3.bisector(function(d) { return d.year; }).left; 

			// Set the ranges
			var x = d3.scale.linear().range([margin.left, width - margin.right]).domain([1975, 2015])
			var y = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-30, 60]);

			// Define the axes
			var xAxis = d3.svg.axis().scale(x);

			var yAxis = d3.svg.axis().scale(y).orient("left")

			// Define the line
			var valueline = d3.svg.line()
			    .x(function(d) { return x(d.year); })
			    .y(function(d) { return y(d.sea_level); })
			    .interpolate("basis");
			    
			// Adds the svg canvas
			var svg = d3.select("body")
			    .append("svg")
			        .attr("width", width + margin.left + margin.right)
			        .attr("height", height + margin.top + margin.bottom)
			    .append("g")
			        .attr("transform", 
			              "translate(" + margin.left + "," + margin.top + ")");

			var lineSvg = svg.append("g");                             

			var focus = svg.append("g")                                
			    .style("display", "none");                             

			// Get the data
			d3.json("https://changesapp.herokuapp.com/api/v1/sealevel", function(error, data) {                 
			    data.forEach(function(d) {
			        d.year = d.year
			        d.sea_level = d.sea_level;
			    });

			    // Scale the range of the data
			    x.domain(d3.extent(data, function(d) { return d.year; }));
			    y.domain([-30, d3.max(data, function(d) { return d.sea_level; })]);

			    // Add the valueline path.
			    lineSvg.append("path")                                 
			        .attr("class", "line")
			        .attr("d", valueline(data));

			    // Add the X Axis
			    svg.append("g")
			        .attr("class", "x axis")
			        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
			        .call(xAxis);

			    // Add the Y Axis
			    svg.append("g")
			        .attr("class", "y axis")
			        .attr("transform", "translate(" + (margin.left) + ",0)")
			        .call(yAxis);

			    // Add X Axis Label
			    svg.append("text")
			    .attr({
			    	"class": "x label",
			    	"text-anchor": "end",
						"x": width/2,
			    	"y": height+20
		    	})
			    .text("Year");

			    // Add Y Axis Label
			    svg.append("text")
			    .attr("class", "y label")
			    .attr("text-anchor", "end")
			    .attr("x", -100)
			    .attr("y", 6)
			    .attr("dy", ".75em")
			    .attr("transform", "rotate(-90)")
			    .text("Change in Global Sea Level from 1990 (millimeters)");

			    // Add Chart Title
			    svg.append("text")
			        .attr("x", (width / 2))             
			        .attr("y", 0 - (margin.top / 10))
			        .attr("text-anchor", "middle")  
			        .style("font-size", "16px") 
			        .style("text-decoration", "underline")  
			        .text("Change in Global Sea Levels from 1990");

			    // append the x line
			    focus.append("line")
			        .attr("class", "x")
			        .style("stroke", "blue")
			        .style("stroke-dasharray", "3,3")
			        .style("opacity", 0.5)
			        .attr("y1", 0)
			        .attr("y2", height);

			    // append the y line
			    focus.append("line")
			        .attr("class", "y")
			        .style("stroke", "blue")
			        .style("stroke-dasharray", "3,3")
			        .style("opacity", 0.5)
			        .attr("x1", width)
			        .attr("x2", width);

			    // append the circle at the intersection
			    focus.append("circle")
			        .attr("class", "y")
			        .style("fill", "none")
			        .style("stroke", "blue")
			        .attr("r", 4);

			    // place the value at the intersection
			    focus.append("text")
			        .attr("class", "y1")
			        .style("stroke", "white")
			        .style("stroke-width", "3.5px")
			        .style("opacity", 0.8)
			        .attr("dx", 8)
			        .attr("dy", "-.3em");
			    focus.append("text")
			        .attr("class", "y2")
			        .attr("dx", 8)
			        .attr("dy", "-.3em");

			    // place the date at the intersection
			    focus.append("text")
			        .attr("class", "y3")
			        .style("stroke", "white")
			        .style("stroke-width", "3.5px")
			        .style("opacity", 0.8)
			        .attr("dx", 8)
			        .attr("dy", "1em");
			    focus.append("text")
			        .attr("class", "y4")
			        .attr("dx", 8)
			        .attr("dy", "1em");
			    
			    // append the rectangle to capture mouse
			    svg.append("rect")
			        .attr("width", width)
			        .attr("height", height)
			        .style("fill", "none")
			        .style("pointer-events", "all")
			        .on("mouseover", function() { focus.style("display", null); })
			        .on("mouseout", function() { focus.style("display", "none"); })
			        .on("mousemove", mousemove);

			    function mousemove() {
			        var x0 = x.invert(d3.mouse(this)[0]),
			            i = bisectDate(data, x0, 1),
			            d0 = data[i - 1],
			            d1 = data[i],
			            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			        focus.select("circle.y")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")");

			        focus.select("text.y1")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")")
			            .text(d.sea_level + " mm");

			        focus.select("text.y2")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")")
			            .text(d.sea_level + " mm");

			        focus.select("text.y3")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")")
			            .text(d.year);

			        focus.select("text.y4")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")")
			            .text(d.year);

			        focus.select(".x")
			            .attr("transform",
			                  "translate(" + x(d.year) + "," +
			                                 y(d.sea_level) + ")")
			                       .attr("y2", height - y(d.sea_level));

			        focus.select(".y")
			            .attr("transform",
			                  "translate(" + width * -1 + "," +
			                                 y(d.sea_level) + ")")
			                       .attr("x2", width + width);


			    }                                                      

			});




      
    }




})();