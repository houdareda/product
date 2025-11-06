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
  const totalEl = document.getElementById('bookingTotal');
  const detailsEl = document.getElementById('bookingDetails');

  const counters = Array.from(document.querySelectorAll('.counter-row'));
  const addonChecks = Array.from(document.querySelectorAll('.addon-item input[type="checkbox"]'));

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
      next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateTotal() {
    const base = (state.participants.adults * state.prices.adult) + (state.participants.children * state.prices.child);
    const optionFee = state.prices.options[state.option] || 0;
    const addonsFee = state.addons.reduce((sum, a) => sum + (a.price || 0), 0);
    const total = base + optionFee + addonsFee;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;

    const det = [];
    if (state.date) det.push(`Date: ${state.date}`);
    if (state.time) det.push(`Time: ${state.time}`);
    if (state.language) det.push(`Language: ${state.language}`);
    det.push(`Adults: ${state.participants.adults}, Children: ${state.participants.children}, Infants: ${state.participants.infants}`);
    det.push(`Option: ${state.option}`);
    if (state.addons.length) det.push(`Add-ons: ${state.addons.map(a => a.name).join(', ')}`);
    if (detailsEl) detailsEl.textContent = det.join(' · ');
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
      }
    });
  });

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

  // Addons
  addonChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      const price = parseFloat(chk.dataset.price || '0');
      // get label text (name)
      let name = 'Addon';
      const textNode = chk.parentElement ? chk.parentElement.cloneNode(true) : null;
      if (textNode) {
        name = textNode.textContent.replace(/\s*€.*$/, '').trim();
      }
      if (chk.checked) {
        state.addons.push({ name, price });
      } else {
        state.addons = state.addons.filter(a => a.name !== name);
      }
      const stepEl = document.querySelector('.booking-step[data-step="addons"]');
      const text = state.addons.length ? state.addons.map(a => a.name).join(', ') : 'No add-ons';
      setSummary(stepEl, text, { collapse: false });
      updateTotal();
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
      btn.textContent = expanded ? 'Hide Details' : 'Show Details';
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

  function smoothOffsetScroll(container, target, offset = 24, duration = 700){
    try{
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const start = container.scrollTop;
      const end = start + (targetRect.top - containerRect.top) - offset;
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

  window.goToStep = function(currentStep){
    try{
      const steps = Array.from(document.querySelectorAll('.booking-step'));
      const currentIdx = steps.findIndex(s => s.dataset.step === currentStep);
      const next = steps[currentIdx + 1];
      if(next){
        next.classList.add('active');
        smoothOffsetScroll(modal, next, 32, 800); // slightly larger offset and slower
      } else {
        const summary = document.querySelector('.booking-summary');
        if(summary) smoothOffsetScroll(modal, summary, 16, 700);
      }
    }catch(e){
      if(typeof originalGoToStep === 'function') originalGoToStep(currentStep);
    }
  };
})();