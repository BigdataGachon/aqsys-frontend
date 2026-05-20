const USE_MOCK = true;
const API_BASE = 'http://localhost:8000';

const DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구'
];

function init() {
  populateDistricts();
  setDateConstraints();
  document.getElementById('searchForm').addEventListener('submit', handleSubmit);
}

function populateDistricts() {
  const select = document.getElementById('district');
  DISTRICTS.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function setDateConstraints() {
  const input = document.getElementById('date');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  input.min = toDateString(today);
  input.max = toDateString(tomorrow);
  input.value = toDateString(today);
}

function toDateString(d) {
  return d.toISOString().split('T')[0];
}

async function handleSubmit(e) {
  e.preventDefault();
  const district = document.getElementById('district').value;
  const exercise = document.getElementById('exercise').value;
  const date = document.getElementById('date').value;

  showError('');
  setLoading(true);

  try {
    const data = USE_MOCK
      ? await getMockData(district, exercise, date)
      : await fetchApi(district, exercise, date);

    sessionStorage.setItem('aqsys_result', JSON.stringify(data));
    window.location.href = 'result.html';
  } catch (err) {
    showError(err.message || 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
}

async function fetchApi(district, exercise, date) {
  const params = new URLSearchParams({ district, exercise, date });
  const res = await fetch(`${API_BASE}/api/recommend?${params}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(resolveErrorMessage(json.error?.code));
  }
  return json;
}

async function getMockData(district, exercise, date) {
  await new Promise(r => setTimeout(r, 800));
  return { ...MOCK_RESPONSE, district, exercise, date };
}

function resolveErrorMessage(code) {
  const map = {
    INVALID_DISTRICT:  'Please select a valid district.',
    INVALID_EXERCISE:  'Please select a valid exercise type.',
    INVALID_DATE:      'Only today or tomorrow can be selected.',
    MODEL_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
    INTERNAL_ERROR:    'A server error occurred. Please try again.',
  };
  return map[code] || 'An error occurred. Please try again.';
}

function setLoading(on) {
  const btn = document.getElementById('submitBtn');
  btn.disabled = on;
  btn.querySelector('.btn-text').classList.toggle('hidden', on);
  btn.querySelector('.btn-loading').classList.toggle('hidden', !on);
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.toggle('hidden', !msg);
}

document.addEventListener('DOMContentLoaded', init);
