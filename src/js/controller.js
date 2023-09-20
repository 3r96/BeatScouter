import * as model from "./model.js";
import concertsView from "./views/concertsView.js";

const prev_button = document.querySelector(".prev_button");
const next_button = document.querySelector(".next_button");
const zip_code_input = document.querySelector(".search_by_zip_code");

let currentPage = 1;
let zipCode = 0;
zip_code_input.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    zipCode = zip_code_input.value;
    console.log(zipCode);
    let data = await model.getEventsByZipCode(currentPage, zipCode);
    if (data.status == 400) {
      console.log(data.message);
    } else {
      concertsView.render(data);
    }
  }
});

// load events from SeatGeek API as soon the user gets to the website
let data = await model.getEvents();

// passing the data to the render method in concertsView
concertsView.render(data);

function updateButtonState() {
  if (currentPage === 1) {
    prev_button.disabled = true; // Disable the button
  } else {
    prev_button.disabled = false; // Enable the button
  }
}

next_button.addEventListener("click", async function () {
  if (zipCode != 0) {
    data = await model.getEventsByZipCode(++currentPage, zipCode);
    concertsView.render(data);
    updateButtonState();
  } else {
    data = await model.getEvents(++currentPage);
    concertsView.render(data);
    updateButtonState();
  }
});

prev_button.addEventListener("click", async function () {
  if (currentPage === 1) {
    return;
  }
  if (zipCode != 0) {
    data = await model.getEventsByZipCode(--currentPage, zipCode);
    concertsView.render(data);
    updateButtonState();
  } else {
    data = await model.getEvents(--currentPage);
    concertsView.render(data);
    updateButtonState();
  }
});

// initializing button state
updateButtonState();
