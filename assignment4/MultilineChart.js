
/** Resources:
 * grid: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
 * colorScale: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
 * lines(path): https://bl.ocks.org/mbostock/3883245
 * line animation: https://bl.ocks.org/basilesimon/f164aec5758d16d51d248e41af5428e4
 * stroke-dasharray: https://css-tricks.com/almanac/properties/s/stroke-dasharray/
 * stroke-dashoffset: https://css-tricks.com/almanac/properties/s/stroke-dashoffset/
 **/

 // set up the SVG container 
var margin = {top: 10, right: 240, bottom: 150, left: 150},
    width = 840 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var brics = [ // BRICS // prototype for extra credit 
	"Brazil", 
	"Russia", 
	"India", 
	"China", 
	"South Africa", 
	"United States"
];

var t = new Array(); // array used for x axis 
var times = new Array(); // array used for the x axis converted into a time object 
var brics_data = new Array(); // the brics data array 

var parseTime = d3.timeParse("%Y");// get the year from the string 

//Scales:
// x is scaled by time, y is scaled linearly, and color is scaled by schemeCategory10
var xScale = d3.scaleTime().rangeRound([0, width]);
var yScale = d3.scaleLinear().rangeRound([height, 0]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// the x and y axis labels 
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// generates the x gridlines 
function make_x_gridlines() 
{		
    return d3.axisBottom(xScale).ticks(5)
}

// generates the y gridlines 
function make_y_gridlines() 
{		
    return d3.axisLeft(yScale).ticks(5)
}

// load the CSV file 
d3.csv("EPC_2000_2010.csv", function(error, data){
    
	// create an array of all the data correspoding with each year 
	var keys = Object.keys(data[0]);
	for(var i = 0; i < keys.length; i++)
	{
		if(!isNaN(parseInt(keys[i], 10)))
		{
			times.push(parseTime(keys[i]));
			t.push(keys[i]);
		}
	}
	
	// set up the BRICS data set 
	data.forEach((d) => {
		d.key = d.Country;
		d.value = new Array();
		t.forEach((k) => {
			d.value.push(parseFloat(d[k]));
		});
		
		if(brics.includes(d.Country))
		{
			brics_data.push({key: d.key, value: d.value, end: d.value[d.value.length-1]});
		}
	});
	
	// set the domains for the x and y axis 
	xScale.domain(d3.extent(times, (d) => d));
	yScale.domain([0,d3.max(brics_data, (d) => {
		var max = 0;
		d.value.forEach((d) => {
			if(d > max)
				max = d;
		});
		return max;
	})]);

	// Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
		.attr("transform", "translate(0," + 5 + ")")
        .style("text-anchor", "start");
        
	// label x-axis year 
	svg.append("g")
		.append("text")
		.text("year")
		.attr("x", xScale(times[times.length-1]) + 25)
		.attr("y", height + 10)
		.style("text-anchor", "start")
        .attr("font-size", "12px")
		.attr("fill", "black");
    
    // Draw yAxis and position the label
	 svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end");
	
	// label y-axis Miliion BTUs Per Person 
	svg.append("g")
		.append("text")
		.text("Million BTUs Per Person")
		.style("text-anchor", "middle")
        .attr("font-size", "12px")
		.attr("fill", "black")
		.attr("transform", "translate(" + -50 + "," + height/2 + ") rotate(-90)");
		
	// draw the grid x 
	svg.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat("")
		);
	
	// draw the grid y
	svg.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat("")
		);
	
	// append each line of the data 
	brics_data.forEach((d) => {
		
		// create the line 
		var line = d3.line()
			.curve(d3.curveBasis)
			.x((d,i) => xScale(times[i]))
			.y((d) => yScale(d));
		
		//draws the line color is scaled to its last value 
		var path = svg.append("path")
				.datum(d.value)
				.attr("fill", "none")
				.attr("stroke", (d) => colorScale(d))
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5)
				.attr("d", line);
				
		// add the animation to the line 
		var totalLength = path.node().getTotalLength();
		path.attr("stroke-dasharray", totalLength)
			.attr("stroke-dashoffset", totalLength)
				.transition()
				.duration(2000)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0);
				
	});
	
	// draw the country lable text 
	svg.append("g")
		.selectAll("text")
		.data(brics_data)
		.enter()
		.append("text")
		.text((d) => d.key)
		.attr("x", (d) => xScale(times[times.length-1]) + 5)
		.attr("y", (d) => yScale(d.end) + 5)
		.style("text-anchor", "start")
        .attr("font-size", "12px")
		.attr("fill", "black");
	
	
}); // End d3.csv()
