const fs = require("fs");
const { register } = require("./register");
const { parseTransactions } = require("./balance");
const { commandPrint } = require("./print");

function main() {
  const commands = process.argv.splice(2);

  const command = commands[0];

  if (command === "-f") {
    const filePath = commands[1];
    const commandAction = commands[2];

    const fileContent = fs.readFileSync(filePath, "utf-8");

    switch (commandAction) {
      case "bal":
      case "balance":
        parseTransactions(fileContent.split("\n"));

        return;
      case "register":
      case "reg":
        register(fileContent.split("\n"));
        return;
      case "print":
        commandPrint(fileContent.split("\n").filter((el) => !el.includes(";")));
      default:
        return;
    }
  }
}

main();
