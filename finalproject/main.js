
// when the html document is ready 
var viz_1;
var viz_2;
var tooltip;
var tooltip_2;

var slider;
var slider_text;

// called when body is loaded 
function main()
{	
	//load the containers
	viz_1 = d3.select("svg#viz_1");
	viz_2 = d3.select("svg#viz_2");
	tooltip = d3.select("svg#tooltip");		
	tooltip_2 = d3.select("svg#tooltip_2");		

	//load the slider 
	slider = document.getElementById("year_slider");
	slider_text = document.getElementById("year");
	
	//call creation function 
	create_tooltip();
}

