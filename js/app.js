const sneakerGrid = document.querySelector("#sneaker-grid");
const sneakerCount = document.querySelector("#sneaker-count");

const searchInput = document.querySelector("#search-input");
const filterButtonsContainer = document.querySelector("#filter-buttons");

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
  collection: "COLLECTION",
};
const dnaLabels = {
  structure: "STRUCTURE",
  tech: "TECH",
  retroFuture: "RETRO FUTURE",
  chunky: "CHUNKY",
};
const clearCompareButton = document.querySelector("#clear-compare-button");
const compareResult = document.querySelector("#compare-result");

const compareStatus = document.querySelector("#compare-status");

const compareSelection = document.querySelector("#compare-selection");

const compareButton = document.querySelector("#compare-button");
const pagination = document.querySelector("#pagination");

const ITEMS_PER_PAGE = 12;
let currentPage = 1;

let sortType = "number";
let selectedSeries = "ALL";
let searchKeyword = "";
let compareSneakers = [];

function calculateAverage(scores) {
  const values = Object.values(scores);

  const total = values.reduce((sum, score) => {
    return sum + score;
  }, 0);

  return (total / values.length).toFixed(2);
}

function calculateTotal(scores) {
  return Object.values(scores).reduce((total, score) => total + score, 0);
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
    .map((tag) => `<span class="tag">${tag}</span>`)
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

      <button
  class="compare-select"
  type="button"
  data-compare-id="${sneaker.id}"
>
  + COMPARE
</button>

    </article>
  `;
}

function renderSneakers(list = sneakers) {
  sneakerGrid.innerHTML = list.map(createSneakerCard).join("");

  sneakerCount.textContent = `${list.length} MODELS`;
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

  // 並び替え
  const sortedSneakers =
    sortSneakers(filteredSneakers);

  // 全ページ数
  const totalPages = Math.ceil(
    sortedSneakers.length / ITEMS_PER_PAGE
  );

  // ページ数を超えないようにする
  if (currentPage > totalPages) {
    currentPage = Math.max(totalPages, 1);
  }

  // 今のページに表示する12足
  const start =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const end =
    start + ITEMS_PER_PAGE;

  const pageSneakers =
    sortedSneakers.slice(start, end);

  // カード表示
  renderSneakers(pageSneakers);

  // 件数は検索結果全体を表示
  sneakerCount.textContent =
    `${sortedSneakers.length} MODELS`;

  // ページ番号を作る
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  // 1ページしかない場合は非表示
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";

  // PREV
  html += `
    <button
      class="pagination-button"
      data-page="${currentPage - 1}"
      ${currentPage === 1 ? "disabled" : ""}
    >
      ← PREV
    </button>
  `;

  // ページ番号
  for (let page = 1; page <= totalPages; page++) {
    html += `
      <button
        class="pagination-button ${
          page === currentPage ? "active" : ""
        }"
        data-page="${page}"
      >
        ${page}
      </button>
    `;
  }

  // NEXT
  html += `
    <button
      class="pagination-button"
      data-page="${currentPage + 1}"
      ${currentPage === totalPages ? "disabled" : ""}
    >
      NEXT →
    </button>
  `;

  pagination.innerHTML = html;
}
searchInput.addEventListener("input", (event) => {
  searchKeyword = event.target.value.trim().toLowerCase();

  updateSneakers();
});

filterButtonsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) return;

  selectedSeries = button.dataset.series;

  const filterButtons =
    filterButtonsContainer.querySelectorAll(".filter-button");

  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  updateSneakers();
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

      const bars = Array.from({ length: 5 }, (_, index) => {
        return `
            <span class="dna-block ${index < value ? "active" : ""}"></span>
          `;
      }).join("");

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

function createFilterButtons() {
  const seriesList = [
    "ALL",
    ...new Set(sneakers.map((sneaker) => sneaker.series)),
  ];

  filterButtonsContainer.innerHTML = seriesList
    .map((series) => {
      return `
          <button
            class="filter-button ${series === "ALL" ? "active" : ""}"
            data-series="${series}"
          >
            ${series}
          </button>
        `;
    })
    .join("");
}

function toggleCompareSneaker(sneakerId) {
  const isSelected = compareSneakers.includes(sneakerId);

  if (isSelected) {
    compareSneakers = compareSneakers.filter((id) => id !== sneakerId);
  } else {
    if (compareSneakers.length >= 2) return;

    compareSneakers.push(sneakerId);
  }

  updateCompareUI();
}

function updateCompareUI() {
  compareStatus.textContent = `${compareSneakers.length} / 2 SELECTED`;

  const selectedSneakers = compareSneakers
    .map((id) => sneakers.find((sneaker) => sneaker.id === id))
    .filter(Boolean);

  compareSelection.innerHTML = [0, 1]
    .map((index) => {
      const sneaker = selectedSneakers[index];

      if (!sneaker) {
        return `
          <div class="compare-slot">
            <span>0${index + 1}</span>
            <strong>SELECT SNEAKER</strong>
          </div>
        `;
      }

      return `
        <div class="compare-slot">
          <span>0${index + 1}</span>
          <strong>${sneaker.name}</strong>
        </div>
      `;
    })
    .join("");

  compareButton.disabled = compareSneakers.length !== 2;

  document.querySelectorAll(".compare-select").forEach((button) => {
    const isSelected = compareSneakers.includes(button.dataset.compareId);

    button.classList.toggle("is-selected", isSelected);

    button.textContent = isSelected ? "✓ SELECTED" : "+ COMPARE";
  });
}

function renderComparison(sneakerA, sneakerB) {
  const scoreA = calculateAverage(sneakerA.scores);
  const scoreB = calculateAverage(sneakerB.scores);
  const totalA = calculateTotal(sneakerA.scores);
  const totalB = calculateTotal(sneakerB.scores);

  compareResult.innerHTML = `
    <div class="comparison-header">
      <span>COMPARE RESULT</span>
      <button
        id="close-comparison"
        type="button"
      >
        × CLOSE
      </button>
    </div>

    <div class="comparison-models">

      <div class="comparison-model">
        <span>${sneakerA.number} / ${sneakerA.year}</span>

        <h2>${sneakerA.name}</h2>

        ${
          sneakerA.image
            ? `<img src="${sneakerA.image}" alt="${sneakerA.name}">`
            : `<div class="comparison-no-image">NO IMAGE</div>`
        }

        <div class="comparison-score">
          <span>MY SCORE</span>
          <strong>${scoreA}</strong>
        </div>
      </div>

      <div class="comparison-vs">
        VS
      </div>

      <div class="comparison-model">
        <span>${sneakerB.number} / ${sneakerB.year}</span>

        <h2>${sneakerB.name}</h2>

        ${
          sneakerB.image
            ? `<img src="${sneakerB.image}" alt="${sneakerB.name}">`
            : `<div class="comparison-no-image">NO IMAGE</div>`
        }

        <div class="comparison-score">
          <span>MY SCORE</span>
          <strong>${scoreB}</strong>
        </div>
      </div>
      

    </div>
<section class="comparison-dna">

  <div class="comparison-section-title">
    <span>01</span>
    <h3>SNEAKER DNA</h3>
  </div>

  <div class="comparison-dna-list">
    ${createComparisonDna(sneakerA, sneakerB)}
  </div>

</section>

<section class="comparison-rating">

  <div class="comparison-section-title">
    <span>02</span>
    <h3>MY RATING</h3>
  </div>

  <div class="comparison-rating-list">
    ${createComparisonScores(sneakerA, sneakerB)}
  </div>

</section>
<section class="comparison-final">

  <div class="comparison-section-title">
    <span>03</span>
    <h3>FINAL SCORE</h3>
  </div>

  <div class="final-score-grid">

    <div class="final-score-item">
      <span>${sneakerA.name}</span>

      <strong>${scoreA}</strong>

      <small>
        ${totalA} / 35
      </small>
    </div>

    <div class="final-score-vs">
      VS
    </div>

    <div class="final-score-item">
      <span>${sneakerB.name}</span>

      <strong>${scoreB}</strong>

      <small>
        ${totalB} / 35
      </small>
    </div>

  </div>

</section>
  `;

  compareResult.hidden = false;

  compareResult.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  const closeComparisonButton = document.querySelector("#close-comparison");

  closeComparisonButton.addEventListener("click", () => {
    compareResult.hidden = true;
  });
}

function createComparisonDna(sneakerA, sneakerB) {
  return Object.keys(dnaLabels)
    .map((key) => {
      const label = dnaLabels[key];

      const valueA = sneakerA.dna[key];
      const valueB = sneakerB.dna[key];

      return `
        <div class="comparison-dna-row">

          <div class="comparison-dna-value left">
            <strong>${valueA}</strong>
            <div class="comparison-dna-bar">
              ${createDnaBlocks(valueA)}
            </div>
          </div>

          <span class="comparison-dna-label">
            ${label}
          </span>

          <div class="comparison-dna-value right">
            <div class="comparison-dna-bar">
              ${createDnaBlocks(valueB)}
            </div>
            <strong>${valueB}</strong>
          </div>

        </div>
      `;
    })
    .join("");
}

function createDnaBlocks(value) {
  return Array.from({ length: 5 }, (_, index) => {
    return `
      <span
        class="comparison-dna-block ${index < value ? "active" : ""}"
      ></span>
    `;
  }).join("");
}

function createComparisonScores(sneakerA, sneakerB) {
  return Object.keys(scoreLabels)
    .map((key) => {
      const label = scoreLabels[key];

      const scoreA = sneakerA.scores[key];
      const scoreB = sneakerB.scores[key];

      return `
        <div class="comparison-rating-row">

          <div class="comparison-rating-value left">
            <span>${createStars(scoreA)}</span>
            <strong>${scoreA}</strong>
          </div>

          <span class="comparison-rating-label">
            ${label}
          </span>

          <div class="comparison-rating-value right">
            <strong>${scoreB}</strong>
            <span>${createStars(scoreB)}</span>
          </div>

        </div>
      `;
    })
    .join("");
}

sneakerGrid.addEventListener("click", (event) => {
  const compareButton = event.target.closest(".compare-select");

  if (compareButton) {
    const sneakerId = compareButton.dataset.compareId;

    toggleCompareSneaker(sneakerId);

    return;
  }

  const card = event.target.closest(".sneaker-card");

  if (!card) return;

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

compareButton.addEventListener("click", () => {
  if (compareSneakers.length !== 2) return;

  const sneakerA = sneakers.find(
    (sneaker) => sneaker.id === compareSneakers[0],
  );

  const sneakerB = sneakers.find(
    (sneaker) => sneaker.id === compareSneakers[1],
  );

  if (!sneakerA || !sneakerB) return;

  renderComparison(sneakerA, sneakerB);
});

clearCompareButton.addEventListener("click", () => {
  compareSneakers = [];

  updateCompareUI();

  compareResult.hidden = true;
});

pagination.addEventListener("click", (event) => {
  const button = event.target.closest(".pagination-button");

  if (!button || button.disabled) return;

  currentPage = Number(button.dataset.page);

  updateSneakers();

  // ページを切り替えたら一覧の上まで戻る
  document.querySelector(".archive").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
createFilterButtons();
updateSneakers();
