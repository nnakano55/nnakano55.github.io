/*global d3*/
/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/



// Search "D3 Margin Convention" on Google to understand margins.
// This defines a margin object that contains a child object containing the
// size of the margin for each of the 4 sides of the canvas.
// The margin object also contains dimensions for the SVG canvas object.
var margin = {top: 10, right: 40, bottom: 150, left: 100},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// Define SVG. "g" means group SVG elements together.
// This creates an svg object by selecting the html body element, appending
// a new element of type SVG to the HTML DOM, then sets dimensional attributes
// for that element before grouping SVG elements together and transforming them
// to treat the HTML5 Canvas origin as the SVG origin.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)  // define width attributes based on margin object fields
    .attr("height", height + margin.top + margin.bottom)// define height attributes based on margin object fields
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and
look up SVG AXIS and SCALES. See D3 API Reference to understand the
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/

/**** Define X and Y SCALE. ****/
// constructs a band scale, sets range, sets padding
// band scales are used to map a discrete domain to a continuous output range
// in this case, domain is the set of countries, while the range is the continuous values on an x-axis
var xBandScale = d3.scaleBand()         // constructs a null band scale
               .rangeRound([0, width])  // sets range to [0, width]
               .padding(0.2);           //sets padding to 0.1

// creates a new linear scale with range of [height, 0]
var yScale = d3.scaleLinear().range([height, 0]);

// creates a new linear scale with range of [255, 80]
var colorScale = d3.scaleLinear().rangeRound([255,80]);

// Define X and Y AXIS
// Creates an xAxis using the axisBottom function
var xAxis = d3.axisBottom(xBandScale);  // this axis operates on the xBandScale defined above

// this axis operates on the yScale defined above
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat( function(d) { return d });

var suicideLabelOffsetY = 12;
var suicideLabelOffsetX = 30;

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/

// data.csv contains the age name(age) and its suicide_rate(suicide_rate)
// d.age and d.suicide_rate are very important commands
// You must provide comments here to demonstrate your understanding of these commands
// captures the file "suicide_rate2016TrillionUSDollars.csv" as data as an argument to an anonymous function

var year, year_array;
var year_index = 0;

var myData;

d3.csv("age_group_by_year.csv",function(error, data){
    var year_array = data.columns.slice(1);
    var years = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {age: d.age, value:+d[id]}
            })
        };
    });
    
    myData = data;
    year = year_array[year_index];
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.)
    // creates an ordinal domain for x-axis
    xBandScale.domain(data.map(function(d){ return d.age; }));
    
    // creates a linear domain for y-axis, from 0 to the maximum suicide_rate value in data
    yScale.domain([0, d3.max(years, function(c) {return d3.max(c.values, 
                                                            function(d) { return d.value; });})]);
    
    // color
    colorScale = d3.scaleThreshold()
                   .range(['#feedde','#fdbe85','#fd8d3c','#e6550d','#a63603']);
    // sets the domain for our color scale in the same way as yScale
    var color_max = d3.max(years, function(c) {return d3.max(c.values, 
                                                            function(d) { return d.value; });});
    var color_min = d3.min(years, function(c) {return d3.min(c.values, 
                                                            function(d) { return d.value; });});
    colorScale.domain([ color_min, 2000, 5000, 8000, color_max ]);
        
    // Creating rectangular bars to represent the data.
    svg.selectAll("rect")                        // select all rectangles in our canvas
        .data(data)                              // capture the data parsed from our .csv
        .enter()                                 // instantiate empty rectangles
        .append("rect")                          // append these empty rectangles to the DOM
        .transition().duration(1000)             // set how long our transitions take to complete
        .delay(function(d,i) { return i * 200;}) // begin each transition .2 seconds after the last
        .attr("x", function(d) {                 // set x coord for each rectangle
            return xBandScale(d.age);            // map d.age to range specified by xBandScale
        })
        .attr("y", function(d) {                 // set y coord for each rectangle
            return yScale(d[year]);              // map d.suicide_rate to range specified by yScale
        })
        .attr("width", xBandScale.bandwidth())   // set the width of each rectangle
        .attr("height", function(d) {            // set the height of each rectangle
            return height - yScale(+d[year]);     // translate height into canvas coordinate system
        })
        .attr("fill", function(d) {     // use colorScale to set each rectangle fill relative to suicide_rate
            return colorScale(+d[year])
        });

    // Label the data suicide_rates(d.suicide_rate)
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d){
            return d[year];
        })
        .attr("x", function(d){                                     // place each suicide_rate value at regular intervals
            return xBandScale(d.age)+(xBandScale.bandwidth())/2;    // along the x axis
        })
        .attr("y", function(d){                                     // place each suicide_rate value at the top of its
            return yScale(d[year])+suicideLabelOffsetY;             // corresponding rectangle
        })
        .attr("id", "label")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");

    // Draw xAxis and position the label at -60 degrees as shown on the output
    svg.append("g")                         // select an uninitialized svg element "g"
        .attr("class", "x axis")            // set g's class attribute
        .attr("transform", "translate(0," + height + ")")   //translate g
        .call(xAxis)                        // call our xAxis function (the svg to append)
        .selectAll("text")                  // select uninitialized text element in g
        .attr("dy", ".7em")                 // set y coord
        .style("text-anchor", "middle")     // set text-anchor of text element
        .attr("font-size", "10px");         // set font-size of text element


    // Draw yAxis and add tick marks along y-axis at interval of 5 with a $ sign
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
    
    // place .text() at (dx,dy), rotate by 90 degrees
    d3.select("g")
        .append("text")
        .attr("dx", -margin.left*1.5)
        .attr("dy", -margin.top*5.8)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Total Suicides");
    
});

d3.selectAll("input").on("change", function change(d) {
    year = this.value.toString();
    
    // update rectangular bars to represent the data.
    svg.selectAll("rect")                        // select all rectangles in our canvas
        .transition().duration(1000)             // set how long our transitions take to complete
        .delay(function(d,i) { return i * 200;}) // begin each transition .2 seconds after the last
        .attr("x", function(d) {                 // set x coord for each rectangle
            return xBandScale(d.age);            // map d.age to range specified by xBandScale
        })
        .attr("y", function(d) {                 // set y coord for each rectangle
            return yScale(d[year]);              // map d.suicide_rate to range specified by yScale
        })
        .attr("width", xBandScale.bandwidth())   // set the width of each rectangle
        .attr("height", function(d) {            // set the height of each rectangle
            return height - yScale(+d[year]);    // translate height into canvas coordinate system
        })
        .attr("fill", function(d) {     // use colorScale to set each rectangle fill relative to suicide_rate
            return colorScale(+d[year])
        });
    
    // Label the data
    svg.selectAll("#label")
        .transition().duration(1000)             // set how long our transitions take to complete
        .delay(function(d,i) { return i * 200;}) // begin each transition .2 seconds after the last
        .text(function(d){
            return d[year];
        })
        .attr("x", function(d){                                    // place each suicide_rate value at regular intervals
            return xBandScale(d.age)+(xBandScale.bandwidth())/2;   // along the x axis
        })
        .attr("y", function(d){                                    // place each suicide_rate value at the top of its
            return yScale(d[year])+suicideLabelOffsetY;            // corresponding rectangle
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
    
})
