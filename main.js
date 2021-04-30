//@ts-nocheck
var runningTotal = 0
var runningSavings = 0

let spendingAccounts = ["food", "apart", "phone", "college", "gas", "misc"]
let ownerName = "William Andersen"
let initialBalance = 0
let columnLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
let currentCell = 'A0'

let changeOwnerformElement = document.getElementById("change-owner")
let chgOwnerformElement = document.getElementById("changeOwner")
let ownerElement = document.getElementById("owner")
let beginBalanceElement = document.getElementById("begin-balance")
let computationElement = document.getElementById("computing-location")
let incomeFormElement = document.getElementById("income-type")
let descFormElement = document.getElementById("description-type")
let itemFormElement = document.getElementById("item-type")
let costFormElement = document.getElementById("cost-type")
let qtyFormElement = document.getElementById("qty-type")
let incomeCheckboxElem = document.getElementsByName("incomeCheckbox")
let isCheckboxChecked = false
let ownerTrans = {
    ownerName: "",
    beginBalance: 0,
}

let incomeTrans = {
    income: 0,
    desc: '',
}

let costTrans = {
    item: '',
    cost: 0,
    qty: 1,
    column: 'I',
}
let budgetTrans = []


console.log(runningTotal)

function goToTotal(adder) {
    let storedCell = currentCell
    let locationPtr = document.getElementById(currentCell)
    let currentChar = 'J'
    let currentNum = currentCell.charAt(1)
    currentCell = currentChar + currentNum
    addToRunningTotal(adder)
    currentCell = storedCell
}

function goSpendingAccount(adder, columnChar) {
    let storedCell = currentCell
    let locationPtr = document.getElementById(currentCell)
    let currentChar = columnChar
    let currentNum = currentCell.charAt(1)
    currentCell = currentChar + currentNum
    addToSpendingAccount(adder)
    currentCell = storedCell
}

function addToSpendingAccount(adder) {
    let locationPtr = document.getElementById(currentCell)
    let accountPtr = parseFloat(adder)
    locationPtr.innerText = accountPtr.toString()
}


function addToRunningTotal(adder) {
    locationPtr = document.getElementById(currentCell)
    runningTotal = parseFloat(Math.floor((parseFloat(adder) * 100) + (parseFloat(runningTotal) * 100))) / 100
    locationPtr.innerText = runningTotal.toString()
}


function addTransOrIncomeOrChangeOwner(event) {
    event.preventDefault();
    let form = event.target
    let spendingAccountPtr = document.getElementsByName("foodChk")
    let I = 0
    Index = -1
    let checkName = ""
    checkboxPtr = document.getElementsByName("foodChk")

    if (isCheckboxChecked) {
        drawChangeOwner(form.ownerName.value, form.beginBalance.value)
        storeChangeOwner(form.ownerName.value, form.beginBalance.value)
        form.reset()
        reset_form
        changeOwnerBack()
    } else {
        if (incomeCheckboxElem[0].checked) {
            drawIncomeTransaction(form.description.value, form.incomeAmt.value)
            storeIncomeTransaction(form.incomeAmt.value, form.description.value)
            form.reset()
            reset_form()
            incrementCurCellRow()
            zeroCollumn
        } else {
            changeOwnerformElement.classList.remove("hidden") /* document.getElementById("change-owner") */
            chgOwnerformElement.classList.add("hidden")       /* document.getElementById("changeOwner")   */
            I = -1
            spendingAccounts.forEach(x => {
                checkName = (x + 'Chk')
                checkboxPtr = document.getElementsByName(checkName)
                I++
                if (checkboxPtr[0].checked) {
                    index = I
                }
            })
            try {
                if (index > -1) {
                    index += 3
                    drawTransaction(form.item.value, form.cost.value, form.qty.value, columnLetter[index])
                    storeTransaction(form.item.value, form.cost.value, form.qty.value, columnLetter[index])
                    form.reset()
                    reset_form()
                } else {
                    throw "You must check at least one checkbox"
                }
            }
            catch (e) {
                alert(e)
            }
        }
    }
}

function storeChangeOwner(owner, balance) {
    ownerTrans.ownerName = owner
    ownerTrans.beginBalance = balance
    budgetTrans.push(ownerTrans)
    window.localStorage.setItem("budget", JSON.stringify(budgetTrans))
}

function storeIncomeTransaction(income, description) {
    incomeTrans.income = income
    incomeTrans.desc = description
    budgetTrans.push(incomeTrans)
    window.localStorage.setItem("budget", JSON.stringify(budgetTrans))
}

function storeTransaction(item, cost, qty, letterChar) {
    costTrans.item = item
    costTrans.cost = cost
    costTrans.qty = qty
    costTrans.column = letterChar
    budgetTrans.push(costTrans)
    window.localStorage.setItem("budget", JSON.stringify(budgetTrans))
}

function clearStoredBudget() {
    budgetTrans = []
    window.localStorage.setItem("budget", JSON.stringify(budgetTrans))
    runningTotal = 0
}

function loadStoredBudget() {
    let storedBudgetTrans = JSON.parse(localStorage.getItem("budget"))
    if (storedBudgetTrans[0]) {
        budgetTrans = storedBudgetTrans
        currentNumberofBudgetTrans = budgetTrans.length
    } else {
        changeOwner()
        currentCell = "A0"
    }
    /* console.log("Stored Transactions", currentNumberofBudgetTrans)  */
    budgetTrans.forEach(x => {
        console.log(x)
        if (typeof (x.ownerName) !== 'undefined') {
            drawChangeOwner(x.ownerName, x.beginBalance)
        }
        if (typeof (x.income) !== 'undefined') {
            drawIncomeTransaction(x.desc, x.income)
        }
        if (typeof (x.item) !== 'undefined') {
            drawTransaction(x.item, x.cost, x.qty, x.column)
        }
    })
}

function reset_form() {
    changeOwnerformElement.classList.add("hidden")       /* document.getElementById("change-owner") */
    chgOwnerformElement.classList.remove("hidden")       /* document.getElementById("changeOwner")   */

    incomeFormElement.classList.add("hidden")
    descFormElement.classList.add("hidden")

    itemFormElement.classList.remove("hidden")
    costFormElement.classList.remove("hidden")
    qtyFormElement.classList.remove("hidden")
}

function drawTransaction(itm, cost, qty, colAccount) {
    let multiplyResult = 0
    checkLineAddLine()
    let currentCellPtr = document.getElementById(currentCell)
    console.log("Draw Transaction", itm, currentCell)
    currentCellPtr.innerHTML = itm
    incrementCurCellCollumn()
    currentCellPtr = document.getElementById(currentCell)
    currentCellPtr.innerHTML = cost
    incrementCurCellCollumn()
    currentCellPtr = document.getElementById(currentCell)
    currentCellPtr.innerHTML = qty

    multiplyResult = (100 * parseFloat(cost) * parseFloat(qty) * parseFloat(-1)) / 100
    goSpendingAccount(multiplyResult, colAccount)

    goToTotal(multiplyResult)
    incrementCurCellRow()
    zeroCollumn()
}

function drawIncomeTransaction(desc, income) {
    console.log("Draw  Income Transaction")
    checkLineAddLine()
    let currentCellPtr = document.getElementById(currentCell)
    console.log("Draw Income Transaction", desc)
    currentCellPtr.innerHTML = desc
    incrementCurCellCollumn()
    currentCellPtr = document.getElementById(currentCell)
    currentCellPtr.innerHTML = parseFloat(income * 100) / 100


    goToTotal((100 * income.valueOf()) / 100)

    incrementCurCellRow()
    zeroCollumn()
}

function drawChangeOwner(owner, balance) {
    console.log("Draw Change Owner", owner, balance)
    ownerName = owner
    initialBalance = balance
    ownerElement.innerText = "Owner: " + ownerName
    beginBalanceElement.innerText = "Begin Bal.: " + parseFloat(balance)
    beginBalanceElement.classList.remove("hidden")

    let lengthSA = spendingAccounts.length
    let template = []
    // @ts-ignore
    template +=
        `   <span id="A1" class="cell blue">Item:</span>
        <span id="B1" class="cell blue even">Cost/Inc:</span>
        <span id="C1" class="cell blue ">Qty:</span>
    `
    for (x = 0; x < lengthSA; x++) {
        // @ts-ignore
        template += `
        <span id="${String.fromCharCode((68 + x), 49)}" class="cell green ${x % 2 ? '' : 'even'}">${spendingAccounts[x]}</span>
        `
    }
    template += `<span id="J1" class="cell blue ">Total:</span>`
    computationElement.innerHTML = template
    incrementCurCellRow()
    zeroCollumn()

    runningTotal = parseFloat(balance) + parseFloat(runningTotal)
    console.log(runningTotal)
    if (ownerName == 'clearit') {
        clearStoredBudget()
        /* alert("storedmemory is cleared ... please reload page") */
        currentCell = "A1"
        runningTotal = 0
    }
}
function checkLineAddLine() {
    try {
        let currentLinePtr = document.getElementById(currentCell)
        if (!currentLinePtr) {
            throw "Need to add Line: "
        }
    }
    catch (e) {
        console.log(e, currentCell)
        addLine()
    }

}

function addLine() {
    let locationPtr = document.getElementsByClassName("last")
    let computationLocationPtr = locationPtr[0]
    let template = []
    let currentCounter = currentCell

    computationLocationPtr.classList.remove("last")

    template += `<div id ='computing-location' class='d-flex catagories last' >`
    for (x = 0; x < 10; x++) {
        currentCounter = columnLetter[x] + currentCell.charAt(1)
        template += `<span id = "${currentCounter}"  class="cell next-row ${x % 2 ? '' : 'even'} " > _</span>`
    }
    template += `</div >`
    computationLocationPtr.insertAdjacentHTML("afterend", template)
}


function zeroCollumn() {
    let currentChar = 'A'
    let currentNum = currentCell.charAt(1)
    currentCell = currentChar + currentNum
}


function incrementCurCellCollumn() {
    let currentChar = columnLetter[currentCell.charCodeAt(0) - 65 + 1]
    let currentNum = currentCell.charAt(1)
    currentCell = currentChar + currentNum
}

function incrementCurCellRow() {
    let currentChar = currentCell.charAt(0)
    let currentNum = ((currentCell.charAt(1)).charCodeAt(0) - 48 + 1)
    currentCell = currentChar + currentNum
}

/*    Not Needed fuction : part of drawChangeOwner func
function setupApp() {
    drawChangeOwner("William", 0)
    let ownerElement = document.getElementById("owner")
    ownerElement.innerText = "Owner: " + ownerName
}  */

function foodTest() {
    console.log("chk")
}

function changeOwner() {
    let changeOwnerformElement = document.getElementById("change-owner")
    let ownerElement = document.getElementById("owner")
    let newTransactionElement = document.getElementById("new-transaction-form")
    let fieldsElement = document.getElementById("account-classes")
    let submitCancelElement = document.getElementById("submit-cancel")
    let template = []

    newTransactionElement.classList.add("hidden")
    changeOwnerformElement.classList.remove("hidden")
    ownerElement.classList.add("hidden")
    submitCancelElement.classList.remove("hidden")
    fieldsElement.classList.add("hidden")
    isCheckboxChecked = true

    spendingAccounts.forEach(x => {
        template += `
        <div class="border">
        <label for="${x}">${x}</label>
        <input type="checkbox" name="${x + 'Chk'}" >
        </div>
        `
    })
    fieldsElement.innerHTML = template
}

function changeOwnerBack() {
    let changeOwnerformElement = document.getElementById("change-owner")
    let ownerElement = document.getElementById("owner")
    let newTransactionElement = document.getElementById("new-transaction-form")
    let fieldsElement = document.getElementById("account-classes")
    let submitCancelElement = document.getElementById("submit-cancel")

    newTransactionElement.classList.remove("hidden")
    changeOwnerformElement.classList.add("hidden")
    ownerElement.classList.remove("hidden")
    submitCancelElement.classList.remove("hidden")
    fieldsElement.classList.remove("hidden")
    isCheckboxChecked = false
}


function toggleTransactionForm() {
    let formElement = document.getElementById("new-transaction-form")
    let formSubmitCancel = document.getElementById("submit-cancel")
    formElement.classList.toggle("hidden")
    formSubmitCancel.classList.toggle("hidden")
}

function changeForm() {
    if (incomeCheckboxElem[0].checked) {
        itemFormElement.classList.add("hidden")
        costFormElement.classList.add("hidden")
        qtyFormElement.classList.add("hidden")
        incomeFormElement.classList.remove("hidden")
        descFormElement.classList.remove("hidden")
    } else {
        itemFormElement.classList.remove("hidden")
        costFormElement.classList.remove("hidden")
        qtyFormElement.classList.remove("hidden")
        incomeFormElement.classList.add("hidden")
        descFormElement.classList.add("hidden")
    }
}

/*  setupApp()  -redundient */
drawChangeOwner(ownerName, 0)
loadStoredBudget()
console.log("Cell: ", currentCell)