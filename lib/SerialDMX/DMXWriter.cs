using System;
using System.IO.Ports;
using System.Threading;
using System.Threading.Tasks;

namespace SerialDMX
{
    public class DMXWriter
    {
        private SerialPort _serialPort;
        private byte[] _buffer = new byte[513];
        private bool _send;

        private int _sendRate = 30;

        public void Connect(string com, int sendRate)
        {
            if (_serialPort != null)
            {
                Console.WriteLine("SerialPort already exists.");
                return;
            }

            _sendRate = sendRate;
            
            _serialPort = new SerialPort
            {
                PortName = com,
                BaudRate = 250000,
                Parity = Parity.None,
                DataBits = 8,
                StopBits = StopBits.Two,
                Handshake = Handshake.None,
                WriteTimeout = 500
            };
            _serialPort.ErrorReceived += (sender, args) => Console.WriteLine(args.EventType);
            _serialPort.Open();

            if (!_serialPort.IsOpen)
            {
                Console.WriteLine("Error opening SerialPort!");
                return;
            }
            Task.Run(SendDMX);
        }

        public void UpdateDMX(byte[] buffer)
        {
            // TODO: Does this need locking/syncing?!
            _buffer = buffer;
        }

        public void Close()
        {
            _send = false;
        }

        private Task SendDMX()
        {
            _send = true;
            while (_send)
            {
                _serialPort.BreakState = true;
                _serialPort.BreakState = false;
                _serialPort.Write(_buffer, 0, _buffer.Length);
                Thread.Sleep(_sendRate);
            }
            _serialPort.Close();
            _serialPort.Dispose();
            _serialPort = null;
            return null;
        }
    }
}