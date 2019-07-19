export module HTTP {

	export function Get<T>(url: string): Promise<T> {
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
		});
	}

	export function Post<T>(url: string, payload: any): Promise<T> {
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
			req.open('POST', url);
            req.setRequestHeader('Content-Type', 'application/json');
			req.send(JSON.stringify(payload));
		});
  	}
}
