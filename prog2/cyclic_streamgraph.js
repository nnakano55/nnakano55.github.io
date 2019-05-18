var size = 5; 
var sample_size = 200; 
var average_size = 10; 
var bump_percent = 0.5;
var width = 750;
var height = 750;			
var outerRadius = 30 * size
var innerRadius = 250;

function main()
{ // main() 	
	render();
}// End main 

function render()
{// renders the cyclic stream graph with the global variables 
	var new_data = create_data(size, sample_size, average_size, bump_percent);
	var keys = get_keys(size);
	new_data.push(cyclic_data(new_data));
	
	var angle = d3.scaleTime()
		.domain([0, new_data.length - 1])
		.range([0, 2 * Math.PI]);
			
	var radius = d3.scaleLinear()
		.domain([0, find_max(new_data)])
		.range([innerRadius, outerRadius]);
	
	var z = d3.scaleOrdinal(d3.schemeCategory20)
		.domain(keys);
			
	var stack = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetSilhouette);
	
			
	var radial_area = d3.radialArea()
		.angle((d, i) => angle(i))
		.innerRadius((d) => radius(d[0]))
		.outerRadius((d) => radius(d[1]))
		.curve(d3.curveBasis);
				
	var canvas = d3.select('body')
		.append('svg')
		.attr('width', width)
		.attr('height', height);
			
	var group = canvas.append('g');
	
	var layer = group.selectAll('.layer')
		.data(stack(new_data))
		.enter().append('g')
			.attr('class', 'layer')
			.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
			
	layer.append('path') 
		.attr('class', 'area')
		.style('fill', (d) => z(d.key))
		.attr('d', radial_area);
	
}// End render 

function cyclic_data(d)
{ // cyclize the data 
	var ret = JSON.parse(JSON.stringify(d[0]));
	ret.time = d.length;
	return ret;
} // End cyclic_data 

function create_data(size, samples, average, bump_p)
{// function that returns the final array structure 
	return d3.range(samples).map((i) => create_obj(i, size, average, bump_p));
}// End create_data 

function create_obj(index, size, average, bump_p)
{ // function that returns the object with the time and data 
	var push  = '{ "time":' + index + ',';
	var max = 0;
	for(var i = 0; i < size; i++)
	{
		var temp = generate_random(average, bump_p);
		push += '"dat_' + i + '":' + temp + ',';
		if(temp > max)
			max = temp;
		if(i == size - 1)
		{
			push += '"max":' + max + '}';
		}
	}
	return JSON.parse(push);
}// End create_obj

function generate_random(average, bump_p)
{// generates a random number with the bump percentage 
	var val = Math.random() * 2 * average;
	if(Math.random() <= bump_p)
		val += Math.random() * 2 * average;
	return val;
}// End generate_random  

function get_keys(size)
{ // returns the keys of the data 
	return d3.range(size).map((i) => {return 'dat_' + i;});
} // End get_keys 


function find_max(d)
{
	var max = 0;
	for(var i = 0; i < d.length; i++)
	{
		if(d[i].max > max)
			max = d[i].max;
	}
	return max;
}