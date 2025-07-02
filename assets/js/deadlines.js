/* ==========================================================================
   AI Deadlines Interactive Scripts
   ========================================================================== */

$(document).ready(function () {
  // ========== Constants ==========
  const START_DATE = new Date("2025-01-01"); // customize for progress bar calculation
  const $rows = $("#deadline-body tr");

  // ========== Helpers ==========

  function formatDate(date, tz) {
    return tz === "UTC"
      ? date.toISOString().replace("T", " ").slice(0, 16) + " UTC"
      : date.toLocaleString();
  }

  function generateICS(conf) {
    const dt = new Date(conf.deadline).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return encodeURI(`data:text/calendar,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTAMP:${dt}
DTSTART:${dt}
SUMMARY:${conf.icon} ${conf.name} Deadline
DESCRIPTION:See ${conf.website}
URL:${conf.website}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, "\r\n"));
  }

  function updateDeadlines() {
    const tz = $("#timezone-select").val();
    const selectedCategory = $("#category-select").val();
    const now = new Date();

    $rows.each(function () {
      const $row = $(this);
      const deadlineStr = $row.data("deadline");
      const category = $row.data("category");
      const deadline = new Date(deadlineStr);

      // Show/hide based on category
      $row.toggle(selectedCategory === "all" || category === selectedCategory);

      // Update time
      $row.find(".time-cell").text(formatDate(deadline, tz));

      // Update countdown
      const diff = deadline - now;
      const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
      $row.find(".countdown-cell").text(diff > 0 ? `${daysLeft}d left` : "Closed");

      // Update progress bar
      const total = deadline - START_DATE;
      const elapsed = now - START_DATE;
      const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
      $row.find(".progress-cell").html(`
        <div class="progress"><div class="bar" style="width: ${percent}%"></div></div>
      `);

      // .ics link
      const conf = {
        name: $row.find("td").first().text().trim(),
        deadline: deadlineStr,
        icon: $row.find("td").first().text().trim().split(" ")[0],
        website: $row.find(".gcal-link").attr("href") || ""
      };

      $row.find(".ics-link")
        .attr("href", generateICS(conf))
        .attr("download", conf.name.replace(/\s+/g, "_") + ".ics");

      // Google Calendar link
      const iso = deadline.toISOString().replace(/[-:]/g, "").split(".")[0];
      const gcalLink = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(conf.name)}&dates=${iso}/${iso}&details=${encodeURIComponent(conf.website)}`;
      $row.find(".gcal-link").attr("href", gcalLink);
    });
  }

  function downloadJSON() {
    const jsonData = {{ site.data.deadlines | jsonify }};
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const $link = $("<a>")
      .attr("href", url)
      .attr("download", "deadlines.json")
      .appendTo("body");

    $link[0].click();
    $link.remove();
  }

  function toggleDarkMode() {
    $("body").toggleClass("dark-mode");
  }

  // ========== Event Bindings ==========

  $("#timezone-select").on("change", updateDeadlines);
  $("#category-select").on("change", updateDeadlines);
  window.downloadJSON = downloadJSON;
  window.toggleDarkMode = toggleDarkMode;

  // ========== Init ==========
  updateDeadlines();

  // Optional: if you want sticky behavior like Minimal Mistakes
  if ($(".sticky").length) {
    Stickyfill.add(document.querySelectorAll(".sticky"));
  }

});