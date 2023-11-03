import * as model from "./model.js";
import concertsView from "./views/concertsView.js";

const prev_button = document.querySelector(".prev_button");
const next_button = document.querySelector(".next_button");
const zip_code_input = document.querySelector(".search_by_zip_code");
const play_button_nodeList = document.querySelectorAll(".play_button");
const playlist_section = document.getElementById("spotify_playlist_view");
const results = document.querySelector(".results");
const slider = document.querySelector(".slider");
const home_button = document.querySelector(".home_button");
const venue_button_nodeList = document.querySelectorAll(".venue_link");

//const sliderValue = document.querySelector(".slider_value");

// Google Maps API
model.initMap();

let currentPage = 1;
// default value for range
let sliderValue = "50mi";
// load events from SeatGeek API as soon the user gets to the website
let data = await model.getEvents();
let zipCode = data.meta.geolocation.postal_code;
const homeZipCode = zipCode;

// search by zip code functionality
zip_code_input.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    zipCode = zip_code_input.value;
    console.log(zipCode);
    data = await model.getEventsByZipCode(currentPage, zipCode, sliderValue);
    if (data.status == 400) {
      console.log(data.message);
      concertsView.renderInvalidZipCode();
      slider.disabled = true;
      next_button.disabled = true;
      prev_button.disabled = true;
      data = await model.getEvents();
    } else {
      slider.disabled = false;
      next_button.disabled = false;
      concertsView.renderEvents(data);
      concertsView.renderVenuesMap(data);
      concertsView.renderConcertsFoundMessage(data);
      concertsView.renderPriceTable(data);
    }
  }
});

// passing the data to the renderEvents method in concertsView
concertsView.renderEvents(data);
concertsView.renderVenuesMap(data);
console.log(data);
concertsView.renderUserLocation(data);
concertsView.renderPriceTable(data);

// slider functionality
slider.addEventListener("input", async function () {
  sliderValue = `${slider.value}mi`;
  console.log(sliderValue);
  data = await model.getEventsByZipCode(
    currentPage,
    data.meta.geolocation.postal_code,
    sliderValue
  );
  concertsView.renderEvents(data);
  concertsView.renderVenuesMap(data);
  concertsView.renderPriceTable(data);
  return sliderValue;
});

function updateButtonState() {
  if (currentPage === 1) {
    prev_button.disabled = true; // Disable the button
  } else {
    prev_button.disabled = false; // Enable the button
  }
}

next_button.addEventListener("click", async function () {
  if (zipCode != 0) {
    data = await model.getEventsByZipCode(++currentPage, zipCode, sliderValue);
    concertsView.renderEvents(data);
    concertsView.renderVenuesMap(data);
    concertsView.renderPriceTable(data);
    updateButtonState();
  } else {
    data = await model.getEvents(++currentPage);
    concertsView.renderEvents(data);
    concertsView.renderVenuesMap(data);
    concertsView.renderPriceTable(data);
    updateButtonState();
  }
});

prev_button.addEventListener("click", async function () {
  if (currentPage === 1) {
    return;
  }
  if (zipCode != 0) {
    data = await model.getEventsByZipCode(--currentPage, zipCode, sliderValue);
    concertsView.renderEvents(data);
    concertsView.renderVenuesMap(data);
    concertsView.renderPriceTable(data);
    updateButtonState();
  } else {
    data = await model.getEvents(--currentPage);
    concertsView.renderEvents(data);
    concertsView.renderVenuesMap(data);
    concertsView.renderPriceTable(data);
    updateButtonState();
  }
});

play_button_nodeList.forEach(async function (button, index) {
  button.addEventListener("click", async function () {
    let data;

    if (zipCode !== 0) {
      data = await model.getEventsByZipCode(currentPage, zipCode, sliderValue);
    } else {
      data = await model.getEvents(currentPage);
    }

    if (
      data &&
      data.events &&
      data.events[index] &&
      data.events[index].performers &&
      data.events[index].performers[0]
    ) {
      const name = data.events[index].performers[0].name;
      await model.searchArtistPlaylist(name);
      const artistData = model.searchArtistStats(name);
      const playlistData = await model.searchArtistPlaylist(name);
      // console.log(playlistData);
      concertsView.renderEmbeddedPlaylist(playlistData);
      playlist_section.scrollIntoView({ behavior: "smooth" });
    }
  });
});

venue_button_nodeList.forEach(async function (button, index) {
  button.addEventListener("click", async function () {
    let data;
    if (zipCode !== 0) {
      data = await model.getEventsByZipCode(currentPage, zipCode, sliderValue);
    } else {
      data = await model.getEvents(currentPage);
    }

    if (
      data &&
      data.events &&
      data.events[index] &&
      data.events[index].performers &&
      data.events[index].performers[0]
    ) {
      const venue_url = data.events[index].url;
      window.open(venue_url, "_blank");
    }
  });
});

// initializing button state
updateButtonState();

// show events near the location of the user
home_button.addEventListener("click", async function () {
  console.log(homeZipCode);
  data = await model.getEventsByZipCode(currentPage, homeZipCode, sliderValue);
  concertsView.renderEvents(data);
  concertsView.renderVenuesMap(data);
  concertsView.renderPriceTable(data);
  concertsView.renderConcertsFoundMessage(data);
  zipCode = homeZipCode;
});

// Further implemenation:
/*
 - add a functionality of a button that will take the user back to the results of their home zip code(instead of reloading the page) (DONE)
 - add button to take the user to the venue ticket website (DONE)
 - add ticket price table (DONE)
 - add venues map (DONE)
 - add "calculate distance from" the current homeZipCode (In progress)
 - add login functionality (in progress)
 - improve overall appearance of the website: text, colors, spacing, 
 - add spinner and effects
 - maybe make the website responsive? if time allows it

*/
