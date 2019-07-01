module.exports = {
	get: function(url) {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			
			req.onreadystatechange = () => {
				if (req.readyState !== 4) return;

				if (req.status >= 200 && req.status < 300) {
					resolve(JSON.parse(req.response));
				} else {
					reject({
						status: req.status,
						message: req.statusText
					});
				}
			};
			req.open('GET', url);
			req.send();
		})
	},
	
	post: function(url) {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			
			req.onreadystatechange = () => {
				if (req.readyState !== 4) return;

				if (req.status >= 200 && req.status < 300) {
					resolve(req.response);
				} else {
					reject({
						status: req.status,
						message: req.statusText
					});
				}
			};
			req.open('POST', url);
			req.send();
		})
	}
}