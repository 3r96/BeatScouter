import api from "./api.js";

const currentLocation = document.querySelector(".current_location");
const performanceNodeList = document.querySelectorAll(".performance_info");
const performanceImageList = document.querySelectorAll(".performance_img");
const prev_button = document.querySelector(".prev_button");
const next_button = document.querySelector(".next_button");

//////////////////////////
const clientId = api.client_id;
/////////////////////////

console.log(performanceNodeList);
console.log(performanceImageList);

const getEvents = async function (page = 1) {
  try {
    // defining parameters
    const queryParams = new URLSearchParams({
      geoip: true,
      type: "concert",
      per_page: 6,
      range: "50mi",
      client_id: clientId,
      //postal_code: 10001,
      page: page,
    });

    const url = `https://api.seatgeek.com/2/events?${queryParams}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    alert(err);
  }
};

///////////////////// MARKUPS ////////////////////
function infoMarkup(title, venue, date) {
  return `
    <div class="performance_title">${title}</div>
    <h1>${venue}</h1>
    <h1>${date} </h1>
  `;
}
//console.log(getEvents());

async function displayData(page) {
  try {
    const data = await getEvents(page);
    if (data && data.events) {
      const events = data.events;
      console.log(`Your City: ${data.meta.geolocation.city}`);

      // clearing the current content
      performanceNodeList.forEach((el) => {
        el.innerHTML = "";
      });

      performanceImageList.forEach((el) => {
        el.innerHTML = "";
      });
      currentLocation.innerHTML = "";

      const locationMarkup = `
    <h2 class="header__location">
          Your location: 📌 <span class="highlight">${data.meta.geolocation.city}</span>
        </h2>
    `;
      currentLocation.insertAdjacentHTML("afterbegin", locationMarkup);

      // iterating thru the nodelist and the events object
      performanceNodeList.forEach(function (el, index) {
        if (index < events.length) {
          const title = events[index].performers[0].name;
          const venue = events[index].venue.name;
          console.log(venue);
          const datetime = new Date(events[index].datetime_utc);
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          };

          // datetime for the event
          const formattedDatetime = datetime.toLocaleDateString(
            "en-US",
            options
          );

          // const performerImg = events[index].performers[0].image;

          el.insertAdjacentHTML(
            "afterbegin",
            infoMarkup(title, venue, formattedDatetime)
          );

          // el.insertAdjacentHTML("afterbegin", `<img src=${performerImg}></img.`);
        }
      });
      performanceImageList.forEach(function (el, index) {
        const img = events[index].performers[0].image;
        el.insertAdjacentHTML(
          "afterbegin",
          `<img src=${img} class=performer_img></img.`
        );
      });
    } else {
      console.log("No events data found.");
    }
  } catch (error) {
    console.log(error);
  }
}

let currentPage = 1;
displayData(currentPage);
next_button.addEventListener("click", function () {
  displayData(++currentPage);
});
prev_button.addEventListener("click", function () {
  if (currentPage == 1) {
    return;
  }
  displayData(--currentPage);
});

///////////////////////////////////////////////////
// getEvents().then((data) => {
//   // checking if there is data coming from getEvents()
//   if (data && data.events) {
//     // save the events as an array of objects
//     const events = data.events;

//     // getting the city based on goeolaction
//     console.log(`Your City: ${data.meta.geolocation.city}`);

//     const locationMarkup = `
//     <h2 class="header__location">
//           Your location: 📌 <span class="highlight">${data.meta.geolocation.city}</span>
//         </h2>
//     `;
//     currentLocation.insertAdjacentHTML("afterbegin", locationMarkup);

//     // iterating thru the nodelist and the events object
//     performanceNodeList.forEach(function (el, index) {
//       if (index < events.length) {
//         const title = events[index].performers[0].name;
//         const venue = events[index].venue.name;
//         console.log(venue);
//         const datetime = new Date(events[index].datetime_utc);
//         const options = {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         };

//         // datetime for the event
//         const formattedDatetime = datetime.toLocaleDateString("en-US", options);

//         // const performerImg = events[index].performers[0].image;

//         el.insertAdjacentHTML(
//           "afterbegin",
//           infoMarkup(title, venue, formattedDatetime)
//         );

//         // el.insertAdjacentHTML("afterbegin", `<img src=${performerImg}></img.`);
//       }
//     });
//     performanceImageList.forEach(function (el, index) {
//       const img = events[index].performers[0].image;
//       el.insertAdjacentHTML(
//         "afterbegin",
//         `<img src=${img} class=performer_img></img.`
//       );
//     });
//   } else {
//     console.log("No events data found.");
//   }
// });

// async function handleNextPageClick(){
//   currentPage++;
//   try{
//     const eventsData = await getEvents(currentPage);
//   }
// };

// implement rendering of the data into the html
