var request = require("request"),
	cheerio = require("cheerio"),
	url = "http://www.bbc.co.uk/sport/football/premier-league/fixtures";
	
var clean = function(inp) {
	return inp.replace(/\s+/g, " ");
};

request(url, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body),
			fixtures_data = $("#fixtures-data h2, #fixtures-data table");
			
		console.log("We've got " + fixtures_data.length + " elements present!");

		var fixtures = [];
		var date, data, games;

		// Loop through all data elements
		fixtures_data.each(function (i, element) {
			// Get the date
			if(element.name === 'h2') {
				date = clean($(element).text());
			// Fixtures for date
			} else {
				// Get all games 
				games = $('tr', element);
				// Loop through games
				games.each(function (i, element) {
					data = {
						date : date,
						time : clean($('.kickoff', element).text()),
						home : clean($('.team-home a', element).text()),
						away : clean($('.team-away a', element).text())
					};
					data.utc = data.date + data.time + 'BST';
					fixtures.push(data);
				});
			}
		});

		console.log(fixtures);

	} else {
		console.log("We’ve encountered an error: " + error);
	}
});