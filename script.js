const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const paletteToggle = document.getElementById('palette-toggle');
const colorPalette = document.getElementById('color-palette');
const clearHistoryBtn = document.getElementById('clear-history');

let current = '0';
let history = JSON.parse(localStorage.getItem('calc-history') || '[]');

// Отрисовка калькулятора
function render() {
  display.textContent = current;
}

// Обработка кнопок
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') {
      current = '0';
    } else if (action === 'delete') {
      current = current.length > 1 ? current.slice(0, -1) : '0';
    } else if (action === 'calculate') {
      calculate();
    } else if (value) {
      current = current === '0' && value !== '.' ? value : current + value;
    }

    render();
  });
});

// Вычисление + запись в историю
function calculate() {
  const expr = current;
  try {
    const result = String(eval(expr.replace(/×/g, '*').replace(/÷/g, '/')));
    if (result === 'Infinity' || result === 'NaN') {
      current = 'Error';
    } else {
      addHistory(expr, result);
      current = result;
    }
  } catch {
    current = 'Error';
  }
}

// История
function addHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 20) history.pop();
  localStorage.setItem('calc-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="expr">${item.expr} =</span><span class="result">${item.result}</span>`;
    li.addEventListener('click', () => {
      current = item.result;
      render();
    });
    historyList.appendChild(li);
  });
}

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  localStorage.removeItem('calc-history');
  renderHistory();
});

// Клавиатура
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9') {
    current = current === '0' ? key : current + key;
  } else if (key === '.') {
    current = current + key;
  } else if (['+', '-', '*', '/'].includes(key)) {
    current = current + key;
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
  } else if (key === 'Escape') {
    current = '0';
  } else {
    return;
  }

  e.preventDefault();
  render();
});

// Сворачивание палитры
paletteToggle.addEventListener('click', () => {
  colorPalette.classList.toggle('hidden');
  paletteToggle.classList.toggle('collapsed');
});

// Смена цветов
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    const hover = btn.dataset.hover;

    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-hover', hover);

    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Первый рендер
render();
renderHistory();
// Сворачивание истории
const historyToggle = document.getElementById('history-toggle');
const historyContent = document.getElementById('history-content');

historyToggle.addEventListener('click', () => {
  historyContent.classList.toggle('hidden');
  historyToggle.classList.toggle('collapsed');
});