import http from 'util/http';

export default {
	status() {
		return http.get('/status');
	},

	setDimmer(addr, level) {
		return http.get(`/dimmer/?addr=${addr}&level=${level}`);
	}
}