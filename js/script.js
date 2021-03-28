// ------------------------------------------
//  VARIABLE CONSTANTS
// ------------------------------------------
const gallery = document.getElementById("gallery");
const modalContainer = document.createElement("div");
modalContainer.className = "modal-container";
document.body.appendChild(modalContainer);
// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
  return fetch(url)
    .then(checkStaus)
    .then((res) => res.json())
    .catch((error) => console.log("problem", error));
}
// Check Status of API
function checkStaus(response) {
  if (response) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

fetchData("https://randomuser.me/api/?results=12&nat=gb").then((res) => {
  const results = res.results;

  createImage(results);
  createSearch();
  searchName(results);
  createModalWindow(results);
  modalWindowNav(results);
});

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
//Function that creates a card for each profile and inserts into gallery element
function createImage(data) {
  const gallery = document.getElementById("gallery");
  const profile = data
    .map(
      (img) => `<div class="card">
                    <div class = "card-img-container" >
                        <img class="card-img" src=${img.picture.large} alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${img.name.first} ${img.name.last}</h3>
                        <p class="card-text">${img.email}</p>
                        <p class="card-text cap">${img.location.city}, ${img.location.state}</p>
                    </div>
                </div>`
    )
    .join("");
  gallery.innerHTML = profile;
}

//Function that creates search bar
const createSearch = () => {
  const searchContainer = document.querySelector(".search-container");
  const search = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                </form>`;
  searchContainer.innerHTML = search;
};

//Function that hides cards that characters are not included in serach text
function searchName(data) {
  const input = document.querySelector("#search-input");
  const names = document.querySelectorAll("#name");

  names.forEach((name) => {
    const cardDiv = name.parentElement.parentElement;
    input.addEventListener("keyup", (e) => {
      let inputValue = e.target.value.toLowerCase();

      if (name.textContent.toLowerCase().includes(inputValue)) {
        cardDiv.style.display = "";
      } else {
        cardDiv.style.display = "none";
      }
    });
  });
}

//Function that creates a modal window for selected card
function createModalWindow(data) {
  const window = `<div class="modal">
                     <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                     
                     <div class="modal-info-container"></div>

                    <div class="modal-btn-container">
                      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                      <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                  </div>`;
  modalContainer.insertAdjacentHTML("afterbegin", window);
  divCard = document.querySelectorAll(".card");
  modalContainer.style.display = "none";

  for (let i = 0; i < divCard.length; i++) {
    divCard[i].addEventListener("click", () => {
      modalContent(data[i]);
      modalContainer.style.display = "block";
    });
  }
}

//Function that navigates the modal window and closes it
function modalWindowNav(data, index) {
  const modalNext = document.querySelector("#modal-next");
  const modalPrev = document.querySelector("#modal-prev");
  const cards = document.querySelectorAll(".card");
  const closeBtn = document.querySelector(".modal-close-btn").children[0];

  closeBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      index = data.indexOf(data[i]);
      if (index === 0) {
        modalPrev.style.display = "none";
      }
    });
  }

  modalNext.addEventListener("click", () => {
    index++;
    if (index <= data.length) {
      modalContent(data[index]);
    } else if (index >= data.length) {
      index = -1;
    }

    //removes next button if it reaches last card
    if (index === data.length - 1) {
      modalNext.style.display = "none";
    } else if (index < data.length) {
      modalPrev.style.display = "block";
    }
  });

  modalPrev.addEventListener("click", () => {
    index--;
    if (index <= -1) {
      index = -1;
    } else if (index <= data.length) {
      modalContent(data[index]);
    }

    //removes prev button if it reaches first card
    if (index < data.length) {
      modalNext.style.display = "block";
    }
    if (index === 0) {
      modalPrev.style.display = "none";
    }
  });
}

//Function tht adds content to modal window
function modalContent(data) {
  const modalContainer = document.querySelector(".modal-info-container");
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const dob = `${data.dob.date.substring(0, 10)}`;
  const cell = `${data.cell.substring(0, 14)}`;
  const cellRegex = /^.(\d{3}).-(\d{3})-(\d{4})$/;

  const profile = `<img class="modal-img" src="${
    data.picture.large
  }" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${
                          data.name.first
                        } ${data.name.last}</h3>
                        <p class="modal-text">${data.email}</p>
                        <p class="modal-text cap">${data.location.city}</p>
                        <hr>
                        <p class="modal-text">${cell.replace(
                          cellRegex,
                          `($1) $2-$3`
                        )}</p>
                        <p class="modal-text">${data.location.state}, ${
    data.location.city
  }, ${data.location.country} ${data.location.postcode}</p>
                        <p class="modal-text">Birthday: ${dob.replace(
                          regex,
                          `$2/$3/$1`
                        )}</p>`;
  modalContainer.innerHTML = profile;
}
