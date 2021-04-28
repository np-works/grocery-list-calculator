// Selecting Elements we will use

const totalElem = document.querySelector("#total-section .total-value");
// Selecting the List
const listElem = document.querySelector("#list-section") // incomeEl
// includes the list and tax areas
const list = document.querySelector("#list-section .list"); // incomeList
// selecting the input section elements
const itemName = document.querySelector("#itemTitle");  // incomeTitle
const itemCost = document.querySelector("#itemAmount"); // incomeAmount
const addBtn = document.querySelector(".add-btn"); // addIncome



// Add entries
    // we created a variable called addBtn and we want that button to add the inputs into the list section
    addBtn.addEventListener("click", function(){
        // if one or both entries are missing (! = not , || means or , The return statement stops the execution of a function if what is inside is the if statement is true)
        if(!itemName.value || !itemCost.value) return;

        // we need to save the input values together that ppl type in in an array
        // But we first need to save those inputs as objects first bc it has multile properties like name and cost.
        // Put let instead of const bc the inputs will be reassigned values (wont stay the same value all the time)
        let inputs = {
            type : "inputs",
            // the values of the item name and cost
            title : itemName.value, 
            // need to add parsefloat bc the itemcost input will actually return a string value not a number and the parsefloat converts strings to numbers
            amount: parseFloat(itemCost.value),
        }
        // Now we can just push the new entries (which are the objects w/ all its properties) into an array (or list in the list area)
        let ENTRY_LIST = [];
        ENTRY_LIST.push(inputs);
        // to update the new entries on the list area and update the total
        updateUI();

        // then we are going to clear the inputs after we submit them. Use the clearInput function and pass the inputs as an array
        clearInputs([itemName, itemCost]);
    });

// Calculating Total
    function calculateTotal(type, ENTRY_LIST){
        // define sum variable first to begin the sum
        let sum = 0;
        ENTRY_LIST.forEach( entry => {
            if(entry.type == type){
                sum+= entry.amount;

            }

        });
        return sum;
    }
    // now call the caltotal function in the the inputs object
    inputs = calculateTotal("inputs", ENTRY_LIST);


// Showing the entry in the list area
    // in the list we are going to show the title and amount whoes entries have their own type and id
    // we are making a new variable called entry which makes an entire expression a variable using backticks
    function showEntry(list, type, title, amount, id){
        const entry = `<li id = "${id}" class = "${type}">
                            <div class = "entry">${title}: $${amount} </div>
                            <div id = "edit"></div>
                            <div id = "delete"></div>
                        </li>`;
        // make the newest entries appear at the top of list
        const position = "afterbegin";
        list.insertAdjacentHTML(position,entry);
    }

    function updateUI() {
        inputs = calculateTotal("inputs", ENTRY_LIST);

        totalElem.innerHTML = `<small>$</small>${inputs}`;
        
        clearElement([list]);

        ENTRY_LIST.forEach((entry,index) => {
            if(entry.type == "inputs"){
                showEntry(list, entry.type, entry.title, entry.amount, index);
            }
        });
    }

    function clearElement(){
        list.innerHTML = "";
    }
    // inputting multiple elements so need to fix this
    function clearInputs(){
        list.innerHTML = "";
    } 
// Delete Button
    // Need to delete entry from the list area and thus the array
    // will do this using splice method -> splice(index, howmany) - Entry.id means entry is the id of our entry
    function deleteEntry(ENTRY){
        ENTRY_LIST.splice(ENTRY.id, 1);
    // after we call the deleteEntry funciton we need to update the Total values again
    updateUI();
    }
// Edit Button
    // will remove the entry from the list area, add the entry back to the input area, and update the total values again
    function editEntry(ENTRY){
        // making entry the variable that represents the entry id which includes amount, name,type
        let entry = ENTRY_LIST[ENTRY.id];
        // if the entry type is an input, we are going to update the item name and cost in the input section
        if (entry.type == "inputs"){
            itemName.value = entry.title;
            itemCost.value = entry.amount;
        }
        // run the delete entry function again so you can delete the previous entry before you add a new edited entry
        deleteEntry(ENTRY);
    }

    // deleteOrEdit

    // We are going to add an event listener to the whole list (which includes the entry with id, the edit and delete buttons), not each individual btn
    // so whenever someone clicks something insdies the list, it will call the deleteOREdit function
    list.addEventListener("click", deleteOrEdit);
        // the function will take in the click event
    function deleteOrEdit(event){
        // to know which element was clicked or targeted in the list using the "target property" of an event, determine the target button
        const targetBtn = event.target
        // need to know which is the parent element of a btn clicked on the list (which is the id or entry). It is the same entry that we pass through delete or the edit entry functions .
        // this section was just to get to the id or parent node of the button clicked to id which entry should be deleted or clicked in the entire list.
        const ENTRY = targetBtn.parentNode;
        // so now that we defined that ENTRY is the representative of the id/parentnode... we can create if statement
        if(targetBtn.id == "delete"){
            deleteEntry(ENTRY);
        }else if (targetBtn.id == "edit"){
            editEntry(ENTRY);
        }
    }


//  Saving our data in the Local Storage so that the info will not delete after reload
    // we are going to use the setItem method which has a key(i.e name) and the value you want to save
    //  to get the saved item back from the local storage, use getItem that only takes in the key name
    // we need to convert our values which are objects into strings
    // this will be executed inside th updateUI() function after someon adds a new input to the list
    let ENTRY_LIST;
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
    ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
    updateUI();
    // but if someone is using the list for the first time, this will return back an erro since there is nothing in local storage
    // so you will add above || that says if there is no data in the list, make entry list  = empty. if not set it = to the array that is saved in local storage
    // first create varaible of ENTRY_LIST