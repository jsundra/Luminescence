using System;

namespace SerialDMX
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Arguments: COM1 512 30 (COM#, Max Address, Send Delay)");
                return;
            }
            
            var COM = args[0];
            var maxAddr = ParseIntArg(ref args, 1, 512);
            var sendRate = ParseIntArg(ref args, 2, 30);
            
            var dmx = new DMXWriter();
            
            dmx.Connect(COM, sendRate);
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
                    Console.WriteLine($"DMX RX: {read} - {buffer}");
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
                catch (Exception e)
                {
                    Console.WriteLine($"Error parsing arg {index}.");
                }
            }
            return @default;
        }
    }
}