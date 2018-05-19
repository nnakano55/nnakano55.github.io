// main.js 

function body_ready()
{// only start code when the document is fully loaded  
	load();
}// End body_ready

function load()
{// load the div#container with the information from the csv file 
	d3.csv("food.csv", (data) => {
		d3.select("div#container")
			.selectAll("p")
			.data(data)
			.enter()
			.append("p")
			.text((d) => (d.Food + ": " + d.Deliciousness))
			.style("color", (d) => (d.Deliciousness <= 5 ? "blue" : "red"));			
	});
}// End load 

