const commandPrint = (lines) => {
  return lines.forEach((line) => {
    console.log(`${line}`);
  });
};

module.exports = { commandPrint };
