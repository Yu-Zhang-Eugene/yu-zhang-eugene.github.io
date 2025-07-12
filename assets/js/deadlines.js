/* ==========================================================================
   AI Deadlines Interactive Scripts
   ========================================================================== */
  


function getCountdown(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
}

function formatDateTimeUTC(isoString) {
  const date = new Date(isoString);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec} UTC`;
}


function renderTable(data) {
  const $body = $('#deadline-body').empty(); // Clear existing rows
  data.forEach(conf => {
    const countdown = getCountdown(conf.deadline);
    const row = `
      <tr data-deadline="${conf.deadline}" data-category="${conf.category}">
        <td>${conf.icon} <a href="${conf.website}" target="_blank">${conf.name}</a></td>
        <td>${formatDateTimeUTC(conf.deadline)}</td>
        <td class="countdown-cell">${countdown}</td>
      </tr>
    `;
    $body.append(row);
  });
}

function sortByDeadline(data) {
  const now = new Date();

  return data.slice().sort((a, b) => {
    const aDate = new Date(a.deadline);
    const bDate = new Date(b.deadline);
    const aExpired = aDate < now;
    const bExpired = bDate < now;

    if (aExpired && !bExpired) return 1;   // a is expired, b is not → a goes after b
    if (!aExpired && bExpired) return -1;  // b is expired, a is not → b goes after a

    // Both expired or both upcoming → sort by deadline ascending (oldest first)
    return aDate - bDate;
  });
}


function setupConferenceFilter(conferences) {
  renderTable(sortByDeadline(conferences));

    $('#category-select').on('change', function () {
      const selected = $(this).val();
      const filtered = selected === 'all'
        ? conferences
        : conferences.filter(c => c.category === selected);

      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    renderTable(sortByDeadline(filtered));
  });
}
