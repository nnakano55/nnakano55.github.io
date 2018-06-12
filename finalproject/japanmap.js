// Noriaki Nakano
// nnakano@ucsc.edu
// 1418185

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

var order_conversion = [
  "Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata",
  "Fukushima","Ibaraki","Tochigi","Gunma","Saitama","Chiba",
  "Tokyo","Kanagawa","Niigata","Toyama","Ishikawa","Fukui",
  "Yamanashi","Nagano","Gifu","Shizuoka","Aichi","Mie","Shiga","Kyoto",
  "Osaka","Hyogo","Nara","Wakayama","Tottori","Shimane","Okayama",
  "Hiroshima","Yamaguchi","Tokushima","Kagawa","Ehime","Kōchi","Fukuoka",
  "Saga","Nagasaki","Kumamoto","Oita","Miyazaki","Kagoshima","Okinawa"
];

// scale from blue -> green -> red
var color_scale = d3.scaleLinear()
    .range(['#fcae91', '#de2d26', '#a50f15']);

//define projection values
var projection = d3.geoMercator()
    .scale(1000)
    .rotate([0.0,0.0,0.0])
    .translate([-2000, 900]);

  //define path
var path = d3.geoPath()
    .projection(projection);

var data;

var year_key;

function declare_map()
{
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


  /*
  d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  */
  d3.csv("src/suicide_rate_prefecture.csv", (e, d) => {
    data = d;       
    console.log(d);
	   year_key = {};

    data.forEach((d, i) => {
      year_key[d.year] = i;
    });

   var year_data = new Array();

   for(var i=0; i < order_conversion.length; i++)
   {
      year_data.push(data[year_key[2007]][order_conversion[i]]);
   }
   console.log(year_data);
	 // set up min, pivot, and max
    var min =  d3.min(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    var mean = d3.mean(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    var max = d3.max(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    // set color scale domain
    color_scale.domain([
        min,
        mean,
        max   
    ]);
        //Define Tooltip here
    var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);
	
	d3.json("src/japan.json", (e, d) => {// load JSON file
   
        // draw GeoJSON
        viz_1.selectAll("path")
            .data(d.features)
            .enter()
            .append("path")
            .attr("d", (v)=> {return path(v);}) // send path value to append
            .attr("fill", (v, i) => color_scale(year_data[id_conversion[i] - 1]))
            .attr("stroke", "#222")
            .on("mouseover", (d,i)=> {
                div.transition()    
                  .duration(100)    
                  .style("opacity", .9);    
                div.html(
                    order_conversion[id_conversion[i] - 1] + " Prefecture<br/>" +
                    "Suicide rate: " + year_data[id_conversion[i] - 1]
                  ) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
            }).on("mouseout", function(d) {   
                div.transition()    
                  .duration(250)    
                  .style("opacity", 0); 
            });
    });
	//draw_map(1960);
  });

  viz_1.append("text")
      .attr("dx", 400)
      .attr("dy", 450)
      .attr("text-anchor", "middle")
      .attr("id","japan_map")
      .text("Suicide by Prefecture: " + 2007)

}

function draw_map(year)
{// get CSV data and draw geoJSON
   var year_data = new Array();

   for(var i=0; i <= order_conversion.length; i++)
   {
      year_data.push(data[year_key[year]][order_conversion[i]]);
   }


    // set up min, pivot, and max
    var min =  d3.min(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    var mean = d3.mean(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    var max = d3.max(year_data.map((v) => {
        return parseFloat(v);
    }));
   
    // set color scale domain
    color_scale.domain([
        min,
        mean,
        max   
    ]);
	
	viz_1.selectAll("path")
		.transition().duration(100)             // set how long our transitions take to complete
        .delay(function(d,i) { return 100;})
		.attr("fill", (d,i) => color_scale(year_data[id_conversion[i] - 1]));

    viz_1.select("text#japan_map")
    .text("Suicide by Prefecture: " + year);   
   
}// End draw   

function change_data()
{// called when the selection gets changed
    draw(document.getElementById("data_select").value);
}// End change_data

