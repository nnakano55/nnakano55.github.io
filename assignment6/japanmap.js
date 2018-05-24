// Noriaki Nakano 
// nnakano@ucsc.edu
// 1418185

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
	.translate([-3200, 1400]);

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
	"female":"女"
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
	.range(['#00F', '#0F0', '#F00']); 
	
var data; // store data from CSV file 

draw("populationdensity"); // initial call

function draw(type)
{// get CSV data and drwa geoJSON
	svg.selectAll("*").remove();
	d3.csv("japan_" + type + ".csv", (e, d) => {
	
		data = d;
		
		console.log(d);
		
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
		
		// init legend 
		var legend = svg.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "100%")
			.attr("x2", "100%")
			.attr("y2", "0%")
			.attr("spreadMethod", "pad");
		
		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#00F")
			.attr("stop-opacity", 1);
	
		legend.append("stop")
			.attr("offset", "50%")
			.attr("stop-color", "#0F0")
			.attr("stop-opacity", 1);

		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#F00")
			.attr("stop-opacity", 1);
		
		svg.append("rect")
			.attr("x", -10)
			.attr("y", -10)
			.attr("width",400)
			.attr("height", 200)
			.attr("fill", "lightgrey")
			.style("stroke-size", "1px");
			
		/*
		svg.append("circle")
			.attr("r", 20)
			.attr("cx", 30)
			.attr("cy", 30)
			.style("fill", color_scale(max));
		
		svg.append("circle")
			.attr("r", 20)
			.attr("cx", 30)
			.attr("cy", 90)
			.style("fill", color_scale(mean));

		svg.append("circle")
			.attr("r", 20)
			.attr("cx", 30)
			.attr("cy", 150)
			.style("fill", color_scale(min));
		*/
		//draw legend text
		svg.append("text")
			.attr("class", "label")
			.attr("x", 80)
			.attr("y", 13)
			.style("text-anchor", "start")
			.text("maximum: " + max.toFixed(1) + (type == "populationdensity" ? " people/kilometer^2" : " people"));

		svg.append("text")
			.attr("class", "label")
			.attr("x", 80)
			.attr("y", 95)
			.style("text-anchor", "start")
			.text("mean: " + mean.toFixed(1) + (type == "populationdensity" ? " people/kilometer^2" : " people"));

		svg.append("text")
			.attr("class", "label")
			.attr("x", 80)
			.attr("y", 175)
			.style("text-anchor", "start")
			.text("minimum: " + min.toFixed(1) + (type == "populationdensity" ? " people/kilometer^2" : " people"));
		
		//draw gradient 
		svg.append("rect")
			.attr("width", 50)
			.attr("height", 180)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,0)");
		
	});
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
}// End draw	

function change_data()
{// called when the selection gets changed 
	draw(document.getElementById("data_select").value);
}// End change_data
