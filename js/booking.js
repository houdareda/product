// Booking Bottom Sheet Modal Logic
document.addEventListener('DOMContentLoaded', function() {
  const bookBtn = document.querySelector('.book-now-btn');
  const overlay = document.getElementById('bookingModalOverlay');
  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('bookingModalClose');

  if (!overlay || !modal) return;

  const steps = Array.from(document.querySelectorAll('.booking-step'));
  const dateInput = document.getElementById('bookingDate');
  const timeOptions = Array.from(document.querySelectorAll('.time-option'));
  const langOptions = Array.from(document.querySelectorAll('.lang-option'));
  const optionRadios = Array.from(document.querySelectorAll('input[name="bookingOption"]'));
  const selectButtons = Array.from(document.querySelectorAll('.option-card .select-option-btn'));
  const totalEl = document.getElementById('bookingTotal');
  const detailsEl = document.getElementById('bookingDetails');

  const counters = Array.from(document.querySelectorAll('.counter-row'));
  const addonItems = Array.from(document.querySelectorAll('.addons-list .addon-item'));

  const state = {
    date: null,
    time: null,
    language: 'English',
    option: 'basic',
    participants: { adults: 1, children: 0, infants: 0 },
    addons: [],
    prices: {
      adult: 17.5,
      child: 10,
      infant: 0,
      options: { basic: 0, entrance: 4.5, parasailing: 18.5 }
    }
  };

  function openModal() {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    // reset to first step
    steps.forEach(s => { s.classList.remove('collapsed', 'active'); });
    const first = document.querySelector('.booking-step[data-step="date"]');
    if (first) first.classList.add('active');
    updateMinMaxDates();
    updateTotal();
  }

  function closeModal() {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function updateMinMaxDates() {
    if (!dateInput) return;
    const today = new Date();
    const max = new Date(today);
    max.setFullYear(today.getFullYear() + 1);
    const fmt = d => d.toISOString().split('T')[0];
    dateInput.min = fmt(today);
    dateInput.max = fmt(max);
  }

  function setSummary(stepEl, text, opts = {}) {
    const summary = stepEl.querySelector('.selected-summary');
    if (summary) summary.textContent = text || '';
    const noAuto = stepEl.hasAttribute('data-noauto');
    const sticky = stepEl.hasAttribute('data-sticky');
    const shouldCollapse = opts.collapse ?? (!noAuto && !sticky);
    if (shouldCollapse) {
      stepEl.classList.add('collapsed');
      stepEl.classList.remove('active');
    } else {
      stepEl.classList.add('active');
      stepEl.classList.remove('collapsed');
    }
  }

  function goToStep(name) {
    const next = document.querySelector(`.booking-step[data-step="${name}"]`);
    if (next) {
      next.classList.remove('collapsed');
      next.classList.add('active');
      if (typeof window.smoothOffsetScroll === 'function') {
        const modal = document.getElementById('bookingModal');
        window.smoothOffsetScroll(modal, next);
      } else {
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function updateTotal() {
    const base = (state.participants.adults * state.prices.adult) + (state.participants.children * state.prices.child);
    const optionFee = state.prices.options[state.option] || 0;
    const addonsFee = state.addons.reduce((sum, a) => sum + ((a.price || 0) * (a.qty || 0)), 0);
    const total = base + optionFee + addonsFee;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;

    // Build structured list for summary details
    const items = [];
    if (state.language) items.push(`Language: ${state.language}`);
    if (state.date) items.push(`Date: ${state.date}`);
    if (state.time) items.push(`Time: ${state.time}`);
    items.push(`Adults: ${state.participants.adults}, Children: ${state.participants.children}, Infants: ${state.participants.infants}`);
    items.push(`Option: ${state.option}`);
    const addonSummary = state.addons.filter(a => (a.qty || 0) > 0);
    if (addonSummary.length) items.push(`Add-ons: ${addonSummary.map(a => `${a.name} x${a.qty}`).join(', ')}`);
    if (detailsEl) {
      const listHTML = `<ul class="summary-list">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
      detailsEl.innerHTML = listHTML;
    }
  }

  // Header allows editing by expanding
  steps.forEach(step => {
    const header = step.querySelector('.step-header');
    if (header) {
      header.addEventListener('click', () => {
        const sticky = step.hasAttribute('data-sticky');
        const isCollapsed = step.classList.contains('collapsed');
        steps.forEach(s => s.classList.remove('active'));
        if (isCollapsed || sticky) {
          step.classList.remove('collapsed');
          step.classList.add('active');
        } else {
          step.classList.add('collapsed');
        }
      });
    }
  });

  // Date selection
  if (dateInput) {
    dateInput.addEventListener('change', () => {
      state.date = dateInput.value;
      const stepEl = document.querySelector('.booking-step[data-step="date"]');
      setSummary(stepEl, state.date);
      goToStep('time');
      updateTotal();
    });
  }

  // Time selection
  timeOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      timeOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.time = btn.dataset.time;
      const stepEl = document.querySelector('.booking-step[data-step="time"]');
      setSummary(stepEl, state.time);
      goToStep('language');
      updateTotal();
    });
  });

  // Language selection
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      langOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.language = btn.dataset.lang;
      const stepEl = document.querySelector('.booking-step[data-step="language"]');
      setSummary(stepEl, state.language);
      goToStep('options');
      updateTotal();
    });
  });

  // Options radios
  optionRadios.forEach(r => {
    r.addEventListener('change', () => {
      if (r.checked) {
        state.option = r.value;
        const label = r.closest('.option-card');
        let title = '';
        if (label) {
          const t = label.querySelector('.title');
          title = t ? t.textContent.trim() : r.value;
        }
        const stepEl = document.querySelector('.booking-step[data-step="options"]');
        setSummary(stepEl, title);
        goToStep('participants');
        updateTotal();
        // Update selected classes and buttons
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        const card = r.closest('.option-card');
        if (card) card.classList.add('selected');
        updateSelectButtons();
      }
    });
  });

  function updateSelectButtons(){
    document.querySelectorAll('.option-card').forEach(card => {
      const btn = card.querySelector('.select-option-btn');
      const radio = card.querySelector('input[name="bookingOption"]');
      if(!btn || !radio) return;
      if (radio.checked) {
        btn.textContent = 'Selected';
        btn.disabled = true;
        card.classList.add('selected');
      } else {
        btn.textContent = 'Select';
        btn.disabled = false;
        card.classList.remove('selected');
      }
    });
  }

  // Select button behavior: choose the option radio
  selectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.option-card');
      if(!card) return;
      const radio = card.querySelector('input[name="bookingOption"]');
      if(!radio) return;
      // Check and trigger change
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        updateSelectButtons();
      }
    });
  });

  // Initialize selected UI for the pre-checked option (first one)
  updateSelectButtons();

  // Participants counters
  counters.forEach(row => {
    const type = row.dataset.type;
    const minus = row.querySelector('.minus');
    const plus = row.querySelector('.plus');
    const countEl = row.querySelector('.count');
    function setCount(n) {
      countEl.textContent = String(n);
      state.participants[type === 'adult' ? 'adults' : type === 'child' ? 'children' : 'infants'] = n;
      const summaryText = `Adults ${state.participants.adults} · Children ${state.participants.children} · Infants ${state.participants.infants}`;
      const stepEl = document.querySelector('.booking-step[data-step="participants"]');
      // Keep participants open and DO NOT auto-scroll to next step
      setSummary(stepEl, summaryText, { collapse: false });
      updateTotal();
    }
    minus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      const nextVal = Math.max(0, current - 1);
      const finalVal = type === 'adult' ? Math.max(1, nextVal) : nextVal; // keep at least 1 adult
      setCount(finalVal);
    });
    plus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setCount(current + 1);
    });
  });

  // Addons quantity counters
  addonItems.forEach(item => {
    const minus = item.querySelector('.minus');
    const plus = item.querySelector('.plus');
    const countEl = item.querySelector('.qty-count');
    const name = (item.querySelector('.addon-name')?.textContent || item.dataset.addon || 'Addon').trim();
    const price = parseFloat(item.dataset.price || '0');

    function setQty(qty) {
      countEl.textContent = String(qty);
      const existing = state.addons.find(a => a.name === name);
      if (existing) {
        existing.qty = qty;
        existing.price = price; // keep price synced
      } else {
        state.addons.push({ name, price, qty });
      }
      const chosen = state.addons.filter(a => (a.qty || 0) > 0);
      const stepEl = document.querySelector('.booking-step[data-step="addons"]');
      const text = chosen.length ? chosen.map(a => `${a.name} x${a.qty}`).join(', ') : 'No add-ons';
      setSummary(stepEl, text, { collapse: false });
      updateTotal();
    }

    minus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      const next = Math.max(0, current - 1);
      setQty(next);
    });
    plus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setQty(current + 1);
    });
  });

  // Option details toggling and selected banner
  const detailToggles = Array.from(document.querySelectorAll('.option-card .details-toggle'));
  detailToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.option-card');
      if(!card) return;
      const expanded = card.classList.toggle('expanded');
      btn.innerHTML = expanded ? '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(180deg);"></i> Hide Details' : '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(0deg);"></i> Show Details';
    });
  });

  optionRadios.forEach(r => {
    r.addEventListener('change', () => {
      // toggle selected banner
      document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      const card = r.closest('.option-card');
      if(card) card.classList.add('selected');
    });
  });

  // Open/Close bindings
  if (bookBtn) {
    bookBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeModal(); });
});
// --- Enhanced slow, offset scrolling between steps (override) ---
// This redefines goToStep to scroll the modal more slowly and leave
// the next section slightly below the top edge for clearer context.
(function(){
  const modal = document.getElementById('bookingModal');
  if(!modal) return;

  // Control how far from the top the next step stops and how slow it scrolls
  const SCROLL_OFFSET_PX = (typeof window.SCROLL_OFFSET_PX === 'number') ? window.SCROLL_OFFSET_PX : 56;      // space above the next step
  const SCROLL_DURATION_MS = (typeof window.SCROLL_DURATION_MS === 'number') ? window.SCROLL_DURATION_MS : 900;  // slower scroll duration

  function smoothOffsetScroll(container, target, offset = SCROLL_OFFSET_PX, duration = SCROLL_DURATION_MS){
    try{
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const start = container.scrollTop;
      const distance = (targetRect.top - containerRect.top);
      const effectiveOffset = Math.min(offset, Math.max(0, distance - 16)); // ensure at least 16px visible
      const end = Math.max(0, start + distance - effectiveOffset);
      const change = end - start;
      const startTime = performance.now();
      const easeInOut = (t)=> t<0.5 ? 2*t*t : -1+(4-2*t)*t;

      function step(now){
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + change * easeInOut(progress);
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }catch(e){
      // Fallback
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  // Keep a reference to the original goToStep if present
  const originalGoToStep = window.goToStep;
  // Expose smoother globally so earlier handlers can use it
  window.smoothOffsetScroll = smoothOffsetScroll;
  // Also expose current offset/duration so user tweaks apply consistently
  window.SCROLL_OFFSET_PX = SCROLL_OFFSET_PX;
  window.SCROLL_DURATION_MS = SCROLL_DURATION_MS;

  window.goToStep = function(currentStep){
    try{
      const steps = Array.from(document.querySelectorAll('.booking-step'));
      const currentIdx = steps.findIndex(s => s.dataset.step === currentStep);
      const next = steps[currentIdx + 1];
      if(next){
        next.classList.add('active');
        smoothOffsetScroll(modal, next, SCROLL_OFFSET_PX, SCROLL_DURATION_MS);
      } else {
        const summary = document.querySelector('.booking-summary');
        if(summary) smoothOffsetScroll(modal, summary, Math.max(16, SCROLL_OFFSET_PX - 8), SCROLL_DURATION_MS);
      }
    }catch(e){
      if(typeof originalGoToStep === 'function') originalGoToStep(currentStep);
    }
  };
})();