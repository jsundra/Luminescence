using System;
using System.IO.Ports;
using System.Threading;
using System.Threading.Tasks;

namespace SerialDMX
{
    public class DMXWriter
    {
        private SerialPort _serialPort;
        private byte[] _buffer;
        private bool _send;

        private int _sendRate = 30;

        public void Connect(string com, int sendRate, int maxAddr)
        {
            if (_serialPort != null)
            {
                Console.WriteLine("SerialPort already exists.");
                return;
            }

            _buffer = new byte[maxAddr];
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
            Buffer.BlockCopy(buffer, 0, _buffer, 0, buffer.Length);
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