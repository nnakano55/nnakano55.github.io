
var fruits = [
	 {
		 kind: "grape",
		 color: "red",
		 quantity: 12,
		 tasty: true
	 },
	 {
		 kind: "kiwi",
		 color: "brown",
		 quantity: 98,
		 tasty: true
	 },
	 {
		 kind: "banana",
		 color: "yellow",
		 quantity: 0,
		 tasty: true
	 }
];

function body_ready()
{
	for(var i = 0; i < fruits.length; i++)
	{
		d3.select("#container")
			.append("div")
			.text(fruits[i].quantity + " " + fruits[i].kind)
			.style("color", fruits[i].color);
	}
}
