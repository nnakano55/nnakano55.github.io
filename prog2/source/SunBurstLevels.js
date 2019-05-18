class Node
{
	constructor(data, next, prev)
	{
		this.data = data;
		this.next = next;
		this.prev = prev;
		this.next_vector = normalize(1, next - data);
		this.prev_vector = normalize(1, data - prev);
		this.current_vector = normalize(1 + 1, (next - data) + (data - prev));
	}
	
	normalize(x, y)
	{
		var temp = sqrt(x * x + y * y)
		return [x/temp, y/temp];
	}
	
	
}




class InterpolatedGraph
{

	constructor(data, density)
	{
		this.data = data;
		this.density = density;
		this.data_interpolated = new Array(data.length * density);
		this.compute_data();
	}
	
	compute_data()
	{
		for(var i = 0; this.data.length; i++)
		{
			
			var vec = interpolate_vector(this.data[i], this.data[i + 1], density);
			
			for(var j = 0; j < density; j++)
			{
				
			}
		}
	}
	
	interpolate_vector(node, next_node, density)
	{
		var interp_vec = new Array(density);
		interp_vep[0] = node.current_vector;
		interp_vep[density - 1] = next_node.current_vector;
		if()
			
		
	}
	

	
	
	
	
	
	
	static parseJSON(json)
	{
		return json.data;
	}
}

