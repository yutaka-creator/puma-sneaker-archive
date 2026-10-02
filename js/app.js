const sneakerGrid = document.querySelector("#sneaker-grid");
const sneakerCount = document.querySelector("#sneaker-count");

const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-button");

const sortSelect = document.querySelector("#sort-select");
const sneakerModal = document.querySelector("#sneaker-modal");
const modalContent = document.querySelector("#modal-content");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const scoreLabels = {
  design: "DESIGN",
  chunky: "CHUNKY",
  mechanical: "MECHANICAL",
  color: "COLOR",
  retroRunning: "RETRO RUNNING",
  wantToWear: "WANT TO WEAR",
  collection: "COLLECTION"
};
const dnaLabels = {
  structure: "STRUCTURE",
  tech: "TECH",
  retroFuture: "RETRO FUTURE",
  chunky: "CHUNKY"
};


let sortType = "number";
let selectedSeries = "ALL";
let searchKeyword = "";

function calculateAverage(scores) {

  const values = Object.values(scores);

  const total = values.reduce((sum, score) => {
    return sum + score;
  }, 0);

  return (total / values.length).toFixed(2);
}


function createStars(score) {

  let stars = "";

  for (let i = 1; i <= 5; i++) {

    if (i <= score) {
      stars += "★";
    } else {
      stars += "☆";
    }

  }

  return stars;
}


function createSneakerCard(sneaker) {

  const average = calculateAverage(sneaker.scores);

  const tags = sneaker.tags
    .map(tag => `<span class="tag">${tag}</span>`)
    .join("");


  return `
  <article
    class="sneaker-card"
    data-sneaker-id="${sneaker.id}"
  >

      <div class="sneaker-card__top">

        <span class="sneaker-number">
          ${sneaker.number}
        </span>

        <span class="sneaker-year">
          ${sneaker.year}
        </span>

      </div>


      <div class="sneaker-image">

        ${
          sneaker.image
            ? `<img src="${sneaker.image}" alt="${sneaker.name}">`
            : `<span>IMAGE COMING SOON</span>`
        }

      </div>


      <div class="sneaker-card__content">

        <p class="series">
          ${sneaker.series}
        </p>

        <h3>
          ${sneaker.name}
        </h3>


        <div class="tags">
          ${tags}
        </div>


        <div class="score">

          <span>MY SCORE</span>

          <strong>
            ${average}
          </strong>

        </div>


        <div class="mini-score">

          <span>DESIGN</span>

          <span>
            ${createStars(sneaker.scores.design)}
          </span>

        </div>


        <div class="mini-score">

          <span>MECHANICAL</span>

          <span>
            ${createStars(sneaker.scores.mechanical)}
          </span>

        </div>

      </div>

    </article>
  `;
}


function renderSneakers(list = sneakers) {

  sneakerGrid.innerHTML = list
    .map(createSneakerCard)
    .join("");

  sneakerCount.textContent =
    `${list.length} MODELS`;

}

function updateSneakers() {

  const filteredSneakers = sneakers.filter((sneaker) => {

    const matchesSeries =
      selectedSeries === "ALL" ||
      sneaker.series === selectedSeries;

    const searchableText = `
      ${sneaker.name}
      ${sneaker.series}
      ${sneaker.tags.join(" ")}
      ${sneaker.year}
    `.toLowerCase();

    const matchesSearch =
      searchableText.includes(searchKeyword);

    return matchesSeries && matchesSearch;

  });


  // 絞り込んだ後に並び替える
  const sortedSneakers =
    sortSneakers(filteredSneakers);

  // 並び替えたデータを表示
  renderSneakers(sortedSneakers);

}
searchInput.addEventListener("input", (event) => {

  searchKeyword =
    event.target.value
      .trim()
      .toLowerCase();

  updateSneakers();

});

filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    selectedSeries = button.dataset.series;


    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });


    button.classList.add("active");


    updateSneakers();

  });

});

function sortSneakers(list) {

  const sortedList = [...list];

  switch (sortType) {

    case "score":
      sortedList.sort((a, b) => {
        return (
          Number(calculateAverage(b.scores)) -
          Number(calculateAverage(a.scores))
        );
      });
      break;


    case "year":
      sortedList.sort((a, b) => {
        return b.year - a.year;
      });
      break;


    case "name":
      sortedList.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;


    default:
      sortedList.sort((a, b) => {
        return Number(a.number) - Number(b.number);
      });

  }

  return sortedList;
}

function openSneakerModal(sneakerId) {

  const sneaker = sneakers.find((item) => {
    return item.id === sneakerId;
  });

  if (!sneaker) {
    return;
  }

  const average = calculateAverage(sneaker.scores);

  modalContent.innerHTML = `

  <div class="modal-header">

    <p class="modal-meta">
      ${sneaker.number} / ${sneaker.series}
    </p>

    <h2 id="modal-title">
      ${sneaker.name}
    </h2>

    <p class="modal-year">
      ${sneaker.year}
    </p>

  </div>


  <div class="modal-image">

    ${
      sneaker.image
        ? `<img src="${sneaker.image}" alt="${sneaker.name}">`
        : `<span>IMAGE COMING SOON</span>`
    }

  </div>

  <div class="modal-description">

  <span class="modal-description__label">
    ABOUT
  </span>

  <p>
    ${sneaker.description}
  </p>

</div>

<section class="modal-section dna-section">

  <div class="modal-section-heading">
    <span>01</span>
    <h3>SNEAKER DNA</h3>
  </div>

  <div class="dna-list">
    ${createDnaRows(sneaker.dna)}
  </div>

</section>
  <section class="modal-section">

    <div class="modal-section-heading">
      <span>01</span>
      <h3>MY RATING</h3>
    </div>

    <div class="modal-scores">
      ${createScoreRows(sneaker.scores)}
    </div>

    <div class="modal-average">
      <span>MY SCORE</span>

      <strong>${average}</strong>

      <span>/ 5.00</span>
    </div>

  </section>
  <a
  href="./detail.html?id=${sneaker.id}"
  class="detail-button"
>
  <span>VIEW FULL ARCHIVE</span>
  <span>→</span>
</a>

`;

  sneakerModal.classList.add("is-open");
  sneakerModal.setAttribute("aria-hidden", "false");
}

function closeSneakerModal() {

  sneakerModal.classList.remove("is-open");
  sneakerModal.setAttribute("aria-hidden", "true");

}

function createScoreRows(scores) {

  return Object.entries(scores)
    .map(([key, score]) => {

      const label = scoreLabels[key];

      return `
        <div class="modal-score-row">

          <span class="modal-score-label">
            ${label}
          </span>

          <span class="modal-score-stars">
            ${createStars(score)}
          </span>

          <span class="modal-score-number">
            ${score}
          </span>

        </div>
      `;

    })
    .join("");
}

function createDnaRows(dna) {

  return Object.entries(dna)
    .map(([key, value]) => {

      const label = dnaLabels[key];

      const bars = Array.from(
        { length: 5 },
        (_, index) => {
          return `
            <span class="dna-block ${
              index < value ? "active" : ""
            }"></span>
          `;
        }
      ).join("");

      return `
        <div class="dna-row">

          <span class="dna-label">
            ${label}
          </span>

          <div class="dna-meter">
            ${bars}
          </div>

          <strong class="dna-value">
            ${value}
          </strong>

        </div>
      `;

    })
    .join("");
}


sneakerGrid.addEventListener("click", (event) => {

  const card = event.target.closest(".sneaker-card");

  if (!card) {
    return;
  }

  const sneakerId = card.dataset.sneakerId;

  openSneakerModal(sneakerId);

});

modalCloseButtons.forEach((button) => {

  button.addEventListener("click", () => {
    closeSneakerModal();
  });

});

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    closeSneakerModal();
  }

});
sortSelect.addEventListener("change", (event) => {

  sortType = event.target.value;

  updateSneakers();

});


updateSneakers();