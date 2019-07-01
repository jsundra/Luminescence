import usb
import time

cmd_SetSingleChannel = 1
cmd_SetChannelRange = 2
bmRequestType = usb.util.CTRL_TYPE_VENDOR | usb.util.CTRL_RECIPIENT_DEVICE | usb.util.CTRL_OUT

class DMX:
	def __init__(self):
		self.__conn = usb.core.find(idProduct=0x05dc)
		self.__lastUpdate = time.time() * 1000
		print ("uDMX: %s" % (self.__conn))

	def isConnected(self):
		return self.__conn is not None

	def setDimmer(self, addr, level):
		return self.sendSingle(addr, round(level / 100 * 255))

	def sendSingle(self, addr, level):
		if self.__conn is not None:
			now = time.time() * 1000
			timeSince = now - self.__lastUpdate

			if timeSince < 33:
				print ("Busy!!! %s" % (timeSince))
				return True

			self.__conn.ctrl_transfer(bmRequestType, cmd_SetSingleChannel, wValue=level, wIndex=addr, data_or_wLength=1)
			self.__lastUpdate = now
			return True
		else:
			return False