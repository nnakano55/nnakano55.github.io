/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// This is mostly used on the next portion of the code 
// but this allows the "g" element inside the svg element to be padded inside 
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together. 
// d3 finds the body element then appends s svg selement to it
// then adds the width and height attribute to it.
// Then a "g" element is appended to the svg on the top left, which is then stored into the svg variable 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// These are the scales used in this code
// The xScale is in control of scaling the X-axis of the code, it will make sure that each key will have 
// its corresponding x-position to be in 
// The yScale works similarly where the range is set so that it cannot go anywhere over that threshold
// and also cannot be lower than 0
// The color_scale is what I made to control the color of the rectangles(higher the value, darker the color)
// scaleBand is used to scale the key to corresponding values 
// linear scale is used to shrink the bar to fit the canvas set up the range of the min vs max
// domain give the scaling the max and min value of the data input 
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

var color_scale = d3.scaleLinear().range([255, 150]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat( function(d) { return "$" + d });

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// to make this code work, the data must be modified so that the country data would be the key and 
// the gdp data would be the value. 
// The foreach loop will iterate through each data and modify its values
d3.csv("GDP2016TrillionUSDollars.csv",function(error, data){
    
	data.forEach(function(d) {
        d.key = d.country;
        d.value = +d.gdp;
    });
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    color_scale.domain([0, d3.max(data, (d) => d.value)]); // custom color scale 
	
    // Creating rectangular bars to represent the data. 
    // the .transition() function will give the rectangles the animation to appear on the screen which would be
	// delayed by i, its index, * 200, which will allow each rectangle to come into the scene in order 
	// The attributes x and y are calculated by the key and value respectively, scaled by using the scaling this was
	// declared earier in the code
	// similarly to x and y,  the width and height of the the rectangles are also calculated using the scaling 
	// the attribute fill is made so that the higher the "value" is, the darker the blue color would be.
	// for this I made my own scale where the colors would be scaled from pure blue to a dark blue 
    svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.transition().duration(1000)
		.delay( function(d,i) {return i * 200;})
		.attr("x", function(d) {
			return xScale(d.key);
		})
		.attr("y", function(d) {
			return yScale(d.value);
		})
		.attr("width", xScale.bandwidth())
		.attr("height", (d) => {
			return height - yScale(d.value);
		})
		.attr("fill", (d) => {
			return "rgba(0, 0," + Math.floor(color_scale(d.value)) + ", 255)";
		});

    // Label the data values(d.value)
	// it uses the xScale and yScale to properly place the lableing of the value
	// it also adds constants in order to keep things centered
	 svg.append("g")
		.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.text((d) => d.value)
		.attr("x", (d) => xScale(d.key) + 20)
		.attr("y", (d) => yScale(d.value) + 14)
		.style("text-anchor", "middle")
        .attr("font-size", "14px")
		.attr("font-weight", "bold")
		.attr("fill", "white");
  
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
		.attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label
	 svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end");
      
}); // End d3.csv()

        
    