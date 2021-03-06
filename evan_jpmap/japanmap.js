// Noriaki Nakano
// nnakano@ucsc.edu
// 1418185


var w = 300, h = 50;

var key = d3.select("#legend1")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var legend = key.append("defs")
  .append("svg:linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

legend.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#fee5d9")
  .attr("stop-opacity", 1);
  
legend.append("stop")
  .attr("offset", "25%")
  .attr("stop-color", "#fcae91")
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "50%")
  .attr("stop-color", "#fb6a4a")
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "75%")
  .attr("stop-color", "#de2d26")
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#a50f15")
  .attr("stop-opacity", 1);

key.append("rect")
  .attr("width", w)
  .attr("height", h - 30)
  .style("fill", "url(#gradient)")
  .attr("transform", "translate(0,10)");

var y = d3.scaleLinear()
  .range([300, 0])
  .domain([68, 12]);

var yAxis = d3.axisBottom()
  .scale(y)
  .ticks(5);

key.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,30)")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("axis title");

//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 },
    width = 960 - margin.left -margin.right,
    height = 960 - margin.top - margin.bottom;


//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//define projection values
var projection = d3.geoMercator()
    .scale(1500)
    .rotate([0.0,0.0,0.0])
    .translate([-3200, 1300]);

//define path
var path = d3.geoPath()
    .projection(projection);
   
//Japanese key conversion
var japanese_key = {
    "number" : "番号",
    "prefecture": "都道府県",
    "density": "密度",
    "populationdensity": "人口密度",
    "population":"合計",
    "male":"男",
    "female":"女",
   
    /*
    "prefecture" : "prefecture",
    "1960" : "1960",
    "1965" : "1965",
    "1970" : "1970",
    "1975" : "1975",
    "1980" : "1980",
    "1985" : "1985",
    "1990" : "1990",
    "1995" : "1995",
    "2000" : "2000",
    */
};

//Id conversion of geoJSON for Japan
var id_conversion = [
    23, 5, 2, 12, 38, 18, 40,
    7, 21, 10, 34, 1, 28, 8,
    17, 3, 37, 46, 14, 39, 43,
    26, 24, 4, 45, 20, 42, 29,
    15, 44, 33, 47, 27, 41, 11,
    25, 32, 22, 9, 36, 13, 31,
    16, 30, 6, 35, 19
];

// scale from blue -> green -> red
var color_scale = d3.scaleLinear()
    .range(['#fcae91', '#de2d26', '#a50f15']);
   
var data; // store data from CSV file

draw("populationdensity"); // initial call

function draw(type)
{// get CSV data and draw geoJSON
    svg.selectAll("*").remove();
    d3.csv("japan_" + type + ".csv", (e, d) => {
           
        data = d;

        // set up min, pivot, and max
        var min =  d3.min(d.map((v) => {
            return parseFloat(v[japanese_key[type]]);
        }));
       
        var mean = d3.mean(d.map((v) => {
            return parseFloat(v[japanese_key[type]]);
        }));
       
        var max = d3.max(d.map((v) => {
            return parseFloat(v[japanese_key[type]]);
        }));
       
        // set color scale domain
        color_scale.domain([
            min,
            mean,
            max   
        ]);

       
        d3.json("japan.json", (e, d) => {// load JSON file
       
            // draw GeoJSON
            svg.selectAll("path")
                .data(d.features)
                .enter()
                .append("path")
                .attr("d", (v)=> {return path(v);}) // send path value to append
                .attr("fill", (v, i) => color_scale(data[id_conversion[i] - 1][japanese_key[type]]))
                .attr("stroke", "#222");
               
        });
    });
   
   
}// End draw   

function change_data()
{// called when the selection gets changed
    draw(document.getElementById("data_select").value);
}// End change_data

