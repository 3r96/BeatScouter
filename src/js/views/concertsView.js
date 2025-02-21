import * as model from "../model.js";

class ConcertsView {
  #currentLocation = document.querySelector(".current_location");
  #performanceNodeList = document.querySelectorAll(".performance_info");
  #performanceImageList = document.querySelectorAll(".performance_img");
  #concertsFoundMessage = document.querySelector(".found_concerts");
  #results = document.querySelector(".results");
  #spinnerContainer = document.querySelector(".spinner-container");
  #spotifyPlaylist = document.querySelector(".spotify_playlist");
  #performanceColumn = document.querySelector(".performance_column");
  #priceTable = document.querySelector(".price_table_section");
  #venuesMap = document.querySelector(".venues_map_section");

  renderUserLocation(data) {
    // City location markup

    const locationMarkup = `
    <h2 class="header__location">
          Your location: 📌 <span class="highlight">${data.meta.geolocation.city}</span>
        </h2>
    `;
    // adding html for current city
    this.#currentLocation.insertAdjacentHTML("afterbegin", locationMarkup);
  }
  // this render method accepts the data coming from the controller to render it
  renderEvents(data) {
    const events = data.events;
    console.log(data);

    // clearing the current content
    this.#performanceNodeList.forEach((el) => {
      el.innerHTML = "";
    });
    this.#performanceImageList.forEach((el) => {
      el.innerHTML = "";
    });
    this.#spinnerContainer.classList.remove("hidden");
    setTimeout(() => {
      this.#spinnerContainer.classList.add("hidden");
      this.#results.classList.remove("hidden");
    }, 2000);

    // iterating performance Image Node list to display pics
    this.#performanceImageList.forEach(function (el, index) {
      let img;
      if (events[index].performers[0].image == null) {
        img =
          "https://img.freepik.com/free-vector/open-air-concert_23-2148653265.jpg";
      } else {
        img = events[index].performers[0].image;
      }

      // console.log(img);

      el.insertAdjacentHTML(
        "afterbegin",
        `<img src=${img} class=performer_img>`
      );
    });
    //console.log(this.#performanceNodeList);
    // iterating performance info node list to display info for the concert
    this.#performanceNodeList.forEach(function (el, index) {
      const title = events[index].performers[0].name.slice(0, 30);
      const venue = events[index].venue.name;
      const datetime = new Date(events[index].datetime_utc);
      const options = {
        // year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      // datetime for the event
      const formattedDatetime = datetime.toLocaleDateString("en-US", options);

      // generating info markup for the events
      const infoMarkup = `<div class="performance_title">${title}</div>
      <h1>${venue}</h1>
      <h1>${formattedDatetime} </h1>`;
      el.insertAdjacentHTML("afterbegin", infoMarkup);
    });
  }
  renderConcertsFoundMessage(data) {
    this.#concertsFoundMessage.innerHTML = "";
    // concerts found markup
    const concertsFoundMarkup = `<h1 class="found-concerts">✅Concerts found near ${data.meta.geolocation.city}!</h1>`;
    this.#concertsFoundMessage.insertAdjacentHTML(
      "afterbegin",
      concertsFoundMarkup
    );
  }
  renderInvalidZipCode() {
    this.#concertsFoundMessage.innerHTML = "";
    // concerts found markup
    const concertsFoundMarkup = `<h1 class="found-concerts" style="background-color: #e88d8d; color: #5d1212;">🚨Invalid zip code</h1>`;
    this.#concertsFoundMessage.insertAdjacentHTML(
      "afterbegin",
      concertsFoundMarkup
    );
  }
  renderEmbeddedPlaylist(data) {
    this.#spotifyPlaylist.innerHTML = "";
    console.log(data);
    if (
      !data ||
      !data.playlists ||
      !data.playlists.items ||
      data.playlists.items.length === 0
    ) {
      console.error("No playlists found.");
      return;
    }

    // Filter out null values and get the first valid playlist
    const validPlaylists = data.playlists.items.filter((item) => item !== null);

    if (validPlaylists.length === 0) {
      console.error("No valid playlists found.");
      return;
    }

    const playlistId = validPlaylists[0].id; // Get the first valid playlist ID
    console.log("Embedding playlist:", playlistId);

    this.#spotifyPlaylist.insertAdjacentHTML(
      "afterbegin",
      `
      <iframe 
        src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" 
        width="900" height="700" 
        style="border:none;" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        frameborder="0">
      </iframe>
      `
    );
  }
  formatDate(date) {
    const datetime = new Date(date);
    const options = {
      // year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    // datetime for the event
    const formattedDatetime = datetime.toLocaleDateString("en-US", options);
    return formattedDatetime;
  }
  formatPrice(price) {
    if (price) {
      const formattedPrice = price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      return formattedPrice;
    } else {
      return `N/A`;
    }
  }
  renderPriceTable(data) {
    this.#priceTable.innerHTML = "";
    var artists = [
      {
        name: "Artists",
        minPrice: "Minimum Prices",
        maxPrice: "Highest Prices",
      },
      {
        name: `${data.events[0].performers[0].name} - ${this.formatDate(
          data.events[0].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[0].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[0].stats.highest_price),
      },
      {
        name: `${data.events[1].performers[0].name} - ${this.formatDate(
          data.events[1].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[1].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[1].stats.highest_price),
      },
      {
        name: `${data.events[2].performers[0].name} - ${this.formatDate(
          data.events[2].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[2].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[2].stats.highest_price),
      },
      {
        name: `${data.events[3].performers[0].name} - ${this.formatDate(
          data.events[3].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[3].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[3].stats.highest_price),
      },
      {
        name: `${data.events[4].performers[0].name} - ${this.formatDate(
          data.events[4].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[4].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[4].stats.highest_price),
      },
      {
        name: `${data.events[5].performers[0].name} - ${this.formatDate(
          data.events[5].datetime_utc
        )}`,
        minPrice: this.formatPrice(data.events[5].stats.lowest_price),
        maxPrice: this.formatPrice(data.events[5].stats.highest_price),
      },
    ];

    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    for (var i = 0; i < artists.length; i++) {
      var row = document.createElement("tr");

      var nameCell = document.createElement("td");
      var minPriceCell = document.createElement("td");
      var maxPriceCell = document.createElement("td");

      nameCell.textContent = artists[i].name;
      minPriceCell.textContent = artists[i].minPrice;
      maxPriceCell.textContent = artists[i].maxPrice;

      row.appendChild(nameCell);
      row.appendChild(minPriceCell);
      row.appendChild(maxPriceCell);

      tableBody.append(row);
    }

    table.appendChild(tableBody);
    this.#priceTable.appendChild(table);

    // console.log(data.events[0].performers[0].name);
    // console.log(data.events[0].stats.lowest_price);
  }
  renderVenuesMap(data) {
    //markers for venues
    const markers = [];

    // Storing the venue name and location in an array of objects
    for (let i = 0; i < data.events.length; i++) {
      const venue = {
        name: data.events[i].venue.name,
        lat: data.events[i].venue.location.lat,
        lon: data.events[i].venue.location.lon,
      };
      markers.push(venue);
    }
    console.log(markers);

    model.initMap(markers);
  }
}

export default new ConcertsView();
