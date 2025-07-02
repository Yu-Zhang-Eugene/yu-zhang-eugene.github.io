const rows = document.querySelectorAll("#deadline-body tr");

function formatDate(date, tz) {
  return tz === "UTC"
    ? date.toISOString().replace("T", " ").slice(0,16)+" UTC"
    : date.toLocaleString();
}

function genICS(conf) {
  const dt = new Date(conf.deadline).toISOString().replace(/[-:]/g,"").split('.')[0]+"Z";
  return encodeURI(`data:text/calendar,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTAMP:${dt}
DTSTART:${dt}
SUMMARY:${conf.icon} ${conf.name} Deadline
DESCRIPTION:See ${conf.website}
URL:${conf.website}
END:VEVENT
END:VCALENDAR`);
}

function update() {
  const now = new Date();
  const tz = document.getElementById("timezone-select").value;
  const cat = document.getElementById("category-select").value;

  rows.forEach(row=>{
    const dlStr = row.dataset.deadline;
    const deadline = new Date(dlStr);
    row.style.display = (cat==='all'||row.dataset.category===cat) ? '' : 'none';

    row.querySelector(".time-cell").textContent = formatDate(deadline, tz);

    const diff = deadline - now;
    const days = Math.floor(diff/(1000*60*60*24));
    row.querySelector(".countdown-cell").textContent = diff>0 ? `${days}d left` : "Closed";

    const span = Math.max(0, Math.min(100,
      100*(now - new Date("2025-01-01"))/(deadline - new Date("2025-01-01")))
    );
    row.querySelector(".progress-cell").innerHTML =
      `<div class="progress">
         <div class="bar" style="width:${span}%"></div>
       </div>`;

    const conf = {
      name: row.cells[0].textContent.trim(),
      deadline: dlStr,
      icon: row.cells[0].textContent.trim().split(' ')[0],
      website: row.querySelector(".gcal-link").href
    };
    row.querySelector(".ics-link").href = genICS(conf);
    row.querySelector(".ics-link").download =
      conf.name.replace(/\s+/g,'_')+'.ics';

    const dt = new Date(conf.deadline).toISOString().replace(/[-:]/g,"").split('.')[0];
    row.querySelector(".gcal-link").href =
      `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(conf.name)}&dates=${dt}/${dt}&details=${encodeURIComponent(conf.website)}`;
  });
}

function downloadJSON(){
  const data = {{ site.data.deadlines | jsonify }};
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'deadlines.json';
  a.click();
}

function toggleDarkMode(){
  document.body.classList.toggle('dark-mode');
}

document.getElementById("timezone-select").addEventListener('change',update);
document.getElementById("category-select").addEventListener('change',update);
update();