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
			        width = 690,
			        height = 190;  

			    // Parse the date / time
			    var parseDate = d3.time.format("%d-%b-%y").parse,
			        bisectDate = d3.bisector(function(d) { return d.year; }).left; 

			    // Set the ranges
			    var x = d3.scale.linear().range([margin.left, width - margin.right]).domain([1975, 2015]);
			    var y0 = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-30, 60]);
			    var y1 = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-20, 0]);

			    // Define the axes
			    var xAxis = d3.svg.axis().scale(x);

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
			      .defer(d3.json, "http://changesapp.herokuapp.com/api/v1/glacier")
			      .await(analyze);

			    function analyze(error, data, data2) {    
			        data.forEach(function(d) {
			            d.year = d.year
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
			            .attr("d", valueline(data));

			        // Add the valueline2 path.
			        lineSvg.append("path")                                 
			            .attr("class", "line")
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
			        .attr("transform", "rotate(-90)")
			        // .text("Change in Global Sea Level from 1990 (millimeters)");

			        // Add Right Y Axis Label
			        svg.append("text")
			        .attr("class", "y label")
			        .attr("text-anchor", "end")
			        .attr("x", 250)
			        .attr("y", (0-width-20))
			        .attr("dy", ".75em")
			        .attr("transform", "rotate(-270)")
			        // .text("Cumulative glacier mass balance (meters of water)");    

			        // Add Chart Title
			        svg.append("text")
			            .attr("x", (width / 2))             
			            .attr("y", 0 - (margin.top / 10))
			            .attr("text-anchor", "middle")  
			            .style("font-size", "16px") 
			            .style("text-decoration", "underline")  
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

			    };

			}

			function co2emissions() {

			    // Set the dimensions of the canvas / graph
			    var margin = {top: 20, right: 20, bottom: 20, left: 50},
			        width = 690,
			        height = 190;  

			    // Parse the date / time
			    var parseDate = d3.time.format("%d-%b-%y").parse,
			        bisectDate = d3.bisector(function(d) { return d.year; }).left; 

			    // Set the ranges
			    var x = d3.scale.linear().range([margin.left, width - margin.right]).domain([1975, 2015])
			    var y = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([-30, 60]);

			    // Define the axes
			    var xAxis = d3.svg.axis().scale(x);
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
			            d.year = d.year
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

			    };

			}

			function airquality(){
				var margin = {top: 80, right: 80, bottom: 80, left: 80},
    		width = 600 - margin.left - margin.right,
    		height = 400 - margin.top - margin.bottom;

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

				var svg = d3.select("body").append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("class", "graph")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				d3.json("http://changesapp.herokuapp.com/api/v1/airquality", function(error, data) {
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
				        console.log(d);
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
				    .size([960,960])
				    .padding(1.5);
				  bubble.nodes(root);

				  // ASSIGNS THE VARIABLE SVG TO THE D3 #CHART SELECTOR
				  var svg = d3.select("#chart")
				    .append("svg")
				    .attr("width",960)
				    .attr("height", 960)
				    .attr("class","bubble");

				  // CREATING EACH NODE FROM THE DATA
				  var node = svg.selectAll(".node")
				    .data(bubble.nodes(root)
				    .filter(function(d){ return !d.children;}))
				    .enter()
				    .append("g")
				      .attr("class","node")
				      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

				  var tooltip = d3.select("body")
				      .append("div")
				      .style("position", "absolute")
				      .style("z-index", "10")
				      .style("visibility", "hidden")
				      .style("color", "white")
				      .style("padding", "8px")
				      .style("background-color", "rgba(0, 0, 0, 0.75)")
				      .style("border-radius", "6px")
				      .style("font", "12px sans-serif")
				      .text("tooltip");

				  // CREATING EACH CIRCLE FROM THE NODES
				  var colour = d3.scale.category10();

				  node.append("circle")
				    .attr("class", "maincirc")
				    .attr("r", function(d) { return d.r; })
				    .style("fill", function(d) { return colour(d.name); })
				    .on("mouseover", function(d) {
				      tooltip.text(d.name + ":" + " " + d.value);
				      tooltip.style("visibility", "visible");
				      })
				      .on("mousemove", function() {
				          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
				      })
				      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
				});


			}

			sealevel();
			co2emissions();
			animaltracker();
			// airquality();

      
    }




})();