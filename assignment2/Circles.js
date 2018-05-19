
// data of all the circles  
var circles = [
	{cx: 25, cy: 25, r: 22, fill: "yellow", stroke: "orange", stroke_width: 5, opacity: 1},
	{cx: 25, cy: 175, r: 20, fill: "rgba(128, 0, 128, 0.75)", stroke: "rgba(0, 255, 0, 0.25)", stroke_width: 10, opacity: 1},
	{cx: 75, cy: 175, r: 20, fill: "rgba(0, 255, 0, 0.75)", stroke: "rgba(0, 0, 255, 0.25)", stroke_width: 10, opacity: 1},
	{cx: 125, cy: 175, r: 20, fill: "rgba(255, 255, 0, 0.75)", stroke: "rgba(255, 0, 0, 0.25)", stroke_width: 10, opacity: 1},
	{cx: 325, cy: 175, r: 20, fill: "purple", stroke: "green", stroke_width: 10, opacity: 0.9},
	{cx: 365, cy: 175, r: 20, fill: "green", stroke: "blue", stroke_width: 10, opacity: 0.5},
	{cx: 405, cy: 175, r: 20, fill: "yellow", stroke: "red", stroke_width: 10, opacity: 0.1}
];

// data of all the rectangles 
var rectangles = [
	{x: 300, y: 0, width: 30, height: 30, fill: "purple"},
	{x: 320, y: 5, width: 30, height: 30, fill: "blue"},
	{x: 340, y: 10, width: 30, height: 30, fill: "green"},
	{x: 360, y: 15, width: 30, height: 30, fill: "yellow"},
	{x: 380, y: 20, width: 30, height: 30, fill: "red"}

];

function body_ready()
{// called when the body is ready 
	
	d3.select("#container")
		.append("svg");
	
	var canvas = d3.select("svg") // append svg 
		.attr("width", 600)
		.attr("height", 400);
		
	canvas.selectAll("circle") // draw circles 
		.data(circles)
		.enter()
		.append("circle")
			.attr("cx", (d) => d.cx)
			.attr("cy", (d) => d.cy)
			.attr("r", (d) => d.r)
			.attr("fill", (d) => d.fill)
			.attr("stroke", (d) => d.stroke)
			.attr("stroke-width", (d) => d.stroke_width)
			.attr("opacity", (d) => d.opacity);
			
	canvas.selectAll("rect") // draw rectanges 
		.data(rectangles)
		.enter()
		.append("rect")
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("width", (d) => d.width)
			.attr("height", (d) => d.height)
			.attr("fill", (d) => d.fill);
	
}// End body_ready

