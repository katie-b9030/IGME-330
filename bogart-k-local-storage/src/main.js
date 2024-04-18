import * as storage from "./storage.js"
let items = ["???!!!"];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  let html = ``;
  // loop though items and stick each array element into an <li>
  for (let item of items) {
    // use array.map()!
    items.map(`<li>${item}</li>`)
  }
  // update the innerHTML of the <ol> already on the page
  document.querySelector(".ml4").innerHTML = html
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = str => {
  if (str != null) {
    items.addItem(str);
  }
};


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
document.querySelector("#btn-add").onclick = () => {
  addItem(document.querySelector(".input"));
  document.querySelector(".input").clear;

  // - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
  storage.writeToLocalStorage("klb9030-items", items);
}

// When the page loads:
const init = () => {
  // - load in the `items` array from storage.js and display the current items
  items = storage.readFromLocalStorage("klb9030-items");
  // you might want to double-check that you loaded an array ...
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  if (!Array.isArray(items)){
  // ... and if you didn't, set `items` to an empty array
    items = [];
  }

  // Got it working? 
  // - Add a "Clear List" button that empties the items array
  document.querySelector("#buttons").innerHTML += `<button id="btn-clear" class="button is-warning"> Clear List </button>`
  document.querySelector
}

init();