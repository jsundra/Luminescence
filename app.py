from flask import Flask, send_file, jsonify, request, abort
from DMX import DMX
import json

dmx = DMX.DMX()
app = Flask(__name__)

# TODO: Maintain file handle
with open('persistent/example.json') as json_file:
	data = json.load(json_file)


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

@app.route("/dimmer/", methods=['GET'])
def getDimmer():
	return jsonify(data['dimmers'])


@app.route("/dimmer/", methods=['POST'])
def setDimmer():
	addr = request.args.get('addr')
	level = request.args.get('level')
	name = request.args.get('name') # TODO: Handle empty as name removal

	if addr is not None and level is not None:
		print ("Dimmer %s @ %s" % (addr, level))
		rtn = dmx.setDimmer(int(addr), int(level))
		return jsonify(rtn)

	if addr is not None and name is not None:
		print ("Dimmer %s ~ %s" % (addr, name))
		saveAlias(addr, name)
		return jsonify(True)

def saveAlias(addr, name):
	# TODO: Throttle file I/O
	dimmers = data['dimmers']
	dimmer = dimmers.get(addr)

	if dimmer is None:
		dimmer = dimmers[addr] = {}
	dimmer['name'] = name

	with open('persistent/example.json', 'w') as output:
		json.dump(data, output)