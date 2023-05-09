export const LOCAL_STORAGE_AUTH_DETAILS_KEY = "authDetails";
export const DATE_FORMAT = "dd-MMM-yyyy";
export const CURRENCY_FORMAT = "INR";

export const REMEBER_KEY = "Remeber";

export function thousandsSeprator(no: any) {
  const number = Number(Number(no).toFixed(2));
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function shortCurrencyFormat(num: number): any {
  const number = Number(Number(num).toFixed(2));
  if (isNaN(number)) return null; // will only work value is a number
  if (number === null) return null;
  if (number === 0) return null;

  let abs = Math.abs(number);
  const rounder = Math.pow(10, 2);
  const isNegative = number < 0; // will also work for Negetive numbers
  let key = "";

  const powers = [
    { key: "Cr", value: Math.pow(10, 7) },
    { key: "L", value: Math.pow(10, 5) },
    { key: "K", value: 1000 },
  ];

  for (let i = 0; i < powers.length; i++) {
    let reduced = abs / powers[i].value;
    reduced = Math.round(reduced * rounder) / rounder;
    if (reduced >= 1) {
      abs = reduced;
      key = powers[i].key;
      break;
    }
  }
  return (isNegative ? "-" : "") + abs + key;
}
