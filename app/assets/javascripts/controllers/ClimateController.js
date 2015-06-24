(function(){

  angular
    .module('ChangesApp')
    .controller('ClimateController', ClimateController);

    ClimateController.$inject = ['$http' , '$resource', '$state', '$stateParams'];

    function ClimateController($http, $resource, $state, $stateParams){
      var self = this;


			function sealevel() {


			    // Set the dimensions of the canvas / graph
			    var margin = {top: 20, right: 20, bottom: 20, left: 50},
			        width = '100%',
			        height = '100%';  

			    // Parse the date / time
			    var parseDate = d3.time.format("%d-%b-%y").parse,
			        bisectDate = d3.bisector(function(d) { return d.year; }).left; 

			    // Set the ranges
			    var x = d3.scale.linear().range([margin.left, width - margin.right]).domain([1975, 2015]);
			    var y0 = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-30, 60]);
			    var y1 = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-20, 0]);

			    // Define the axes
			    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d"));

			    var yAxisLeft = d3.svg.axis().scale(y0).orient("left");
			    var yAxisRight = d3.svg.axis().scale(y1).orient("right");

			    // Define the line
			    var valueline = d3.svg.line()
			        .x(function(d) { return x(d.year); })
			        .y(function(d) { return y0(d.sea_level); })
			        .interpolate("basis");

			    var valueline2 = d3.svg.line()
			        .x(function(d) { return x(d.year); })
			        .y(function(d) { return y1(d.melt_rate); })
			        .interpolate("basis");    
			        
			    // Adds the svg canvas
			    var svg = d3.select("#glaciar-sealevel")
			        .append("svg")
			        		.attr("class", "glacier-svg")
			            .attr("width", width)
			            .attr("height", height)
			        .append("g");

			    var lineSvg = svg.append("g");                             

			    var focus = svg.append("g")                                
			        .style("display", "none");                             

			    // Get the data
			    queue()
			      .defer(d3.json, "https://changesapp.herokuapp.com/api/v1/sealevel")
			      .defer(d3.json, "https://changesapp.herokuapp.com/api/v1/glacier")
			      .await(analyze);

			    function analyze(error, data, data2) {    
			        data.forEach(function(d) {
			            d.year = d.year;
			            d.sea_level = d.sea_level;
			        });
			        data2.forEach(function(d) {
			            d.melt_rate = d.melt_rate;
			        });    

			        // Scale the range of the data
			        x.domain(d3.extent(data2, function(d) { return d.year; }));
			        // y0.domain([-30, d3.max(data, function(d) { return d.sea_level; })]);
			        // y1.domain([-20, d3.max(data2, function(d) { return d.melt_rate; })]);
			        y0.domain(d3.extent(data, function(d) { return d.sea_level; }));
			        y1.domain(d3.extent(data2, function(d) { return d.melt_rate; }));    

			        // Add the valueline path.
			        lineSvg.append("path")                                 
			            .attr("class", "line")
			            .style("fill", "none")
			            .attr("d", valueline(data));

			        // Add the valueline2 path.
			        lineSvg.append("path")                                 
			            .attr("class", "line")
			            .style("fill", "none")
			            .attr("d", valueline2(data2));        

			        // Add the X Axis
			        svg.append("g")
			            .attr("class", "x axis")
			            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
			            .call(xAxis);

			        // Add the Left Y Axis
			        svg.append("g")
			            .attr("class", "y axis")
			            .attr("transform", "translate(" + margin.left + ",0)")
			            .call(yAxisLeft);

			        // Add the Right Y Axis
			        svg.append("g")             
			            .attr("class", "y axis")    
			            .attr("transform", "translate(" + (width-20) + " ,0)")    
			            .call(yAxisRight);    

			        // Add X Axis Label
			        svg.append("text")
			        .attr({
			            "class": "x label",
			            "text-anchor": "end",
			            "x": width/2,
			            "y": height+20
			        })
			        .text("Year");

			        // Add Left Y Axis Label
			        svg.append("text")
			        .attr("class", "y label")
			        .attr("text-anchor", "end")
			        .attr("x", 0)
			        .attr("y", 6)
			        .attr("dy", ".75em")
			        .attr("transform", "rotate(-90)");
			        // .text("Change in Global Sea Level from 1990 (millimeters)");

			        // Add Right Y Axis Label
			        svg.append("text")
			        .attr("class", "y label")
			        .attr("text-anchor", "end")
			        .attr("x", 250)
			        .attr("y", (0-width-20))
			        .attr("dy", ".75em")
			        .attr("transform", "rotate(-270)");
			        // .text("Cumulative glacier mass balance (meters of water)");    

			        // Add Chart Title
			        svg.append("text")
			            .attr("x", (width / 2))             
			            .attr("y", 0 - (margin.top / 10))
			            .attr("text-anchor", "middle")  
			            .style("font-size", "16px") 
			            .style("text-decoration", "underline");
			            // .text("Global Sea Level Rise vs Melting of Glaciers");

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
			            .attr("class", "y0")
			            .style("stroke", "blue")
			            .style("stroke-dasharray", "3,3")
			            .style("opacity", 0.5)
			            .attr("x1", width)
			            .attr("x2", width);

			        // append the y line
			        focus.append("line")
			            .attr("class", "y1")
			            .style("stroke", "blue")
			            .style("stroke-dasharray", "3,3")
			            .style("opacity", 0.5)
			            .attr("x1", width)
			            .attr("x2", width);        

			        // append the circle at the intersection for sea level rise
			        focus.append("circle")
			            .attr("class", "y0")
			            .style("fill", "none")
			            .style("stroke", "blue")
			            .attr("r", 4);

			        // append the circle at the intersection for glacier melting
			        focus.append("circle")
			            .attr("class", "y1")
			            .style("fill", "none")
			            .style("stroke", "blue")
			            .attr("r", 4);        

			        // place the value at the intersection for sea level rise
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

			        // place the date at the intersection for sea level rise
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

			        // place the value at the intersection for glacier melting
			        focus.append("text")
			            .attr("class", "z1")
			            .style("stroke", "white")
			            .style("stroke-width", "3.5px")
			            .style("opacity", 0.8)
			            .attr("dx", 8)
			            .attr("dy", "-.3em");
			        focus.append("text")
			            .attr("class", "z2")
			            .attr("dx", 8)
			            .attr("dy", "-.3em");

			        // place the date at the intersection for glacier melting
			        focus.append("text")
			            .attr("class", "z3")
			            .style("stroke", "white")
			            .style("stroke-width", "3.5px")
			            .style("opacity", 0.8)
			            .attr("dx", 8)
			            .attr("dy", "1em");
			        focus.append("text")
			            .attr("class", "z4")
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
			                j = bisectDate(data2, x0, 1),
			                d0 = data[i - 1],
			                d1 = data[i],
			                d = x0 - d0.date > d1.date - x0 ? d1 : d0,
			                c0 = data2[j - 1],
			                c1 = data2[j],
			                c = x0 - c0.date > c1.date - x0 ? c1 : c0;

			            focus.select("circle.y0")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")");

			            focus.select("circle.y1")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y1(c.melt_rate) + ")");            

			            focus.select("text.y1")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")")
			                .text(d.sea_level + " mm");

			            focus.select("text.y2")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")")
			                .text(d.sea_level + " mm");

			            focus.select("text.y3")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")")
			                .text(d.year);

			            focus.select("text.y4")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")")
			                .text(d.year);

			            focus.select("text.z1")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y1(c.melt_rate) + ")")
			                .text(c.melt_rate + " m");

			            focus.select("text.z2")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y1(c.melt_rate) + ")")
			                .text(c.melt_rate + " m");

			            focus.select("text.z3")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y1(c.melt_rate) + ")")
			                .text(d.year);

			            focus.select("text.z4")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y1(c.melt_rate) + ")")
			                .text(d.year);    

			            focus.select(".x")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y0(d.sea_level) + ")")
			                           .attr("y2", height - y0(d.sea_level));

			            focus.select(".y0")
			                .attr("transform",
			                      "translate(" + width * -1 + "," +
			                                     y0(d.sea_level) + ")")
			                           .attr("x2", width + width);

			            focus.select(".y1")
			                .attr("transform",
			                      "translate(" + width * -1 + "," +
			                                     y1(c.melt_rate) + ")")
			                           .attr("x2", width + width);                       


			        }                                                      

			    }
			}

			function co2emissions() {

			    // Set the dimensions of the canvas / graph
			    var margin = {top: 20, right: 20, bottom: 20, left: 50},
			        width = 600,
			        height = 190;  

			    // Parse the date / time
			    var parseDate = d3.time.format("%d-%b-%y").parse,
			        bisectDate = d3.bisector(function(d) { return d.year; }).left; 

			    // Set the ranges
			    var x = d3.scale.linear().range([margin.left, width - margin.right]).domain([1975, 2015]);
			    var y = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-30, 60]);

			    // Define the axes

			    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d"));
			    var yAxis = d3.svg.axis().scale(y).orient("left");
			        
			    // Adds the svg canvas
			    var svg = d3.select("#c02-tracker")
			        .append("svg")
			        		.attr("class", "c02-svg")
			            .attr("width", width)
			            .attr("height", height)
			        .append("g");

			    var lineSvg = svg.append("g");                             

			    var focus = svg.append("g")                                
			        .style("display", "none");                             

			    // Get the data
			    queue()
			      .defer(d3.json, "https://changesapp.herokuapp.com/api/v1/co2emissions")
			      .await(analyze);

			    function analyze(error, data) {    
			        data.forEach(function(d) {
			            d.year = d.year;
			            d.ppm = d.ppm;
			        });

			        // Scale the range of the data
			        x.domain(d3.extent(data, function(d) { return d.year; }));
			        y.domain(d3.extent(data, function(d) { return d.ppm; })); 

			        // Add dots
			        svg.selectAll("dot")
			            .data(data)
			        .enter().append("circle")
			            .attr({
			                "r": 3.5,
			                "cx": function(d) { return x(d.year); },
			                "cy": function(d) { return y(d.ppm); },
			                "fill": "blue"
			            });

			        // Add the X Axis
			        svg.append("g")
			            .attr("class", "x axis")
			            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
			            .call(xAxis);

			        // Add the Y Axis
			        svg.append("g")
			            .attr("class", "y axis")
			            .attr("transform", "translate(" + margin.left + ",0)")
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

			        // Add Left Y Axis Label
			        svg.append("text")
			        .attr("class", "y label")
			        .attr("text-anchor", "end")
			        .attr("x", -50)
			        .attr("y", 6)
			        .attr("dy", ".75em")
			        .attr("transform", "rotate(-90)");

			        // Add Chart Title
			        svg.append("text")
			            .attr("x", (width / 2))             
			            .attr("y", 0 - (margin.top / 10))
			            .attr("text-anchor", "middle")  
			            .style("font-size", "16px") 
			            .style("text-decoration", "underline")  
			            .text("CO2 Emissions");

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

			        // place the value at the intersection for CO2 emissions
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

			        // place the date at the intersection for CO2 emissions
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
			                                     y(d.ppm) + ")");        

			            focus.select("text.y1")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y(d.ppm) + ")")
			                .text(d.ppm + " pmm");

			            focus.select("text.y2")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y(d.ppm) + ")")
			                .text(d.ppm + " pmm");

			            focus.select("text.y3")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y(d.ppm) + ")")
			                .text(d.year);

			            focus.select("text.y4")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y(d.ppm) + ")")
			                .text(d.year);

			            focus.select(".x")
			                .attr("transform",
			                      "translate(" + x(d.year) + "," +
			                                     y(d.ppm) + ")")
			                           .attr("y2", height - y(d.ppm));

			            focus.select(".y")
			                .attr("transform",
			                      "translate(" + width * -1 + "," +
			                                     y(d.ppm) + ")")
			                           .attr("x2", width + width);                     


			        }                                                      

			    }
			}

			function airquality(){
				var margin = {top: 80, right: 80, bottom: 80, left: 40},
    		width = 360 - margin.left - margin.right,
    		height = 250 - margin.top - margin.bottom;

				var x = d3.scale.ordinal()
				    .rangeRoundBands([0, width], .1);

				var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
				y1 = d3.scale.linear().domain([20, 80]).range([height, 0]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				// create left yAxis
				var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
				// create right yAxis
				var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");

				var svg = d3.select("#air-quality").append("svg")
				    // .attr("width", width + margin.left + margin.right)
				    // .attr("height", height + margin.top + margin.bottom)
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("class", "graph")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				d3.json("https://changesapp.herokuapp.com/api/v1/airquality", function(error, data) {
				  x.domain(data.map(function(d) { return d.city_name; }));
				  y0.domain([0, d3.max(data, function(d) { return d.pm25; })]);

				  // Displays City Names
				  svg.append("g")
				      .attr("class", "x axis")
				      .attr("transform", "translate(0," + height + ")")
				      .call(xAxis)
				    .selectAll("text")
				      .attr("transform", "rotate(55)")
				      .style("text-anchor", "start");
				      

				  svg.append("g")
				    .attr("class", "y axis axisLeft")
				    .attr("transform", "translate(0,0)")
				    .call(yAxisLeft)
				  .append("text")
				    .attr("y", 6)
				    .attr("dy", "-2em")
				    .style("text-anchor", "end")
				    .text("pm 2.5");
				  
				  svg.append("text")
				    .attr("x", (width / 2))             
				    .attr("y", 0 - (margin.top / 10))
				    .attr("text-anchor", "middle")  
				    .style("font-size", "16px") 
				    .style("text-decoration", "underline")  
				    .text("Air Quality 2000 vs 2015");
				 

				  // Create Bars 
				  bars = svg.selectAll(".bar").data(data).enter();

				  // 2000 Values
				  bars.append("rect")
				      .attr("class", "bar1")
				      .attr("x", function(d) { return x(d.city_name); })
				      .attr("width", x.rangeBand()/2)
				      // return 2000
				      .attr("y", function(d) { 
				        if (d.date == 2000) {
				          return y0(d.pm25);
				        };
				      

				      })
				      .attr("height", function(d) {
				      if (d.date == 2000) { 
				        return height - y0(d.pm25); 
				        }
				      })
				      .on("mouseover", function(d,i){
				        svg.append('text')
				        .text(d.pm25 + ' pm2.5')
				        .attr({
				          "text-anchor": "middle",
				          x: parseFloat(d3.select(this).attr('x')),
				          "font-family": "sans-serif",
				          "font-size": 12,
				          id: "tooltip" 
				        });
				      })

				      .on("mouseout", function(){
				        d3.select('#tooltip').remove();
				      });

				  // Creates 2015 pm2.5 bars    
				  bars.append("rect")
				      .attr("class", "bar2")
				      .attr("x", function(d) { return x(d.city_name) + x.rangeBand()/2; })
				      .attr("width", x.rangeBand() / 2)
				      .attr("y", function(d) {
				        if (d.date == 2015) {
				          return y0(d.pm25); 
				        }

				      })
				      .classed("bar2", 2) 
				      .attr("height", function(d) { 
				        if (d.date == 2015) 
				        return height - y0(d.pm25); })
				      .text(function(d){         
				            return d.pm25;          
				          })

				      // Displays 2015 pm2.5 values on hover
				      .on("mouseover", function(d,i){
				        svg.append('text')
				        .text(d.pm25 + ' pm2.5')
				        .attr({
				          "text-anchor": "middle",
				          x: parseFloat(d3.select(this).attr('x')),
				          "font-family": "sans-serif",
				          "font-size": 12,
				          id: "tooltip" 
				        });
				      })

				      .on("mouseout", function(){
				        d3.select('#tooltip').remove();
				      });

				});
			}

			function animaltracker(){
				d3.json("https://changesapp.herokuapp.com/api/v1/endangered_species", function(error, json) {
					  if (error) return console.warn(error);
					  
					  // CODE THAT CREATES A NEW OBJECT FROM THE API ENDPOINT
					  var root = {};
					  var dataset = json;
					  root.name = "endangered_species";
					  root.children = new Array();
					  for ( i = 0; i < dataset.length; i++){
					    var item = {};
					    item.name = dataset[i].name;
					    item.value = Number(dataset[i].count);
					    root.children.push(item);
					  }

					  // SETS UP THE LAYOUT STRUCTURE FOR THE BUBBLES
					  var bubble = d3.layout.pack()
					    .sort(null)
					    .size([400,400])
					    .padding(1.5);
					  bubble.nodes(root);

					  // ASSIGNS THE VARIABLE SVG TO THE D3 #ANIMAL-TRACKER SELECTOR
					  var svg = d3.select("#animal-tracker")
					    .append("svg")
					    .attr("width",'100%')
					    .attr("height", '100%')
					    .attr("class","bubble");

					  // CREATING EACH NODE FROM THE DATA
					  var node = svg.selectAll(".node")
					    .data(bubble.nodes(root)
					    .filter(function(d){ return !d.children;}))
					    .enter()
					    .append("g")
					      .attr("class","node")
					      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

					  var tooltipAni = d3.select("#animal-tracker")
					      .append("div")
					      .style("position", "absolute")
					      .style("z-index", "10")
					      .style("visibility", "hidden")
					      .style("color", "white")
					      .style("padding", "8px")
					      .style("background-color", "rgba(0, 0, 0, 0.75)")
					      .style("border-radius", "6px")
					      .style("font", "12px sans-serif")
					      .text("tooltipAni");

					  // CREATING EACH CIRCLE FROM THE NODES
					  var colour = d3.scale.category10();

					  node.append("circle")
					    .attr("class", "maincirc")
					    .attr("r", function(d) { return d.r; })
					    .style("fill", function(d) { return colour(d.name); })
						   .on("mouseover", function(d) {
	                            switch(d.name){
	                                case 'Black Rhino':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='https://pbs.twimg.com/profile_images/588760342215274497/6_9fYuXh_400x400.jpg'>");
	                                    break;
	                                case 'Sumatran Tiger':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='https://pbs.twimg.com/profile_images/588775277355872256/hfjYiPGJ_400x400.jpg'>");
	                                    break;
	                                case 'Sumatran Elephant':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://s3.amazonaws.com/mongabay/indonesia/600/sumatra_9183.jpg'>");
	                                    break;
	                                case 'Cross River Gorilla':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://cdn.phys.org/newman/gfx/news/hires/2008/crossrivergo.jpg'>");
	                                    break;
	                                case 'Leatherback Turtle':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='https://pbs.twimg.com/profile_images/76988470/turtle_400x400.jpg'>");
	                                    break;
	                                case 'Amur Leopard':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://stockfresh.com/files/s/scheriton/m/95/2195060_stock-photo-head-shot-of-adorable-baby-amur-leopard-cub.jpg'>");
	                                    break;
	                                case 'Hawksbill Turtle':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://art.state.gov/exhibitimg.ashx?img=Canberra+2013%5c2013.0440.jpg'>");
	                                    break;
	                                case 'Javan Rhino':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='https://pbs.twimg.com/profile_images/574927522/javanrhino_400x400.jpg'>");
	                                    break;            
	                                case 'Mountain Gorilla':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://www.imagesofwildlife.co.uk/wp-content/uploads/Mountain-Gorilla-014-400x400.jpg'>");
	                                    break;
	                                case 'Sumatran Orangutan':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://i1-news.softpedia-static.com/images/news2/9-Things-You-Did-Not-Know-About-Orangutans-3.jpg'>");
	                                    break;
	                                case 'South China Tiger':
	                                    tooltipAni.html("<p>"+d.name+": "+d.value+" left"+"</p>"+"<img src='http://www.everydayhero.com.au/events/images/0004/2892/04-TigerTrekCampaign-EDH-2000x2000.jpg?1410840136?1431907217021'>");
	                                    break;                                                                                                                                                                    
	                            }
	                          tooltipAni.style("visibility", "visible");
	                          })
					      .on("mousemove", function() {
					          return tooltipAni.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
					      })
					      .on("mouseout", function(){return tooltipAni.style("visibility", "hidden");});
					});
			}

			function airtemp(){

				var red = 75;
		    var lastYear = 1961;
		    var lastTemp = 6;

		      jQuery('#vmap').vectorMap({ 
		          map: 'world_en',
		          backgroundColor: 'white',
		          color: '#ffffff',
		          hoverOpacity: 0.7,
		          selectedColor: '#666666',
		          enableZoom: false,
		          showTooltip: true,
		          values: sample_data,
		          scaleColors: ["#004b00", "#009600"],
		          normalizeFunction: 'polynomial'
		      });

		    d3.json('https://changesapp.herokuapp.com/api/v1/globaltemp', function(error, data){
		      if (error) {
		        console.log(error);
		      } else {

		        d3.select('#slider4').call(d3.slider().min(1961).max(2014).step(1).on("slide", function(evt, value) {
		          for (var i = 0; i < data.length; i++) {

		            var delta = 0;

		            if (data[i].year == value) {
		              d3.select('#slider4text').text('Year: ' + value);
		              d3.select('#slider4text2').text('Temp: ' + data[i].temp + ' degrees Celcius');

		              if (value > lastYear) {
		                delta = data[i].temp - lastTemp;
		                lastYear = data[i].year;
		                lastTemp = data[i].temp;
		                red += delta;
		              }
		              else if (value < lastYear) {
		                delta = lastTemp - data[i].temp;
		                lastYear = data[i].year;
		                lastTemp = data[i].temp;
		                red -= delta;         
		              };

		              $('#vmap').vectorMap('set', 'scaleColors', [rgbToHex(red, 75, 0), rgbToHex(red, 150, 0), ]);
		            };
			          }
			          
			        }));

			      }
			    });

			    function componentToHex(c) {
			        var hex = c.toString(16);
			        return hex.length == 1 ? "0" + hex : hex;
			    }

			    function rgbToHex(r, g, b) {
			        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			    }

			  }			
			
			function seatemp(){

				//svg sizes and margins
				var margin = {
				    top: 30,
				    right: 20,
				    bottom: 20,
				    left: 50
				};

				var width = 2700;
				var width2 = 0;
				var height = 430;

				//The number of columns and rows of the heatmap
				var MapColumns = 10,
					MapRows = 30;
	
				//The maximum radius the hexagons can have to still fit the screen
				var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
							height/((MapRows + 1/3) * 1.5)]);

				//Set the new height and width of the SVG based on the max possible
				width = MapColumns*hexRadius*Math.sqrt(3);
				heigth = MapRows*1.5*hexRadius+0.5*hexRadius;

				//Set the hexagon radius
				var hexbin = d3.hexbin()
				    	       .radius(hexRadius);

				//Calculate the center positions of each hexagon	
				var points = [];
				for (var i = 0; i < MapRows; i++) {
				    for (var j = 0; j < MapColumns; j++) {
				        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
				    }//for j
				}//for i

				//Create SVG element
				var svg = d3.select("#sea-temp").append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .attr("class", "seatemp")
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				//Create SVG element
				var svg2 = d3.select("#axis").append("svg")
				    .attr("width", width2 + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

				var tooltip1 = d3.select("#sea-temp")
				    .append("div")
				    .attr("class", "tooltipsea")       
				    .style("position", "absolute")
				    .style("z-index", "10")
				    .style("visibility", "hidden")
				    .text("Larger marine like Tuna and most marine fish will begin dying off.");

				var tooltip2 = d3.select("#sea-temp")
				    .append("div")
				    .attr("class", "tooltipsea")
				    .style("position", "absolute")
				    .style("z-index", "10")
				    .style("visibility", "hidden")
				    .text("Krill and plankton life start to die off, destroying the bottom of the oceans food chain.");

				var tooltip3 = d3.select("#sea-temp")
				    .append("div")
				    .attr("class", "tooltipsea")
				    .style("position", "absolute")
				    .style("z-index", "10")
				    .style("visibility", "hidden")
				    .text("Coral reef degradation globally.");

				var tooltip4 = d3.select("#sea-temp")
				    .append("div")
				    .attr("class", "tooltipsea")
				    .style("position", "absolute")
				    .style("z-index", "10")
				    .style("visibility", "hidden")
				    .text("Ocean currents and storm patterns are affected, disrupting meteorological forecasting.");    

				var tooltip5 = d3.select("#sea-temp")
				    .append("div")
				    .attr("class", "tooltipsea")
				    .style("position", "absolute")
				    .style("z-index", "10")
				    .style("visibility", "hidden")
				    .text("Ocean is healthy!");     


				//Create Y Scale
				var y = d3.scale.linear()
				  .domain([0, 35])
				  .range([480, 0]);

				//Create Y Axis
				var yAxis = d3.svg.axis()
				  .scale(y)
				  .orient("left")
				  // .tickSize(6, -width);

				svg2.append("g")
				  .attr("class", "y axis")
				  .call(yAxis);  

				// Add Left Y Axis Label
				svg2.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("x", -120)
				.attr("y", -40)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")

				// Add Chart Title
				svg.append("text")
				    .attr("x", (width / 2)-5)             
				    .attr("y", -15)
				    .attr("text-anchor", "middle")  
				    .style("font-size", "16px") 
				    .style("text-decoration", "underline")  


				//Start drawing the hexagons
				svg.append("g")
				    .selectAll(".hexagon")
				    .data(hexbin(points))
				    .enter().append("path")
				    .attr("class", "hexagon")
				    .attr("d", function (d) {
						return "M" + d.x + "," + d.y + hexbin.hexagon();
					})
				    .attr("stroke", function (d,i) {
						return "#fff";
					})
				    .attr("stroke-width", "1px")
				    .style("fill", function (d,i) {
				        if (i < 10) { return "#FF1205" }
				        else if (i >= 10 && i < 20) { return "#FF3405" }
				        else if (i >= 20 && i < 30) { return "#FF5605" } 
				        else if (i >= 30 && i < 40) { return "#FF7805" }
				        else if (i >= 40 && i < 50) { return "#FF9B05" }
				        else if (i >= 50 && i < 60) { return "#FFBD05" }
				        else if (i >= 60 && i < 70) { return "#FFDF05" }
				        else if (i >= 70 && i < 80) { return "#FFFF05" }
				        else if (i >= 80 && i < 90) { return "#D9FF05" }
				        else if (i >= 90 && i < 100) { return "#B7FF05" }
				        else if (i >= 100 && i < 110) { return "#94FF05" } 
				        else if (i >= 110 && i < 120) { return "#72FF05" }
				        else if (i >= 120 && i < 130) { return "#50FF05" } 
				        else if (i >= 130 && i < 140) { return "#2DFF05" }
				        else if (i >= 140 && i < 150) { return "#0BFF05" }
				        else if (i >= 150 && i < 160) { return "#05FF20" }
				        else if (i >= 160 && i < 170) { return "#05FF42" }
				        else if (i >= 170 && i < 180) { return "#05FF65" }
				        else if (i >= 180 && i < 190) { return "#05FF87" }
				        else if (i >= 190 && i < 200) { return "#05FFA9" }
				        else if (i >= 200 && i < 210) { return "#05FFCC" }
				        else if (i >= 210 && i < 220) { return "#05FFEE" }
				        else if (i >= 220 && i < 230) { return "#05EDFF" } 
				        else if (i >= 230 && i < 240) { return "#05CAFF" }
				        else if (i >= 240 && i < 250) { return "#05A8FF" }
				        else if (i >= 250 && i < 260) { return "#0586FF" }
				        else if (i >= 260 && i < 270) { return "#0563FF" }
				        else if (i >= 270 && i < 280) { return "#0541FF" }
				        else if (i >= 280 && i < 290) { return "#051FFF" }
				        else if (i >= 290 && i < 300) { return "#0D05FF" }    
					})
				    .on("mousemove", function(d, i){
				        if (i < 50) { return tooltip1.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"); }
				        else if (i >= 50 && i < 90) { return tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"); }
				        else if (i >= 90 && i < 170) { return tooltip3.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"); }
				        else if (i >= 170 && i < 220) { return tooltip4.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"); }
				        else { return tooltip5.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"); }
				    })
					// .on("mouseover", mover)
				    .on("mouseover", function(d, i){
				        if (i < 50) {
				            d3.select(this).transition().duration(10).style("fill-opacity", 0.3);
				            return tooltip1.style("visibility", "visible"); 
				        }
				        else if (i >= 50 && i < 90) {
				            d3.select(this).transition().duration(10).style("fill-opacity", 0.3);
				            return tooltip2.style("visibility", "visible"); 
				        }
				        else if (i >= 90 && i < 170) {
				            d3.select(this).transition().duration(10).style("fill-opacity", 0.3);
				            return tooltip3.style("visibility", "visible"); 
				        }  
				        else if (i >= 170 && i < 220) {
				            d3.select(this).transition().duration(10).style("fill-opacity", 0.3);
				            return tooltip4.style("visibility", "visible"); 
				        }  
				        else {
				            d3.select(this).transition().duration(10).style("fill-opacity", 0.3);
				            return tooltip5.style("visibility", "visible"); 
				        } 
				    })
					// .on("mouseout", mout)
				    .on("mouseout", function(d, i){
				        if (i < 50) {
				            d3.select(this).transition().duration(1000).style("fill-opacity", 1);
				            return tooltip1.style("visibility", "hidden"); 
				        }
				        else if (i >= 50 && i < 90) {
				            d3.select(this).transition().duration(1000).style("fill-opacity", 1);
				            return tooltip2.style("visibility", "hidden"); 
				        }
				        else if (i >= 90 && i < 170) {
				            d3.select(this).transition().duration(1000).style("fill-opacity", 1);
				            return tooltip3.style("visibility", "hidden"); 
				        }   
				        else if (i >= 170 && i < 220) {
				            d3.select(this).transition().duration(1000).style("fill-opacity", 1);
				            return tooltip4.style("visibility", "hidden"); 
				        }        
				        else {
				            d3.select(this).transition().duration(1000).style("fill-opacity", 1);
				            return tooltip5.style("visibility", "hidden"); 
				        }
				    })
					;
			}

			function deforestation(){

      	var dataset = [
        {count: 90 }, 
         {count: 10 },
       	];

	       var width = 100;
	       var height = 100;
	       var radius = Math.min(width, height) / 2;

	       var color = d3.scale.category20b();

	       var svg = d3.select('#piechart')
	         .append('svg')
	          .attr('width', width)
	          .attr('height', height)
	          .append('g')
	          .attr('transform', 'translate(' + (width / 2) + 
	          ',' + (height / 2) + ')');

	         

	        var arc = d3.svg.arc()
	          .outerRadius(radius);

	        var pie = d3.layout.pie()
	          .value(function(d) { return d.count; })
	          .sort(null);

	        var path = svg.selectAll('path')
	          .data(pie(dataset))
	          .enter()
	          .append('path')
	          .attr('d', arc)
	          .attr('fill', function(d, i) { 
	            return color(d.data.count);
	          });      
					}



			sealevel();
			co2emissions();
			animaltracker();
			airquality();
			airtemp();
			seatemp();
			deforestation();

}


})();