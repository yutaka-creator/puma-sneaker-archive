// ========================================
// URL PARAMETER
// ========================================

// URLの情報を取得
const params = new URLSearchParams(
  window.location.search
);

// ?id=○○ の部分を取得
const sneakerId = params.get("id");


// ========================================
// FIND SNEAKER
// ========================================

// sneakers.jsから該当する1足を探す
const sneaker = sneakers.find((item) => {
  return item.id === sneakerId;
});


const detailContent =
  document.querySelector("#detail-content");


// ========================================
// NOT FOUND
// ========================================

if (!sneaker) {

  detailContent.innerHTML = `
    <section class="not-found">

      <p>404 / SNEAKER NOT FOUND</p>

      <h1>
        MODEL NOT FOUND
      </h1>

      <a href="./index.html">
        ← BACK TO ARCHIVE
      </a>

    </section>
  `;


// ========================================
// DETAIL PAGE
// ========================================

} else {

  document.title =
    `${sneaker.name} | PUMA SNEAKER ARCHIVE`;


  detailContent.innerHTML = `

    <section class="detail-hero">

      <div class="detail-hero__meta">

        <span>
          ${sneaker.number}
        </span>

        <span>
          ${sneaker.series}
        </span>

        <span>
          ${sneaker.year}
        </span>

      </div>


      <h1>
        ${sneaker.name}
      </h1>


      <div class="detail-hero__image">

        ${
          sneaker.image

            ? `
              <img
                id="main-sneaker-image"
                src="${sneaker.image}"
                alt="${sneaker.name}"
              >
            `

            : `
              <span>
                IMAGE COMING SOON
              </span>
            `
        }

      </div>


      <div class="detail-intro">

        <span>
          ABOUT
        </span>

        <p>
          ${sneaker.description}
        </p>

      </div>

    </section>


    <div class="archive-sections">

      ${createDetailSections(sneaker.details)}

    </div>


    ${createColorways(sneaker.colorways)}


    <section class="sources-section">

      <div class="sources-section__number">
        ${getSourcesNumber(sneaker)}
      </div>

      <div class="sources-section__content">

        <h2>
          SOURCES
        </h2>

        <div class="source-list">
          ${createSourceList(sneaker.sources)}
        </div>

      </div>

    </section>

  `;


  // COLORWAYSがある場合だけ
  // クリックイベントを設定
  setupColorwayButtons();

}


// ========================================
// DETAIL SECTIONS
// ========================================

function createDetailSections(details) {

  if (!details) {
    return "";
  }

  return Object.values(details)
    .map((section, index) => {

      const number =
        String(index + 1).padStart(2, "0");

      return `
        <section class="archive-section">

          <div class="archive-section__number">
            ${number}
          </div>

          <div class="archive-section__content">

            <h2>
              ${section.title}
            </h2>

            <p>
              ${section.text}
            </p>

          </div>

        </section>
      `;

    })
    .join("");
}


// ========================================
// COLORWAYS
// ========================================

function createColorways(colorways) {

  // colorwaysがないモデルは何も表示しない
  if (!colorways || colorways.length === 0) {
    return "";
  }


  return `
    <section class="colorways-section">

      <div class="colorways-section__number">
        COLORWAYS
      </div>


      <div class="colorways-section__content">

        <h2>
          COLOR VARIATIONS
        </h2>


        <div class="colorway-list">

          ${colorways.map((colorway, index) => {

            return `
              <button
                class="colorway-item ${
                  index === 0 ? "active" : ""
                }"
                data-colorway-id="${colorway.id}"
                type="button"
              >

                <div class="colorway-image">

                  <img
                    src="${colorway.image}"
                    alt="${colorway.name}"
                    loading="lazy"
                  >

                </div>


                <span class="colorway-name">
                  ${colorway.name}
                </span>


                ${
                  colorway.style

                    ? `
                      <span class="colorway-style">
                        STYLE ${colorway.style}
                      </span>
                    `

                    : ""
                }

              </button>
            `;

          }).join("")}

        </div>

      </div>

    </section>
  `;
}


// ========================================
// COLORWAY CLICK
// ========================================

function setupColorwayButtons() {

  if (!sneaker.colorways) {
    return;
  }


  const buttons =
    document.querySelectorAll(".colorway-item");

  const mainImage =
    document.querySelector("#main-sneaker-image");


  if (!mainImage) {
    return;
  }


  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const colorwayId =
        button.dataset.colorwayId;


      const selectedColorway =
        sneaker.colorways.find((colorway) => {
          return colorway.id === colorwayId;
        });


      if (!selectedColorway) {
        return;
      }


      // メイン画像を変更
      mainImage.src =
        selectedColorway.image;

      mainImage.alt =
        `${sneaker.name} - ${selectedColorway.name}`;


      // 選択状態を解除
      buttons.forEach((item) => {
        item.classList.remove("active");
      });


      // 選択したカラーをACTIVEにする
      button.classList.add("active");

    });

  });

}


// ========================================
// SOURCES NUMBER
// ========================================

function getSourcesNumber(sneaker) {

  const detailCount =
    sneaker.details
      ? Object.keys(sneaker.details).length
      : 0;


  // COLORWAYSも1セクションとして数える
  const colorwayCount =
    sneaker.colorways &&
    sneaker.colorways.length > 0
      ? 1
      : 0;


  return String(
    detailCount + colorwayCount + 1
  ).padStart(2, "0");

}


// ========================================
// SOURCES
// ========================================

function createSourceList(sources) {

  if (!sources || sources.length === 0) {

    return `
      <p>
        SOURCE INFORMATION COMING SOON
      </p>
    `;

  }


  return sources
    .map((source) => {

      return `
        <a
          href="${source.url}"
          class="source-item"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div>

            <span class="source-name">
              ${source.name}
            </span>

            <p class="source-title">
              ${source.title}
            </p>

          </div>


          <span class="source-arrow">
            ↗
          </span>

        </a>
      `;

    })
    .join("");
}