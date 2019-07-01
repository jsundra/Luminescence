from flask import Flask
from flask import send_file
from flask import jsonify
from flask import request
from flask import abort

from DMX import DMX

dmx = DMX.DMX()


app = Flask(__name__)

@app.route("/")
def index():
	return send_file("dist/index.html")

@app.route("/<file>")
def dist(file):
	try:
		return send_file("dist/%s" % file)
	except FileNotFoundError:
		abort(404)
	

@app.route("/status")
def getStatus():
	return jsonify({ 'connection': dmx.isConnected() })

@app.route("/dimmer/")
def setDimmer():
	addr = int(request.args.get('addr'));
	level = int(request.args.get('level'));

	print ("Dimmer %s @ %s" % (addr, level))

	rtn = dmx.setDimmer(addr, level)
	return jsonify(rtn)