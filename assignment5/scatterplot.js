// Noriaki Nakano 
// nnakano@ucsc.edu
// 1418185

/* Resources
 * Tooltip: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
 * Zoom: https://bl.ocks.org/mbostock/6123708
 * Zoom-fix: http://bl.ocks.org/cpdean/7a71e687dd5a80f6fd57
 */
 
 // left here just for incase
   var scatterdataset = [ {
        "name": "United States",
        "country": "United States",
        "gdp": 14.9,
        "epc": 317,
        "total": 98.9
    }, {

        "name": "China",
        "country": "China",
        "gdp": 5.93,
        "epc": 76,
        "total": 103
    }, {
        "name": "Japan",
        "country": "Japan",
        "gdp": 5.49,
        "epc": 171, 
        "total": 21.7
    }, {
        "name": "Germany",
        "country": "Germany",
        "gdp": 3.28,
        "epc": 171,
        "total": 14.1
    }, {
        "name": "France",
        "country": "France",
        "gdp": 2.54,
        "epc": 170,
        "total": 10.7
    }, {
        "name": "United Kingdom",
        "country": "United Kingdom",
        "gdp": 2.28,
        "epc": 143,
        "total": 8.8
    }, {
        "name": "Brazil",
        "country": "Brazil",
        "gdp": 2.14,
        "epc": 58,
        "total": 11.3
    }, {
        "name": "Italy",
        "country": "Italy",
        "gdp": 2.04,
        "epc": 126,
        "total": 7.6
    }, {
        "name": "India",
        "country": "India",
        "gdp": 1.70,
        "epc": 19,
        "total": 22.9
    }, {
        "name": "Canada",
        "country": "Canada",
        "gdp": 1.57,
        "epc": 385,
        "total": 13.1
    }, {
        "name": "Russian Federation",
        "country": "Russian Federation",
        "gdp": 1.52,
        "epc": 206,
        "total": 29.5
    }, {

        "name": "Spain",
        "country": "Spain",
        "gdp": 1.37,
        "epc": 134,
        "total": 6.1
    }, {
        "name": "Australia",
        "country": "Australia",
        "gdp": 1.14,
        "epc": 270,
        "total": 6.0
    }, {
        "name": "Mexico",
        "country": "Mexico",
        "gdp": 1.04,
        "epc": 65,
        "total": 7.6
    }, {
        "name": "Korea",
        "country": "Korea",
        "gdp": 1.01,
        "epc": 222,
        "total": 10.7
    }];
	

    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory20);
	
	// define zoom 
	var zoom = d3.zoom()
		.scaleExtent([1, 10])
		.on("zoom", () => {
			svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y+ ")scale(" + d3.event.transform.k + ")");
	});
	
    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
		.call(zoom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var rect = svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all");
	
	
    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);
    
	var rScale = d3.scaleLinear()
		.range([2, 20]);
	
	
    //Define Tooltip here
    var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0);
      
    //Define Axis
    var xAxis = d3.axisBottom(xScale).tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);
    
    //Get Data
    d3.csv("scatterdata.csv", (d) => {
		//Draw Scatterplot
		d.forEach((t) => {
			t.total = Math.floor(t.population * t.ecc / 1000);
		});
		console.log(d);
		
		scatterdataset = d;
		xScale.domain([0, d3.max(scatterdataset, (d) => parseFloat(d.gdp))]);
		yScale.domain([0, d3.max(scatterdataset, (d) => parseFloat(d.ecc))]);
		rScale.domain([0, Math.sqrt(d3.max(scatterdataset, (d) => parseFloat(d.total))) * 5]);
		
        svg.selectAll(".dot")
			.data(scatterdataset)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("r", function(d) { return rScale(Math.sqrt(d.total) * 5); })
			.attr("cx", function(d) {return xScale(d.gdp);})
			.attr("cy", function(d) {return yScale(d.ecc);})
			.style("fill", function (d) { return colors(d.country); })
			.on("mouseover", function(d) {	
				// create tooltip
				div.transition()		
					.duration(100)		
					.style("opacity", .9);		
				div	.html(
						d.country + "<br/>" + 
						"Population: " + d.population + " Million" + "<br/>" + 
						"GDP: " + "$" + d.gdp + " Trillion" + "<br/>" + 
						"ECC: " + d.ecc + " Million BTUs" + "<br/>" + 
						"Total: " + d.total + " Trillion BTUs"
					)	
					.style("left", (d3.event.pageX) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");	
		   })					
			.on("mouseout", function(d) {		
				div.transition()		
					.duration(250)		
					.style("opacity", 0);	
			});

		//Draw Country Names
		///*
		svg.selectAll(".text")
			.data(scatterdataset)
			.enter().append("text")
			.attr("class","text")
			.style("text-anchor", "start")
			.attr("x", function(d) {return xScale(d.gdp);})
			.attr("y", function(d) {return yScale(d.ecc);})
			.style("fill", "black")
			.text(function (d) {return d.country; });
		//*/
		
	 //x-axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "label")
			.attr("y", 50)
			.attr("x", width/2)
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.text("GDP (in Trillion US Dollars) in 2010");

		
		//Y-axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", -50)
			.attr("x", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.attr("font-size", "12px")
			.text("Energy Consumption per Capita (in Million BTUs per person)");

		
		 // draw legend colored rectangles
		svg.append("rect")
			.attr("x", width-250)
			.attr("y", height-190)
			.attr("width", 180)
			.attr("height", 100)
			.attr("fill", "lightgrey")
			.style("stroke-size", "1px");

		svg.append("circle")
			.attr("r", rScale(1 * 5))
			.attr("cx", width-100)
			.attr("cy", height-175)
			.style("fill", "green");
		
		svg.append("circle")
			.attr("r", rScale(Math.sqrt(10) * 5))
			.attr("cx", width-100)
			.attr("cy", height-150)
			.style("fill", "green");

		svg.append("circle")
			.attr("r", rScale(Math.sqrt(100) * 5))
			.attr("cx", width-100)
			.attr("cy", height-110)
			.style("fill", "green");

		svg.append("text")
			.attr("class", "label")
			.attr("x", width -140)
			.attr("y", height-172)
			.style("text-anchor", "end")
			.text("< 1 Trillion BTUs");

		svg.append("text")
			.attr("class", "label")
			.attr("x", width -140)
			.attr("y", height-147)
			.style("text-anchor", "end")
			.text("< 10 Trillion BTUs");

		svg.append("text")
			.attr("class", "label")
			.attr("x", width -140)
			.attr("y", height-107)
			.style("text-anchor", "end")
			.text("< 100 Trillion BTUs");
			
		
		
	});
    
