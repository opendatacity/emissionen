// inspired by http://bost.ocks.org/mike/treemap/

var language = "de";
var appLink = "";
var config = {
	"description": {
		"de": "Die Größe der Flächen zeigt den Kohlendioxid-Ausstoß durch die Nutzung fossiler Brennstoffe im Jahr 2013. Die Farbe steht für die Veränderung seit 1990. Klicken Sie auf die Kontinente, um sich alle Länder des ausgewählten Erdteils anzeigen zu lassen. Klicken Sie dann auf ein Land, um sich anzusehen, wie sich dessen Emissionen auf die Energiequellen verteilen.",
		"en": "An area’s size shows the carbon emissions caused by the use of fossil fuels in 2013. The colours resemble the change in carbon emissions since 1990. In order to see the emissions caused by individual countries, click on the continent in which the country is located. Clicking on an individual country will then show you the emissions broken down to the different energy sources. "
	},
	"title": {
		"de": "C02-Emissionen weltweit",
		"en": "Global CO2 emissions"
	},
	"headline":{
		"de": "CO<sub>2</sub>-Emissionen weltweit",
		"en": "Global CO2 Emission"
	},
	"tooltip":{
		"change":{
			"de": "Veränderung",
			"en": "Change"
		},
		"tonLabel":{
			"de": "Millionen Tonnen",
			"en": "million tons"
		},
		"percentLabel":{
			"de": "Prozent",
			"en": "Percent"
		},
	},
	"embed":{
		"de": "Zum Einbetten in andere Seiten kopieren Sie bitte den folgenden HTML-Code.",
		"en": "To embed this in other websites, please copy the following code snippet.",
		"code": '&lt;iframe width="800" height="930" src="$SRC$" frameborder="0"&gt;&lt;/iframe&gt;'
	},
	"share":{
		"facebook": "https://www.facebook.com/sharer/sharer.php?u=",
		"twitter": "https://twitter.com/home?status=",
		"google": "https://plus.google.com/share?url="
	},
	"baseUrl": {
		"de": "http://www.iwkoeln.de/__extendedmedia_resources/251924/index.html",
		"en": "http://www.iwkoeln.de/en/iw-news/beitrag/climate-policy-not-without-asia-253428"
	},
	"logolink": {
		"de": "http://www.iwkoeln.de/",
		"en": "http://www.iwkoeln.de/en/"
	},
	"backlink": {
		"de": "klicken für: ",
		"en": "click to return to: "
	},
	"scaletitle":{
		"de": "Veränderung der CO<sub>2</sub>-Emissionen 1990 bis 2013 in Prozent",
		"en": "Change of CO<sub>2</sub> emissions from 1990 to 2013 in percent"
	},
	"source":{
		"de": "Quelle: Internationale Energieagentur",
		"en": "Source: International Energy Agency"
	},
	"numberFormats": {
		"de": {
			delimiters: {
				thousands: '.',
				decimal: ','
			},
			abbreviations: {
				thousand: 'k',
				million: 'm',
				billion: 'b',
				trillion: 't'
			},
			ordinal: function (number) {
				return '.';
			},
			currency: {
				symbol: '€'
			}
		},
		"en": {
			delimiters: {
				thousands: ',',
				decimal: '.'
			},
			abbreviations: {
				thousand: 'k',
				million: 'm',
				billion: 'b',
				trillion: 't'
			},
			ordinal: function (number) {
				var b = number % 10;
				return (~~ (number % 100 / 10) === 1) ? 'th' :
					(b === 1) ? 'st' :
						(b === 2) ? 'nd' :
							(b === 3) ? 'rd' : 'th';
			},
			currency: {
				symbol: '£'
			}
		}

	}
};


var winWidth = document.getElementById("chart").style.width = $(window).width();


function isMobile() { return ('ontouchstart' in document.documentElement); }


jQuery(document).ready(function($){
	language = (window.location.search.length > 0) ? window.location.search.substring(1).toLowerCase() : language;

	numeral.language(language, config.numberFormats[language]);
	numeral.language(language);

	appLink = config.baseUrl[language];

	d3.select('.description').html(config.description[language]);
	d3.select('title').html(config.title[language]);
	d3.select('#headline').html(config.headline[language]);
	d3.select('#scaletitle').html(config.scaletitle[language]);
	d3.select('.source').html(config.source[language]);

	d3.select('#embedHowTo').html(config.embed[language]);
	d3.select('#embedCode').html(config.embed.code.replace('$SRC$',appLink));

	d3.select('#fbshare').attr('href',  config.share.facebook + config.baseUrl[language]);
	d3.select('#twshare').attr('href',  config.share.twitter + encodeURI(config.title[language]  + " - " + config.baseUrl[language]));
	d3.select('#gpshare').attr('href',  config.share.google + config.baseUrl[language]);

	d3.select('#logolink').attr('href', config.logolink[language]);

});


var margin = {top: 28, right: 0, bottom: 0, left: 0},
	width = winWidth - 16,
	height = winWidth * 0.63 - margin.top - margin.bottom,
	formatNumber = d3.format(",d"),
	transitioning;

var x = d3.scale.linear()
	.domain([0, width])
	.range([0, width]);

var y = d3.scale.linear()
	.domain([0, height])
	.range([0, height]);

var treemap = d3.layout.treemap()
	.children(function(d, depth) {
		return depth ? null : d._children; })
	.value(function(d){
		if(d.value) {
			//console.log(d.name.de, d["1990"], d.change, d.value);
			return d.value["2013"];
		} else {
			console.error("no value found");
		}
	})
	.sort(function(a, b) {return a.value - b.value; })
	.ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
	.round(false);


var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.bottom + margin.top)
	.style("margin-left", -margin.left + "px")
	.style("margin.right", -margin.right + "px")
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.style("shape-rendering", "crispEdges");

var topLevelTrigger = svg.append("g")
	.attr("class", "topLevelTrigger");

topLevelTrigger.append("rect")
	.attr("y", -margin.top)
	.attr("width", width)
	.attr("height", margin.top);

topLevelTrigger.append("text")
	.attr("x", 6)
	.attr("y", 6 - margin.top)
	.attr("dy", ".75em");


d3.json("data/emissions.json", function(root) {
	initialize(root);
	accumulate(root);
	layout(root);
	display(root);

	var mousemove = function(d) {
		if (!isMobile()) {

			var xPosition = d3.event.pageX + 5;
			var yPosition = d3.event.pageY + 5;

			if(width - xPosition < 260){
				xPosition = xPosition - 250;
			}

			if(d.change === undefined) {
				return;
			} else {
				var oldValue = numeral(d["1990"]).format('0,000.0');
				var newValue = numeral(d.value).format('0,000.0');
				var change = numeral(d.change).format('0,000.0');

				if(oldValue == "0,0") {
					oldValue = "-";
				}
				if(newValue == "0,0") {
					newValue = "-";
				}
				if(change == "0,0") {
					change = "-";
				}

				d3.select("#tooltip")
					.style("left", xPosition + "px")
					.style("top", yPosition + "px");
				d3.select("#tooltip #heading")
					.text(d.name[language]);
				d3.select("#tooltip #ttChange")
					.text(config.tooltip.change[language] + ": " + change + ' ' + config.tooltip.percentLabel[language]);
				d3.select("#tooltip #ttValue")
					.text("2013: " + newValue + ' ' +  config.tooltip.tonLabel[language]);
				d3.select("#tooltip #tt1990")
					.text("1990: " + oldValue + ' ' +  config.tooltip.tonLabel[language]);
				d3.select("#tooltip").classed("hidden", false);
			}
		} else {
			return
		}
	};

	var mouseout = function() {
		d3.select("#tooltip").classed("hidden", true);
	};

	d3.select('.menu').style('width',width + 'px');


	function initialize(root) {
		root.x = root.y = 0;
		root.dx = width;
		root.dy = height;
		root.depth = 0;
	}

	function accumulate(d){

		return (d._children = d.children)
			? d.value["2013"] = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
			: d.value["2013"];
	}

	function layout(d) {
		if (d._children) {
			treemap.nodes({_children: d._children});
			d._children.forEach(function(c) {
				c.x = d.x + c.x * d.dx;
				c.y = d.y + c.y * d.dy;
				c.dx *= d.dx;
				c.dy *= d.dy;
				c.parent = d;
				layout(c);
			});
		}
	}

	function display(d) {
		topLevelTrigger
			.datum(d.parent)
			.on("click", transition)
			.select("text")
			.text(name(d));

		var g1 = svg.insert("g", ".topLevelTrigger")
			.datum(d)
			.attr("class", "depth");

		var g = g1.selectAll("g")
			.data(d._children)
			.enter().append("g");

		g.filter(function(d) { return d._children; })
			.classed("children", true)
			.on("click", transition);

		g.selectAll(".child")
			.data(function(d) {
				//console.log(d.parent);
				//console.log(d.children);
				return d._children || [d];
			})
			.enter().append("rect")
			//.attr("class", "child")
			.attr("class", function(d){

				if(d.change == 0 || d.change == 0.0 || d.change == undefined){
					return "child neutral";
				}

				//var colorRange = d3.scale.linear().domain([-100, 100]).range([0,8]);
				//var colorCat = colorRange(d.change);
								
				var cls = "child";
				if(d.change <= -75){
					cls += " one";
				}else if(d.change <= -50) {
					cls += " two";
				}else if(d.change <= -25) {
					cls += " three";
				}else if(d.change <= 0) {
					cls += " four";
				}else if(d.change <= 25) {
					cls += " five";
				}else if(d.change <= 50) {
					cls += " six";
				}else if(d.change <= 75) {
					cls += " seven";
				}else if(d.change <= 100 || d.change > 100) {
					cls += " eight";
				}
				return cls;
			})
			.call(rect)
			.on("mousemove", mousemove)
			.on("mouseout", mouseout);

		g.append("rect")
			.attr("class", "parent")
			.call(rect)
			.on("mousemove", mousemove)
			.on("mouseout", mouseout)
			.append("title")
			.text(function(d) { return formatNumber(d.value); });

		g.append("text")
			.attr("dy", ".75em")
			.attr("class", "h2")
			.text(function(d) {
				var name = d.name[language];

				if((d.parent.value / d.value) > 300) {
					name = "";
				} else if((d.parent.value / d.value) > 100) {
					name = d.name.ioc;
				}

				return name;
			})
			.call(text);

		function transition(d) {
			if (transitioning || !d) return;
			transitioning = true;

			var g2 = display(d),
				t1 = g1.transition().duration(750),
				t2 = g2.transition().duration(750);

			// Update the domain only after entering new elements.
			x.domain([d.x, d.x + d.dx]);
			y.domain([d.y, d.y + d.dy]);

			// Enable anti-aliasing during the transition.
			svg.style("shape-rendering", null);

			// Draw child nodes on top of parent nodes.
			svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

			// Fade-in entering text.
			g2.selectAll("text").style("fill-opacity", 0);

			// Transition to the new view.
			t1.selectAll("text").call(text).style("fill-opacity", 0);
			t2.selectAll("text").call(text).style("fill-opacity", 1);
			t1.selectAll("rect").call(rect);
			t2.selectAll("rect").call(rect);

			// Remove the old node when the transition is finished.
			t1.remove().each("end", function() {
				svg.style("shape-rendering", "crispEdges");
				transitioning = false;

				// check for too large texts
				d3.selectAll('text.h2')
					.style('display', function(d){
						var rect = $(this.parentNode).find('rect.parent')[0];
						if(this.getBBox().width > rect.getBBox().width){
							if(d.name.ioc) $(this).text(d.name.ioc);
							if(this.getBBox().width > rect.getBBox().width){
								return 'none';
							}
						 }

						return 'block';

					});

			});
		}

		return g;
	}

	function text(text) {
		text.attr("x", function(d) { return x(d.x) + 6; })
			.attr("y", function(d) { return y(d.y) + 6; });
	}

	function rect(rect) {
		rect.attr("x", function(d) { return x(d.x); })
			.attr("y", function(d) { return y(d.y); })
			.attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
			.attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
	}

	function name(d) {
		return d.parent
			? d.name[language] + ' - ' + config.backlink[language] + (d.parent.name[language])
			: d.name[language];
	}
});