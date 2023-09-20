import api from "../../api.js";
const clientId = api.client_id;

// getting info from from the SeatGeek API
export const getEvents = async function (page = 1) {
  try {
    // defining parameters
    const queryParams = new URLSearchParams({
      geoip: true,
      type: "concert",
      per_page: 6,
      range: "50mi",

      client_id: clientId,
      page: page,
    });

    const url = `https://api.seatgeek.com/2/events?${queryParams}`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    alert(err);
  }
};

export const getEventsByZipCode = async function (page = 1, postalCode) {
  try {
    // defining parameters
    const queryParams = new URLSearchParams({
      geoip: true,
      type: "concert",
      per_page: 6,
      range: "50mi",

      client_id: clientId,
      postal_code: postalCode,
      page: page,
    });

    const url = `https://api.seatgeek.com/2/events?${queryParams}`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    alert(err);
  }
};
