const purchaseBtn = document.getElementById("purchase-btn");
const cashInput = document.getElementById("cash");
const changeDue = document.getElementById("change-due");

const currencyUnits = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

let currentPrice = 0;

function setNewPrice() {
  let min = 0.01;
  let max = 100.00;
  let random = Math.random() * (max - min) + min;
  currentPrice = Math.round(random * 100) / 100;
  document.getElementById('price').textContent = `$${currentPrice.toFixed(2)}`;
}

function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

function updateDrawerDisplay() {
  const cidMap = Object.fromEntries(cid);

  document.getElementById("hundreds-left").textContent = cidMap["ONE HUNDRED"].toFixed(2);
  document.getElementById("twenties-left").textContent = cidMap["TWENTY"].toFixed(2);
  document.getElementById("tens-left").textContent = cidMap["TEN"].toFixed(2);
  document.getElementById("fives-left").textContent = cidMap["FIVE"].toFixed(2);
  document.getElementById("ones-left").textContent = cidMap["ONE"].toFixed(2);
  document.getElementById("quarters-left").textContent = cidMap["QUARTER"].toFixed(2);
  document.getElementById("dimes-left").textContent = cidMap["DIME"].toFixed(2);
  document.getElementById("nickels-left").textContent = cidMap["NICKEL"].toFixed(2);
  document.getElementById("pennies-left").textContent = cidMap["PENNY"].toFixed(2);
}

window.onload = () => {
  setNewPrice();
  updateDrawerDisplay();
};

purchaseBtn.addEventListener("click", () => {
  purchaseBtn.disabled = true;

  let cash = parseFloat(cashInput.value);

  if (isNaN(cash)) {
    alert("Please enter a valid amount of cash.");
    purchaseBtn.disabled = false;
    return;
  }

  if (cash < currentPrice) {
    alert("Customer does not have enough money to purchase the item");
    purchaseBtn.disabled = false;
    return;
  }

  if (cash === currentPrice) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    updateDrawerDisplay();
    cashInput.value = "";
    setNewPrice();
    purchaseBtn.disabled = false;
    return;
  }

  let changeNeeded = roundToTwo(cash - currentPrice);
  let cidCopy = JSON.parse(JSON.stringify(cid));
  let changeArray = [];

  cidCopy.reverse().forEach(([unit, amount], i) => {
    let unitValue = currencyUnits[unit];
    let used = 0;

    while (changeNeeded >= unitValue && amount >= unitValue) {
      changeNeeded = roundToTwo(changeNeeded - unitValue);
      amount = roundToTwo(amount - unitValue);
      used = roundToTwo(used + unitValue);
    }

    if (used > 0) {
      changeArray.push([unit, used]);
      cid[cid.length - 1 - i][1] = roundToTwo(cid[cid.length - 1 - i][1] - used);
    }
  });

  let totalChangeGiven = roundToTwo(changeArray.reduce((sum, [_, amt]) => sum + amt, 0));

  if (totalChangeGiven < roundToTwo(cash - currentPrice)) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (roundToTwo(cid.reduce((sum, [_, amt]) => sum + amt, 0)) === 0) {
    let result = "Status: CLOSED! ";
    changeArray.forEach(([unit, amount]) => {
      result += `( ${unit}: $${amount} )`;
    });
    changeDue.textContent = result;
  } else {
    let result = "Status: OPEN! ";
    changeArray.forEach(([unit, amount]) => {
      result += `( ${unit}: $${amount} )`;
    });
    changeDue.textContent = result;
  }

  updateDrawerDisplay();
  cashInput.value = "";
  setNewPrice();
  purchaseBtn.disabled = false;
});