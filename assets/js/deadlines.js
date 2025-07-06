/* ==========================================================================
   AI Deadlines Interactive Scripts
   ========================================================================== */
  


function getCountdown(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} day(s) left`;
}

function renderTable(data) {
  const $body = $('#deadline-body').empty(); // Clear existing rows
  data.forEach(conf => {
    const countdown = getCountdown(conf.deadline);
    const row = `
      <tr data-deadline="${conf.deadline}" data-category="${conf.category}">
        <td>${conf.icon} <a href="${conf.website}" target="_blank">${conf.name}</a></td>
        <td>${conf.deadline.split('T')[0]}</td>
        <td class="countdown-cell">${countdown}</td>
      </tr>
    `;
    $body.append(row);
  });
}

function sortByDeadline(data) {
  return data.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

cont = site.data.deadlines

$(document).ready(function () {
    renderTable(sortByDeadline(conferences));

    $('#category-select').on('change', function () {
      const selected = $(this).val();
      const filtered = selected === 'all'
        ? conferences
        : conferences.filter(c => c.category === selected);

      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

      renderTable(filtered);
    });
});