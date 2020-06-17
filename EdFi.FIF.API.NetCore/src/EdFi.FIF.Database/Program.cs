using DbUp;
using DbUp.Engine;
using System;
using System.Diagnostics;
using System.Reflection;
// ReSharper disable IdentifierTypo

namespace EdFi.FIF.Database
{
    class Program
    {
        static int Main(string[] args)
        {
            string connectionString = args[0];

            EnsureDatabase.For.SqlDatabase(connectionString);

            UpgradeEngine upgrader =
                DeployChanges.To
                    .SqlDatabase(connectionString)
                    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                    .LogToConsole()
                    .Build();

            DatabaseUpgradeResult result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(result.Error);
                Console.ResetColor();
                if (Debugger.IsAttached)
                {
                    Console.ReadLine();
                }
                return -1;
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Success!");
            Console.ResetColor();
            return 0;
        }
    }
}
