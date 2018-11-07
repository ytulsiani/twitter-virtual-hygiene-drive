let database = firebase.database();
let donationTotal = 0;
let donationSummary = {
    "Turkey": 0,
    "Ham": 0,
    "Chicken": 0,
    "Rice": 0,
    "Beans": 0,
    "Milk": 0,
    "Onions": 0,
    "Potatoes": 0,
    "Veggies": 0,
    "Corn": 0,
    "Tomatoes": 0,
    "PB": 0,
  };

function updateCartList(){
    let cartList = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    let cartItems = "";
    let emptySpace = "";
    let id = 0;
    for(let item of itemList){
        if(item.quantity === 1) {
            cartItems += `<div id="quantity">
            <input id="quantity-${id}" onchange="updateQuantityFromTextBox(${id})" type="number" min="0" max="9" size="2" value="${item.quantity}" />
            </div>`;
            cartItems += `<div id="unit">${item.unitsReceipt}</div>`;
            cartItems += `<div id="itemTitle">${item.nameReceipt}</div>`;
            cartItems += `<div id="subtotal">$${item.quantity*item.ourPrice}</div>`
            cartItems += `<div><a onclick="removeFromCart(${id})"><i class="material-icons icon">close</i></a></div>`;
            donationSummary[item.nameReceipt] = item.quantity;
        } else if (item.quantity > 1) { //Add an s to the end of the units if >1
            cartItems += `<div id="quantity">
            <input id="quantity-${id}" onchange="updateQuantityFromTextBox(${id})" type="number" min="0" max="9" size="2" value="${item.quantity}" />
            </div>`;
            cartItems += `<div id="unit">${item.unitsReceipt}s</div>`;
            cartItems += `<div id="itemTitle">${item.nameReceipt}</div>`;
            cartItems += `<div id="subtotal">$${item.quantity*item.ourPrice}</div>`
            cartItems += `<div><a onclick="removeFromCart(${id})"><i class="material-icons icon">close</i></a></div>`;
            donationSummary[item.nameReceipt] = item.quantity;
        }
        id++;
    }
    cartList.innerHTML = `${emptySpace} <div class="singleline">${cartItems}</div>`;
    cartTotal.innerHTML = `Total: $${donationTotal}`;
}


function removeFromCart(id){
    donationTotal -= itemList[id].ourPrice * itemList[id].quantity;
    itemList[id].quantity = 0;
    donationSummary[itemList[id].nameReceipt] = itemList[id].quantity;
    updateCartList();
}

function updateQuantityFromTextBox(id){
    let quantityBox = document.getElementById(`quantity-${id}`);
    let newQuantity = parseInt(quantityBox.value);
    let item = itemList[id];
    donationTotal -= item.quantity * item.ourPrice;
    itemList[id].quantity = newQuantity;
    donationTotal += item.quantity * item.ourPrice;
    donationSummary[itemList[id].nameReceipt] = newQuantity;
    updateCartList();
    updateDonateButton();
}

function addToCart(id){
    // Type casting is necessary here due to javascript quirks! Without, it would read quantity as a string, and if you added 1 to 10 it would become 101!
    itemList[id].quantity = parseInt(itemList[id].quantity) + 1;
    let itemPrice = Number(itemList[id].ourPrice);
    donationTotal += itemPrice;
    updateCartList();
    updateDonateButton();
}

function updateDonateButton(){
    // Uses the DOM to modify the PayPal donate button with the total amount
    // paypalDescription collects all item's names + quantities and puts it into item_name field

    let paypalDescription = '';
    itemList.forEach(item => {
        if (item.quantity > 0) {
            paypalDescription += `${item.quantity}x ${item.nameReceipt} `;
        }
    });

    let totalAmount = document.getElementById('donateTotal');
    let combinedNames = document.getElementById('donateName');
    totalAmount.value = donationTotal;
    combinedNames.value = paypalDescription;
}

// Method for submitting item to db - this can be running item total once we have that generated in html
function dbSubmit() {
  let donationItems = db.collection("donationSummary").doc("Ham").update({quantity: donationSummary["Ham"]});
  console.log("success!");
}


window.onload = function() {
    updateCartList();
    loadItems();
    console.log('hello world');
}

function loadItems(){
  let groceryList = document.getElementById('groceryList');
  let groceryItems = "";
  let id = 0;

  for(let item of itemList){
    groceryItems += `<div class ="Item">`;
    groceryItems += `<div class="container"><img class="Item-Img" src ='${item.image}'></div>`;
    groceryItems += `<div class="Item-Name">${item.itemName}</div>`;
    groceryItems += `<div class="Item-Units">${item.servingUnits}</div>`;
    groceryItems += `<div class="Our-Price"><font color ="black">OUR PRICE</font>: $${item.ourPrice}</div>`;
    groceryItems += `<div class="Item-Retail">retail: $${item.retailPrice}</div>`;
    groceryItems += `<a onclick="addToCart(${id});myFunction();" class="addbutton">add to cart</a>`;
    groceryItems += `</div>`;
    id++
  }
  groceryList.innerHTML = `${groceryItems}`;

}

// snackbar function
function myFunction() {
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
