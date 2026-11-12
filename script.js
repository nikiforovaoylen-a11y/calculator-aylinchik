const display = document.getElementById('display');
let current = '0';

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') {
      current = '0';
    } else if (action === 'delete') {
      current = current.length > 1 ? current.slice(0, -1) : '0';
    } else if (action === 'calculate') {
      try {
        current = String(eval(current.replace(/×/g, '*').replace(/÷/g, '/')));
        if (current === 'Infinity' || current === 'NaN') current = 'Error';
      } catch {
        current = 'Error';
      }
    } else if (value) {
      current = current === '0' && value !== '.' ? value : current + value;
    }

    display.textContent = current;
  });
});

// Обработка клавиатуры
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9') {
    current = current === '0' ? key : current + key;
  } else if (key === '.') {
    current = current + key;
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    current = current + key;
  } else if (key === 'Enter' || key === '=') {
    try {
      current = String(eval(current));
      if (current === 'Infinity' || current === 'NaN') current = 'Error';
    } catch {
      current = 'Error';
    }
  } else if (key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
  } else if (key === 'Escape') {
    current = '0';
  } else {
    return;
  }

  e.preventDefault();
  display.textContent = current;
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