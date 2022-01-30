const bill = getElement('#bill');
const customTip = getElement('#custom-tip');
const numberOfPeople = getElement('#num-of-people');
const tipAmountText = getElement('.js-tip-amount');
const totalAmountText = getElement('.js-total-amount');
const billForm = getElement('#bill-form');
const numOfPeopleForm = getElement('#num-of-people-form');
const resetBtn = getElement('.reset-btn');
const tipBtns = document.querySelectorAll('.tip-selection__btn');

// default states
let currentBill = 0;
let currentTip = 0;
let currentNumberOfPeople = 0;

// ============= FUNCTIONS ================

function getElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else throw `There is no such element ${selector}`;
}

function disable(element) {
  element.disabled = true;
}

function activate(element) {
  element.disabled = false;
}

function setClass(cl) {
  this.classList.add(cl);
}

function removeClass(cl) {
  this.classList.remove(cl);
}

function setDefault() {
  disable(resetBtn);
}

function roundNum(number) {
  return Math.floor(number * 100) / 100;
}

function calculateTipOnePerson(bill, tipPercentage, peopleNum) {
  return roundNum((bill * tipPercentage) / peopleNum);
}

function calculateTotalOnePerson(bill, tipPercentage, peopleNum) {
  return roundNum((bill * tipPercentage + bill) / peopleNum);
}

function resetResultText() {
  tipAmountText.innerHTML = '$0.00';
  totalAmountText.innerHTML = '$0.00';
}

function resetForms() {
  billForm.reset();
  numOfPeopleForm.reset();
}

function resetAll() {
  resetResultText();
  resetForms();
  customTip.value = '';
  tipBtns.forEach(btn => {
    removeClass.call(btn, 'active');
  });
  currentTip = 0;
  currentBill = 0;
  currentNumberOfPeople = 0;
  removeClass.call(numberOfPeople, 'has-error');
  removeClass.call(resetBtn, 'active');
}

function updateResult() {
  const tipAmountOnePerson = calculateTipOnePerson(
    currentBill,
    currentTip,
    currentNumberOfPeople
  );
  tipAmountText.innerHTML = `$${tipAmountOnePerson}`;

  const totalAmountOnePerson = calculateTotalOnePerson(
    currentBill,
    currentTip,
    currentNumberOfPeople
  );
  totalAmountText.innerHTML = `$${totalAmountOnePerson}`;
}

// ============== EVENTS ================

tipBtns.forEach(element => {
  element.addEventListener('click', e => {
    tipBtns.forEach(el => removeClass.call(el, 'active'));
    setClass.call(e.target, 'active');
    currentTip = +e.target.dataset.tip;
    if (currentNumberOfPeople === 0) return;
    updateResult();
  });
});

bill.addEventListener('input', e => {
  e.preventDefault();
  currentBill = +bill.value;
  if (currentNumberOfPeople === 0) return;
  updateResult();
});

numberOfPeople.addEventListener('input', e => {
  e.preventDefault();
  activate(resetBtn);
  const errorMessage = numberOfPeople.nextElementSibling;

  const emptyPattern = /^\s*$/;
  if (emptyPattern.test(numberOfPeople.value)) {
    errorMessage.innerHTML = `Can't be empty!`;
    setClass.call(errorMessage, 'active');
    setClass.call(numberOfPeople, 'has-error');
    resetResultText();
  }

  const zeroPattern = /^0([-.]?0+)*$/;
  if (zeroPattern.test(numberOfPeople.value)) {
    errorMessage.innerHTML = `Can't be zero!`;
    setClass.call(errorMessage, 'active');
    setClass.call(numberOfPeople, 'has-error');
    resetResultText();
  }

  if (
    !zeroPattern.test(numberOfPeople.value) &&
    !emptyPattern.test(numberOfPeople.value)
  ) {
    removeClass.call(errorMessage, 'active');
    removeClass.call(numberOfPeople, 'has-error');
    currentNumberOfPeople = +numberOfPeople.value;
    updateResult();
  }
});

customTip.addEventListener('input', () => {
  // remove current active btn
  tipBtns.forEach(btn => removeClass.call(btn, 'active'));
  // set tip to input value
  currentTip = +customTip.value / 100; // convert to percentage
  // update result
  if (currentNumberOfPeople === 0) return;
  updateResult();
});

resetBtn.addEventListener('click', resetAll);

document.addEventListener('DOMContentLoaded', setDefault);
