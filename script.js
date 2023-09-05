import api from "./api.js";

const currentLocation = document.querySelector(".current_location");
const performanceNodeList = document.querySelectorAll(".performance_info_row");
const performanceImageList = document.querySelectorAll(".performance_column");

//////////////////////////
const clientId = api.client_id;
/////////////////////////

console.log(performanceNodeList);

const getEvents = async function () {
  try {
    // defining parameters
    const queryParams = new URLSearchParams({
      geoip: true,
      type: "concert",
      per_page: 6,
      range: "50mi",
      client_id: clientId,
      //postal_code: 10001,
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
const infoMarkup = (title, venue, date) => {
  return `
    <div class="performance_title">${title}</div>
    <h1>${venue}</h1>
    <h1>${date}</h1>
  `;
};
console.log(getEvents());

getEvents().then((data) => {
  // checking if there is data coming from getEvents()
  if (data && data.events) {
    // save the events as an array of objects
    const events = data.events;

    // getting the city based on goeolaction
    console.log(`Your City: ${data.meta.geolocation.city}`);

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
        const formattedDatetime = datetime.toLocaleDateString("en-US", options);

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
});

// implement rendering of the data into the html
