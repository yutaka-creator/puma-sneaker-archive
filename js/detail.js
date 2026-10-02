// URLの情報を取得
const params = new URLSearchParams(
  window.location.search
);


// ?id=○○ の部分を取得
const sneakerId = params.get("id");


// sneakers.jsから該当する1足を探す
const sneaker = sneakers.find((item) => {
  return item.id === sneakerId;
});


const detailContent =
  document.querySelector("#detail-content");


// 該当する靴がなかった場合
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
<section class="sources-section">

  <div class="sources-section__number">
    07
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

}

function createDetailSections(details) {

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
function createSourceList(sources) {

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