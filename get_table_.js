const https = require('https');

let promise = new Promise((resolve, reject) => {

  https.get('https://w3.unece.org/PXWeb/en/Table?IndicatorCode=12', (response) => {
	  let data = '';

	  response.on('data', (chunk) => {
		data += chunk;
	  });

	  response.on('end', () => {
	    let q = document.getElementById("idDiv");
		if (q == null) {
			q = document.createElement('div');
			q.setAttribute('id', 'idDiv');
			document.body.append(q);
		}
		
		let regexpTable = /class="sortable".*?<\/table>/s;
		let match = regexpTable.exec(data);
		
		arrayTable = getArrayFromTable(match);
		resolve();
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	  reject(new Error("Can't get data! " + err.message));
	});

});

