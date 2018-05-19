
/** Resources:
 **/

 // set up the SVG container 
var margin = {top: 50, right: 0, bottom: 0, left: 100},
    width = 840 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var current_name = "goldsteinPrice";
var current_n = 240;
var current_m = 125;
var current_div = 21;
var current_mult = 1;

var sample_data_functions = {
	goldsteinPrice: goldsteinPrice,
	beale: beale,
	booth: booth,
	bukin: bukin, 
	eggholder: eggholder,
	mccormick: mccormick
}

draw("goldsteinPrice", current_n, current_m, current_div, current_mult);
		
function change_name(value)
{
	current_name = value;
	draw(current_name, current_n, current_m, current_div, current_mult);
}
		
function change_n(value)
{
	current_n = value;
	document.getElementById("n_text").innerHTML = value;
	draw(current_name, current_n, current_m, current_div, current_mult);
}		

function change_m(value)
{
	current_m = value;
	document.getElementById("m_text").innerHTML = value;
	draw(current_name, current_n, current_m, current_div, current_mult);
}

function change_div(value)
{
	current_div = value;
	document.getElementById("div_text").innerHTML = value;
	draw(current_name, current_n, current_m, current_div, current_mult);
}

function change_mult(value)
{
	current_mult = value;
	document.getElementById("mult_text").innerHTML = value;
	draw(current_name, current_n, current_m, current_div, current_mult);
}
		
function draw(name, n, m, div, mult)
{// draws the contours with the inputs 
	
	svg.selectAll("*").remove();
	var values = new Array(n * m);
	for (var j = 0.5, k = 0; j < m; ++j) {
		for (var i = 0.5; i < n; ++i, ++k) {
			values[k] = sample_data_functions[name](i / n * 4 - 2, 1 - j / m * 3, mult);
		}
	}
	
	var thresholds = d3.range(1, div)
		.map((p) => Math.pow(2, p));

	var contours = d3.contours()
		.size([n, m])
		.thresholds(thresholds);

	var color_YlGnBu = d3.scaleLog()
		.domain(d3.extent(thresholds))
		.interpolate(() => d3.interpolateYlGnBu);
		
	var color_RdYlGn = d3.scaleLog()
		.domain(d3.extent(thresholds))
		.interpolate(() => d3.interpolateRdYlGn);
	
	var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
	
	console.log(values);
	console.log(contours(values));
	svg.selectAll("path")
		.data(contours(values))
		.enter().append("path")
			.attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)))
			.attr("fill", function(d) { return color_YlGnBu(d.value); });
	
}// End draw 
		
// See https://en.wikipedia.org/wiki/Test_functions_for_optimization
function goldsteinPrice(x, y, mult) 
{
	x *= mult;
	y *= mult;
	return (1 + Math.pow(x + y + 1, 2) * (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * x + 3 * y * y))
		* (30 + Math.pow(2 * x - 3 * y, 2) * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y));
}

function beale(x, y, mult)
{
	x *= mult;
	y *= mult;
	return Math.pow(1.5 - x + x * y, 2) + Math.pow(2.25 - x + x * Math.pow(y, 2),2) + Math.pow(2.625 - x + x * Math.pow(y,3),2);
}

function booth(x, y, mult)
{
	x *= mult;
	y *= mult;
	return Math.pow(x + 2 * y - 7, 2) + Math.pow(2 * x + y - 5, 2);
}

function bukin(x, y, mult)
{
	x *= mult;
	y *= mult;
	return 100 * Math.sqrt(Math.abs(y - 0.01*x*x)) + 0.01 * Math.abs(x + 10);
}

function eggholder(x, y, mult)
{
	x *= mult;
	y *= mult;
	return -1 * (y + 47) * Math.sin(Math.sqrt(Math.abs(x / 2 + y + 47))) - x * Math.sin(Math.sqrt(Math.abs(x - y + 47)));
}

function mccormick(x, y, mult)
{
	x *= mult;
	y *= mult;
	return Math.sin(x + y) + Math.pow(x - y, 2) - 1.5 * x + 2.5 * y + 1;
}

