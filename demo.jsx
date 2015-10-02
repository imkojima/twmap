		TWMap('north');
		
		var map_select = d3.select('#map-control').append('select')
        .on('change', function() {
            var selectedIndex = map_select.property('selectedIndex');
            if (selectedIndex < 0)
                return false;
            var d = map_options[0][selectedIndex].__data__;

            TWMap(d.code);
		});

        var map_data = [
			{
				'title': '北部',
				'code': 'north'
			},
			{
				'title': '中部',
				'code': 'middle'
			},
			{
				'title': '南部',
				'code': 'south'
			},
			{
				'title': '東部',
				'code': 'east'
			},
			{
				'title': '澎湖',
				'code': 'Penghu'
			},
			{
				'title': '金門',
				'code': 'Kinmen'
			},
			{
				'title': '馬祖',
				'code': 'Matsu'
			},
			{
				'title': '全國',
				'code': 'taiwan'
			}
		];

		var map_options = map_select.selectAll('option.abc').data(map_data)
            .enter().append('option').text(function(d) {
                return d.title;
            });