// Select Elements
const totalElem = document.querySelector("#total-section .total-value"); // balance
const listElem = document.querySelector("#list-section") // incomeEl
const list = document.querySelector("#list-section .list"); // incomeList

// INPUT BTS
const itemTitle = document.querySelector("#itemTitle");  // incomeTitle
const itemAmount = document.querySelector("#itemAmount"); // incomeAmount
const addBtn = document.querySelector(".add-btn"); // addIncome
// CLEAR ALL BUTTON
const clearAllBtn = document.querySelector(".clearAll-btn");

// VARIABLES
let ENTRY_LIST;
let total = 0;

// LOOK IF THERE IS SAVED DATA IN LOCAL STORAGE
    //  to get the saved item back from the local storage, use getItem that only takes in the key name
    // but if someone is using the list for the first time, this will return back an error since there is nothing in local storage
    // so you will add above || that says if there is no data in the list, make entry list  = empty. if not set it = to the array that is saved in local storage
    // then updateUI after you get back the data from the local storage if there is any
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();


const DELETE = "delete", EDIT = "edit";

// EVENT LISTENERS
    addBtn.addEventListener("click", function(){
        if(!itemTitle.value || !itemAmount.value) return;
                // we need to save the input values together that ppl type in in an array
                // But we first need to save those inputs as objects first bc it has multile properties like name and cost.
                // Put let instead of const bc the inputs will be reassigned values (wont stay the same value all the time)
                let inputs = {
                    type : "inputs",
                    // the values of the item name and cost
                    title : itemTitle.value, 
                    // need to add parsefloat bc the itemcost input will actually return a string value not a number and the parsefloat converts strings to numbers
                    amount: parseFloat(itemAmount.value),
                }
                // Now we can just push the new entries (which are the objects w/ all its properties) into an array (or list in the list area)
                ENTRY_LIST.push(inputs);
                // to update the new entries on the list area and update the total after the event btn is clicked
                updateUI();
                // after button is clickedthen we are going to clear the inputs after we submit them. Use the clearInput function and pass the inputs as an array
                clearInputs([itemTitle, itemAmount])
            })

    // We are going to add an event listener to the whole list (which includes the entry with id, the edit and delete buttons), not each individual btn
    // so whenever someone clicks something inside the list, it will call the deleteOREdit function
    list.addEventListener("click", deleteOrEdit);


    clearAllBtn.addEventListener("click", function(){
        clearAll();
    })
    

// HELP-FUNCTIONS

function deleteOrEdit(event){ // the function will take in the click event
    // to know which element was clicked or targeted in the list using the "target property" of an event, determine the target button
    const targetBtn = event.target
    // need to know which is the parent element of a btn clicked on the list (which is the id or entry). It is the same entry that we pass through delete or the edit entry functions .
    // this section was just to get to the id or parent node of the button clicked to id which entry should be deleted or clicked in the entire list.
    const ENTRY = targetBtn.parentNode;
    // so now that we defined that ENTRY is the representative of the id/parentnode... we can create if statement
    if(targetBtn.id == DELETE){
        deleteEntry(ENTRY);
    }else if (targetBtn.id == EDIT){
        editEntry(ENTRY);
    }
}

// DeleteEntry function
// Need to delete entry from the list area and thus the array
// will do this using splice method -> splice(index, howmany) - Entry.id means entry is the id of our entry
function deleteEntry(entry){
    ENTRY_LIST.splice(entry.id, 1);
// after we call the deleteEntry funciton we need to update the Total values again
    updateUI();
    }


// EditEntry funciton
// will remove the entry from the list area, add the entry back to the input area, and update the total values again
function editEntry(entry){
    // making entry the variable that represents the entry id which includes amount, name,type
    let ENTRY = ENTRY_LIST[entry.id];
    // if the entry type is an input, we are going to update the item name and cost in the input section
    if (ENTRY.type == "inputs"){
        itemTitle.value = ENTRY.title;
        itemAmount.value = ENTRY.amount;
    }
    deleteEntry(entry);
    
}

function updateUI() {
    inputs = calculateTotal("inputs", ENTRY_LIST);
    
    
    clearElement([list]); // clear whole list area section of all elements
    clearInputs([itemTitle.value, itemAmount.value]);
    // Adding negative sign to the total balance (if needed)
    // let sign = "$";
    // Show total in browser - the small is html just means smaller text and the $ is a selector for elements of the DOM
    totalElem.innerHTML = `<small>$</small>${inputs}`;

    // Updating values on browser after button is clicked
    ENTRY_LIST.forEach((entry,index) => {
        if(entry.type == "inputs"){
            showEntry(list, entry.type, entry.title, entry.amount, index);
        }
    });

    // SAVE ITEMS IN LOCAL STORAGE AFTER ADD BUTTON IS CLICKED (UPDATEUI)
        // we are going to use the setItem method which has a key(i.e name) and the value you want to save
        // we need to convert our values which are objects into strings which is why we use JSON.stringify
        // this will be executed inside th updateUI() function after someon adds a new input to the list
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

// ShowEntry function: In the list we are going to show the title and amount whoes entries have their own type and id
// we are making a new variable called entry which makes an entire expression a variable using backticks
function showEntry(list, type, title, amount, id){
    // this is the entire html of our new entry variable
    const entry = `<li id = "${id}" class = "${type}"> 
                        <div class = "entry">- ${title}: $${amount} </div>
                        <div id = "edit"></div>
                        <div id = "delete"></div>
                    </li>`;
    // make the newest entries appear at the top of list
    const position = "afterbegin";
    list.insertAdjacentHTML(position,entry);
}


function clearElement(elements){    // remember elements is just a parameter name or placeholder for the real values that you call later
    elements.forEach(element => {        // same confusion about element without an s. is it a keyword?
        element.innerHTML = "";
    })
}

function calculateTotal(type, ENTRY_LIST){
    // define sum variable first to begin the sum
    let sum = 0;
    ENTRY_LIST.forEach( entry => {
        if(entry.type == type){
            sum += entry.amount;
        }

    })
    let tax = 0
    tax += sum * .10;
    total = tax + sum;
    return total;
    // return sum;
}


function clearInputs(inputs){ // remember inputs is just a parameter or /rand-name/placeholder for the actual values you will place in the function
   inputs.forEach( input => {     //    confusing - why input with no s
       input.value = "";
   })
} 

function clearAll() {
    ENTRY_LIST.length = 0;
    updateUI();
    clearInputs([itemTitle, itemAmount]);
    }

