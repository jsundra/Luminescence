using System;
using System.IO.Ports;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Win32;

namespace SerialDMX
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                Console.WriteLine("Invalid usage.\nArguments: <VID> <PID> <MAX_ADDR> <SEND_DELAY>");
                return;
            }

            var vid = args[0];
            var pid = args[1];
            var portId = FindSerialPort(vid, pid);

            if (string.IsNullOrEmpty(portId))
            {
                Console.WriteLine($"Unable to find device (VID={vid} PID={pid})");
                return;
            }
            
            var maxAddr = ParseIntArg(ref args, 2, 512);
            var sendRate = ParseIntArg(ref args, 3, 30);
            
            Console.WriteLine($"{portId} {maxAddr} {sendRate}");
            
            var dmx = new DMXWriter();
            
            dmx.Connect(portId, sendRate, maxAddr);
            Console.WriteLine("Port opened successfully.");

            var buffer = new byte[maxAddr];
            using (var stdin = Console.OpenStandardInput(1024))
            {
                int read;
                do
                {
                    read = stdin.Read(buffer, 0, buffer.Length);
                    if (read != buffer.Length)
                    {
                        Console.WriteLine($"Over/under read? {read}" );
                    }
                    
                    dmx.UpdateDMX(buffer);
                } while (true);
            }
            
            dmx.Close();
        }

        private static int ParseIntArg(ref string[] args, int index, int @default)
        {
            if (args.Length > index)
            {
                try
                {
                    return int.Parse(args[index]);
                }
                catch (Exception)
                {
                    Console.WriteLine($"Error parsing arg {index}.");
                }
            }
            return @default;
        }
        
        private static string FindSerialPort(string vid, string pid)
        {
            var regex = new Regex($"^VID_0{vid}.PID_{pid}");

            var enums = Registry.LocalMachine.OpenSubKey("SYSTEM\\CurrentControlSet\\Enum");
            foreach (var enumEntry in enums.GetSubKeyNames())
            {
                var entryReg = enums.OpenSubKey(enumEntry);
                foreach (var device in entryReg.GetSubKeyNames())
                {
                    if (regex.Match(device).Success)
                    {
                        var deviceReg = entryReg.OpenSubKey(device);
                        foreach (var deviceMisc in deviceReg.GetSubKeyNames())
                        {
                            var miscReg = deviceReg.OpenSubKey(deviceMisc);

                            var deviceParams = miscReg.OpenSubKey("Device Parameters");
                            if (deviceParams == null) continue;
                            
                            foreach (var param in deviceParams.GetValueNames())
                            {
                                if (param == "PortName")
                                {
                                    return (string) deviceParams.GetValue("PortName");
                                }
                            }
                        }
                    }
                }
            }

            return null;
        }
    }
}