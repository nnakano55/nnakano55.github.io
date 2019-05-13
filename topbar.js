/* 
 * Noriaki Nakano
 * topbar.js
 * script animates when top bar and top button at the button is clicked
 */


function main()
{
	// animate .topbar links 
	$(".topbar").click((e) => {
		if(e.target.id != "")
			$("html, body").animate({scrollTop: $("div#" + e.target.id).offset().top - 30}, 500);
		else
			$("html, body").animate({scrollTop: $("body").offset().top}, 500);
	});

}// End main