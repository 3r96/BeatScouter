import api from "../../api.js";
const clientId = api.client_id;
const spotify_client_id = api.spotify_client_id;
const spotify_client_secret = api.spotify_client_secret;

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
    const jsonString = JSON.stringify(data);
    // console.log(jsonString);
    return data;
  } catch (err) {
    alert(err);
  }
};

export const getEventsByZipCode = async function (page, postalCode, range) {
  try {
    // defining parameters
    const queryParams = new URLSearchParams({
      geoip: true,
      type: "concert",
      per_page: 6,
      range: range,

      client_id: clientId,
      postal_code: postalCode,
      page: page,
    });

    const url = `https://api.seatgeek.com/2/events?${queryParams}`;

    const res = await fetch(url);
    const data = await res.json();
    //console.log(data);
    return data;
  } catch (err) {
    alert(err);
  }
};

/////////////////// Spotify API ////////////////
const token = null;
// getting token
const getSpotifyToken = async function () {
  const result = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(spotify_client_id + ":" + spotify_client_secret),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();
  return data.access_token;
};

// search for an artist on spotify(unn)
export const searchArtistStats = async function (artistName) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURI(artistName)}&type=artist`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log(data);
  return console.log(
    `Followers on Spotify: ${data.artists.items[0].followers.total}`
  );
};

// search for a "THIS IS" playlist
export const searchArtistPlaylist = async function (artistName) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=This is ${encodeURI(
      artistName
    )}&type=playlist`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

//
export async function initMap(markers) {
  // 25.904049468784294, -80.33583358363427

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: markers[0].lat, lng: markers[0].lon }, // Set the initial map center
    zoom: 10, // Set the initial zoom level
  });

  // user location(we need to use a different marker so we can differentiate from the venues markers)
  // const userMarker = new google.maps.Marker({
  //   position: { lat: 25.904049468784294, lng: -80.33583358363427 },
  //   map: map,
  //   title: "user location",
  // });

  for (let i = 0; i < markers.length; i++) {
    const venueMarker = new google.maps.Marker({
      position: { lat: markers[i].lat, lng: markers[i].lon },
      map: map,
      title: markers[i].name,
    });
  }
}
