const MONTHS = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const formatEntries = (entries) => {
  // Initialize an array to store all lines from all entries
  const allLines = [];

  // Iterate through each entry and split it into lines
  for (const entry of entries) {
    const lines = entry
      .split("\n")
      .filter((el) => el !== "\t" && el.length > 1);

    // verify that each one of them has a value
    let prevValue = "";
    const allLinesWithValues = lines.map((line, i) => {
      if (i === 0) return line;
      const movementsLine = line.split("\t").filter((el) => el !== "");
      if (movementsLine[1]) {
        const possibleMovements = movementsLine[1].split(" ");
        if (possibleMovements.length > 1) {
          prevValue = `${Number(possibleMovements[0]) * -1}`;
        } else {
          const value = possibleMovements[0].replace("$", "");
          prevValue = `${Number(value) * -1}`;
        }
      }
      if (prevValue.length && !movementsLine[1]) {
        movementsLine.push(prevValue);
        prevValue = "";
      }
      return `\t${movementsLine.join("\t")}`;
    });

    allLines.push(...allLinesWithValues);
  }

  // Calculate the maximum length for each column across all lines
  const maxColumnLengths = allLines[0]
    .split("\t")
    .map((_, col) =>
      Math.max(...allLines.map((line) => (line.split("\t")[col] || "").length))
    );

  // Print the lines with padding to align them vertically
  for (const line of allLines) {
    const parts = line.split("\t");
    const alignedLine = parts
      .map((part, col) => part.padEnd(maxColumnLengths[col], " "))
      .join("\t");
    console.log(alignedLine);
  }
};

const register = (lines) => {
  const validChunks = lines.filter((el) => el[0] === "\t" || !isNaN(el[0]));

  const formattedDates = validChunks.map((el) => {
    if (el.startsWith("\t")) return el;
    const dateChunks = el.replaceAll(/\//g, "-").split("-");
    dateChunks[1] = MONTHS[dateChunks[1]];
    return dateChunks.join("-");
  });

  const textWithDates = formattedDates.join("\n");

  const textInChunks = textWithDates.split(
    /(?<=\n)(?=\d{4}-[A-Za-z]{3}-\d{1,2})/
  );

  formatEntries(textInChunks);
};

module.exports = { register };
