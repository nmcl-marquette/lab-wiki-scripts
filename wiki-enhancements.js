<script>
(function() {
  // --- Utility: Run after DOM ready ---
  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(fn, 0);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  // --- Publications Renderer ---
  function renderPublications() {
    document.querySelectorAll('[data-publications]').forEach(container => {
      const csvUrl = container.getAttribute('data-src');
      if (!csvUrl) return;

      Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const entries = results.data;
          container.innerHTML = ""; // clear placeholder

          entries.forEach(row => {
            const authors = row.Authors || "";
            const year = row.Year ? ` (${row.Year})` : "";
            const title = row.Title ? `<strong>${row.Title}</strong>` : "";
            const journal = row.Journal ? `<em>${row.Journal}</em>` : "";
            const vol = row.Volume || "";
            const issue = row.Issue ? `(${row.Issue})` : "";
            const pages = row.Pages ? `, ${row.Pages}` : "";
            const url = row.URL || "";
            const doi = row.DOI 
              ? ` DOI: <a href="https://doi.org/${row.DOI}" target="_blank">${row.DOI}</a>` 
              : "";

            // Title hyperlink if URL provided
            const titleBlock = url
              ? `<a href="${url}" target="_blank">${title}</a>`
              : title;

            const citation = `${authors}${year} ${titleBlock}. ${journal} ${vol}${issue}${pages}.${doi}`;
            const p = document.createElement("p");
            p.innerHTML = citation;
            container.appendChild(p);
          });
        }
      });
    });
  }

  // --- Faculty Card Renderer ---
  function renderFaculty() {
    const defaultImg = "/assets/people/profile-default-small.png";

    document.querySelectorAll(".contents .faculty-card").forEach(card => {
      const img   = card.dataset.img || defaultImg;
      const name  = card.dataset.name || "";
      const url   = card.dataset.url || "";
      const role  = card.dataset.role || "";

      card.innerHTML = `
        <img src="${img}" width="100" />
        <div>
          ${url 
            ? `<a href="${url}" target="_blank" rel="noopener noreferrer"><strong>${name}</strong></a>`
            : `<strong>${name}</strong>`}
          <br>
          ${role}
        </div>
      `;
    });
  }

  // --- Init with retry to catch Wiki.js delays ---
  function init() {
    renderPublications();
    renderFaculty();
  }

  onReady(() => {
    init();
    // Retry a bit in case Wiki.js injects content late
    let tries = 0;
    const maxTries = 5;
    const interval = setInterval(() => {
      init();
      tries++;
      if (tries >= maxTries) clearInterval(interval);
    }, 1000);
  });
})();
</script>
