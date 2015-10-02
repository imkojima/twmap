var TWMap = function(part){

	var out_data;
	var metadata;
	var density ={};
	var part = part;
	var container = document.getElementById('map');
	
	container.style.height = 280 +'px';
	container.style.width = 290 +'px';

	if ( d3.select('#tooltip').empty() )
		d3.select('body').append('div')
			.attr('id','tooltip')
			.attr('class','hidden')
			.append('p')
			.html('<span id="title"></span><br/>(<span id="value"></span>人)');


	d3.json("./map/meta.json", function(error, meta){
		metadata = meta;
		if (error) console.log(error);
		//elbase
		d3.json("./map/countyChange.json", function(error, ret){
			if (error) console.log(error);
			ret.forEach(function(e,i,a){
				density[e.countyName] = Math.floor(e.change);
			});
			displayMap('./map/geojson/country.json', part)
		});
	});

	function displayMap(jsonFile, part) {
		var container = document.getElementById('map');
		var width  = container.offsetWidth;
		var height = container.offsetHeight;
		var color = d3.scale.linear()
		.domain([-5000, 0, 18174])
		.range(["#660000", "#FFFFFF","#006600"]);
		
		d3.select('#map svg').remove();

		var svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);
			
		var taiwanMapGroup = svg.append('g');

		// 投影模式
		var projection = d3.geo.mercator()
						.scale(5500) // 地圖放大比率
						.center([120.9, 24.1]) //longitude, latitude
						.translate([width / 2, height / 2]); 
		var path = d3.geo.path().projection(projection);

		// 讀取地圖 JSON
		d3.json(jsonFile, function(error, taiwan) {
			out_data = taiwan;

			if (error) console.log(error);

			// taiwan.features.forEach(function(e,i,a){
			// 	e.properties.density = Math.floor(Math.random()*100);
			// });


			switch(part){
				case 'north':
					// North
					projection.center([121.3, 24.75]);
					projection.scale(10000);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '臺北市' ||
								d.properties.C_Name === '新北市' ||
								d.properties.C_Name === '基隆市' ||
								d.properties.C_Name === '桃園市' ||
								d.properties.C_Name === '新竹市' ||
								d.properties.C_Name === '新竹縣' ||
								d.properties.C_Name === '苗栗縣')
								return true;
					});
				break;

				case 'middle':
					// Middle
					projection.center([120.7, 23.9]);
					projection.scale(10000);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '臺中市' ||
								d.properties.C_Name === '彰化縣' ||
								d.properties.C_Name === '彰化市' ||
								d.properties.C_Name === '雲林縣' ||
								d.properties.C_Name === '南投縣')
								return true;
					});
				break;

				case 'south':
					// South
					projection.center([120.5, 22.7]);
					projection.scale(7000);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '嘉義縣' ||
								d.properties.C_Name === '嘉義市' ||
								d.properties.C_Name === '臺南市' ||
								d.properties.C_Name === '高雄市' ||
								d.properties.C_Name === '屏東縣')
								return true;
					});
				break;

				case 'east':
					// East
					projection.center([121.25, 23.7]);
					projection.scale(5000);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '宜蘭縣' ||
								d.properties.C_Name === '花蓮縣' ||
								d.properties.C_Name === '臺東縣')
								return true;
					});
				break;

				case 'Penghu':
					projection.center(metadata['澎湖縣'].center);
					projection.scale(30000);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '澎湖縣')
								return true;
					});
					break;
				case 'Kinmen':
					projection.center(metadata['金門縣'].center);
					projection.scale(metadata['金門縣'].scale);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '金門縣')
								return true;
					});
					break;
				case 'Matsu':
					projection.center(metadata['連江縣'].center);
					projection.scale(metadata['連江縣'].scale);
					var selectedMap = taiwan.features.filter(function(d){
							if (d.properties.C_Name === '連江縣')
								return true;
					});
					break;

				case 'taiwan':
				default:
					var selectedMap = taiwan.features;
					projection.scale(3000);
				break;
			}
			// Path
			taiwanMapGroup.selectAll('path')
				.data(selectedMap)
				.enter()
				.append('path')
				.attr("stroke", '#000')
				.attr('stroke-width', 1)
				.attr('d', path)
				.on('mouseover', function(data, i) {
					d3.select(this).attr('fill', 'teal');

					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.event.pageX);
					var yPosition = parseFloat(d3.event.pageY);

					//Update the tooltip position and value
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")						
						.select("#value")
						.text(function(){
							return d3.format("+")(density[data.properties.C_Name]);
						});

					d3.select("#tooltip").select("#title")
						.text(function(){
							if(data.properties.T_Name != undefined)
								return data.properties.T_Name;
							return data.properties.C_Name;
						});
			   
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
				})
				.on('mouseout', function(data, i) {
					d3.select(this).attr('fill', function(data, i){
						if(data.properties.T_Name != undefined)
							return color(density[data.properties.T_Name]);
						else
							return color(density[data.properties.C_Name]);
					});
					d3.select("#tooltip").classed("hidden", true);
					//d3.select(this).attr('fill', '#FFF');
				})
				.attr('fill', '#FFF')
				.transition()
				.delay(function(data,i){ 
					return (i-d3.keys(taiwan.features)[0])*1500/d3.keys(taiwan.features).length;
				})
				.duration(500)
				.attr('fill', function(data, i){
					if(data == undefined)
						return "#FFF";
					else{
						if(data.properties.T_Name != undefined)
							return color(density[data.properties.T_Name]);
						else
							return color(density[data.properties.C_Name]);
					}
				}); 
		});
	}

}