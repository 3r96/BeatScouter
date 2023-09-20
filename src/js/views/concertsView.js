class ConcertsView {
  #currentLocation = document.querySelector(".current_location");
  #performanceNodeList = document.querySelectorAll(".performance_info");
  #performanceImageList = document.querySelectorAll(".performance_img");

  // this render method accepts the data coming from the controller to render it
  render(data) {
    const events = data.events;

    // clearing the current content
    this.#performanceNodeList.forEach((el) => {
      el.innerHTML = "";
    });
    this.#performanceImageList.forEach((el) => {
      el.innerHTML = "";
    });
    this.#currentLocation.innerHTML = "";

    // City location markup
    const locationMarkup = `
    <h2 class="header__location">
          Your location: 📌 <span class="highlight">${data.meta.geolocation.city}</span>
        </h2>
    `;
    // adding html for current city
    this.#currentLocation.insertAdjacentHTML("afterbegin", locationMarkup);
    // iterating performance Image Node list to display pics
    this.#performanceImageList.forEach(function (el, index) {
      const img = events[index].performers[0].image;
      el.insertAdjacentHTML(
        "afterbegin",
        `<img src=${img} class=performer_img>`
      );
    });

    // iterating performance info node list to display info for the concert
    this.#performanceNodeList.forEach(function (el, index) {
      const title = events[index].performers[0].name;
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
  renderCity(data) {
    // implement rendering city in this function.
    // Include an alert like... Events found near {city}
  }
}

export default new ConcertsView();
