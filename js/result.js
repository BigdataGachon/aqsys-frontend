const EXERCISE_LABELS = {
  walking: 'Walking',
  jogging: 'Jogging',
  cycling: 'Cycling',
  hiking: 'Hiking',
  ball: 'Ball Sports'
};

function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function init() {
  const raw = sessionStorage.getItem('aqsys_result');
  if (!raw) {
    window.location.href = 'index.html';
    return;
  }

  const data = JSON.parse(raw);
  renderMeta(data);
  renderSummary(data);
  renderTimeline(data);
  renderChart(data);
}

function renderMeta(data) {
  const el = document.getElementById('metaInfo');
  const exercise = EXERCISE_LABELS[data.exercise] || data.exercise;
  const dateStr = data.date.replace(/-/g, '.');
  el.textContent = `${data.district} · ${exercise} · ${dateStr}`;
}

function renderSummary(data) {
  const el = document.getElementById('summarySection');
  const bestHour = data.best_hour ?? data.recommended_hours?.[0];
  const bestLabel = bestHour != null ? formatHour(bestHour) : '—';

  el.innerHTML = `
    <p class="summary-text">${data.summary}</p>
    <div class="best-time-badge">★ Best time: ${bestLabel}</div>
    <p class="duration-info">Recommended duration: <strong>${data.recommended_duration_min} min</strong></p>
  `;
}

function renderTimeline(data) {
  const container = document.getElementById('timeline');
  const recommended = new Set(data.recommended_hours || []);

  container.innerHTML = data.timeline.map(item => `
    <div class="timeline-cell ${item.level}"
         title="${item.hour}:00 | PM10: ${item.pm10} ㎍/㎥ | PM2.5: ${item.pm25} ㎍/㎥">
      <span class="cell-hour">${item.hour}</span>
      ${recommended.has(item.hour) ? '<span class="cell-star">★</span>' : ''}
    </div>
  `).join('');
}

function renderChart(data) {
  const labels = data.timeline.map(t => `${t.hour}:00`);
  const pm10Values = data.timeline.map(t => t.pm10);
  const pm25Values = data.timeline.map(t => t.pm25);

  new Chart(document.getElementById('pmChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'PM10',
          data: pm10Values,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.08)',
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5,
          fill: true,
        },
        {
          label: 'PM2.5',
          data: pm25Values,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.08)',
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5,
          fill: true,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} ㎍/㎥`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Concentration (㎍/㎥)' }
        },
        x: {
          ticks: { maxTicksLimit: 12 }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
