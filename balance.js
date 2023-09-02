const parseTransactions = (transactions) => {
  const accounts = {};
  const conversionRates = {};
  let prevCurrency = "";
  let prevValue = 0;
  let amountToConvert = 0;
  let currencyToConvert = "";

  transactions.forEach((transaction) => {
    if (
      transaction.includes("Asset:") ||
      transaction.includes("Bank:") ||
      transaction.includes("Expense:") ||
      transaction.includes("Income:") ||
      transaction.includes("Receivable:") ||
      transaction.includes("Payable:")
    ) {
      // split transaction onto account, amount
      const account = transaction
        .trim()
        .split("\t")
        .filter((el) => el !== "");
      // Get currency and amount
      let currency = account[1]?.split(" ")[1];
      let quantity = account[1]?.split(" ")[0];

      if (
        amountToConvert &&
        !currency &&
        quantity &&
        !conversionRates[currencyToConvert]
      ) {
        conversionRates[currencyToConvert] = Math.abs(
          quantity.replace("$", "") / amountToConvert
        );
      }

      // Save last valid quantity state
      if (quantity) {
        prevValue = quantity;
      }

      // Save last valid currency state
      if (currency) {
        prevCurrency = currency;
      }

      // if account already being taken into account
      if (accounts[account[0]]) {
        if (account[1]) {
          if (!quantity && prevValue) {
            prevValue = -1 * Number(prevValue.replace("$", ""));
            if (prevCurrency.length && !currency) {
              currency = prevCurrency;
              prevCurrency = "";
            }
          }
          if (accounts[account[0].replace("\t", "")].currency === currency) {
            accounts[account[0].replace("\t", "")].quantity += Number(
              prevValue && !quantity ? prevValue : quantity.replace("$", "")
            );
          }
        }
      } else {
        // If account isn't being taken onto account
        if (!quantity && prevValue) {
          prevValue = -1 * Number(prevValue.replace("$", ""));
          if (prevCurrency.length && !currency) {
            currency = prevCurrency;
            prevCurrency = "";
          }
        }

        if (currency !== undefined) {
          amountToConvert = quantity;
          currencyToConvert = currency;
        }

        accounts[`${account[0]}`] = {
          currency: currency ? currency : "USD",
          quantity: Number(
            prevValue && !quantity ? prevValue : quantity?.replace("$", "")
          ),
        };
      }
    }
  });

  return printBalances(accounts, conversionRates);
};

const printBalances = (accounts, conversionRates) => {
  let totalBalance = 0;
  const totalBalancesByCurrency = {};

  // Find the longest account name to determine the width
  const maxLength = Math.max(
    ...Object.keys(accounts).map((account) => account.length)
  );

  Object.entries(accounts).forEach(([account, { currency, quantity }]) => {
    const formattedQuantity = quantity.toFixed(2);
    totalBalance += quantity;

    // Create the tab, formatted quantity, currency, and account
    const formattedAccount = account.padEnd(maxLength, " ");

    if (!totalBalancesByCurrency[currency]) {
      totalBalancesByCurrency[currency] = 0;
    }

    if (currency === "USD" || !conversionRates[currency]) {
      console.log(`\t${formattedQuantity} ${currency} \t${formattedAccount}`);
    } else {
      const convertedAmount = (quantity * conversionRates[currency]).toFixed(2);
      console.log(`\t${formattedQuantity} ${currency} \t${formattedAccount}`);
      totalBalancesByCurrency["USD"] += parseFloat(convertedAmount);
    }

    totalBalancesByCurrency[currency] += parseFloat(formattedQuantity);
  });

  console.log("--------------------");
  console.log(`\t$${totalBalancesByCurrency.USD.toFixed(2)} USD`);

  // Print the total balances of different currencies
  for (const [currency, total] of Object.entries(totalBalancesByCurrency)) {
    if (currency !== "USD" && currency !== "BTC") {
      console.log(`\t${total.toFixed(2)} ${currency}`);
    } else if (currency === "BTC") {
      console.log(`\t${total.toFixed(2)} ${currency}`);
    }
  }
};

module.exports = { parseTransactions };
