// index.js

const baseURL = "http://localhost:3000/ramens";

// Callbacks
const handleClick = (ramen) => {
  document.getElementById("ramen-detail").innerHTML = `
    <img src="${ramen.image}" alt="${ramen.name}" />
    <h2>${ramen.name}</h2>
    <h3>${ramen.restaurant}</h3>
    <p id="ramen-comment">${ramen.comment}</p>
    <p id="ramen-rating">Rating: ${ramen.rating}</p>
    <button id="delete-ramen">Delete</button>
  `;

  document.getElementById("new-rating").value = ramen.rating;
  document.getElementById("new-comment").value = ramen.comment;

  document
    .getElementById("delete-ramen")
    .addEventListener("click", () => deleteRamen(ramen.id));
};

const addSubmitListener = () => {
  document.getElementById("new-ramen").addEventListener("submit", function (e) {
    e.preventDefault();

    const newRamen = {
      name: e.target.name.value,
      restaurant: e.target.restaurant.value,
      image: e.target.image.value,
      rating: e.target.rating.value,
      comment: e.target["new-comment"].value,
    };

    // Call function to create a new ramen (POST request)
    createRamen(newRamen);
    e.target.reset();
  });
};

const displayRamens = () => {
  fetch(baseURL)
    .then((res) => res.json())
    .then((ramens) => {
      const ramenMenu = document.getElementById("ramen-menu");
      ramenMenu.innerHTML = "";
      ramens.forEach((ramen, index) => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.addEventListener("click", () => handleClick(ramen));
        ramenMenu.appendChild(img);

        // Display first ramen on page load
        if (index === 0) handleClick(ramen);
      });
    });
};

// Function to create a new ramen via POST request
const createRamen = (ramen) => {
  fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ramen),
  })
    .then((res) => res.json())
    .then((newRamen) => {
      const ramenMenu = document.getElementById("ramen-menu");
      const img = document.createElement("img");
      img.src = newRamen.image;
      img.alt = newRamen.name;
      img.addEventListener("click", () => handleClick(newRamen));
      ramenMenu.appendChild(img);
    });
};

const main = () => {
  displayRamens();
  addSubmitListener();
  addEditListener();
};

// Add edit listener to update ramen
function addEditListener() {
  document
    .getElementById("edit-ramen")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const updatedRating = e.target["new-rating"].value;
      const updatedComment = e.target["new-comment"].value;

      document.getElementById(
        "ramen-rating"
      ).textContent = `Rating: ${updatedRating}`;
      document.getElementById("ramen-comment").textContent = updatedComment;
    });
}

function deleteRamen(id) {
  document.getElementById("ramen-detail").innerHTML = "";
  document.getElementById("ramen-menu").innerHTML = "";
  fetch(`${baseURL}/${id}`, { method: "DELETE" }).then(() => displayRamens());
}

main();

// Export functions for testing
export { displayRamens, addSubmitListener, handleClick, main };
