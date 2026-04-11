(function () {
  var form = document.querySelector('.email-form');
  if (!form) return;

  var statusEl = document.getElementById('hero-form-status');
  var emailInput = form.querySelector('input[name="EMAIL"]');
  var submitBtn = form.querySelector('button[type="submit"]');
  if (!emailInput || !submitBtn) return;

  var btnDefaultText = submitBtn.textContent;

  var MC_BASE = 'https://badamiskin.us20.list-manage.com/subscribe/post-json';
  var MC_U = 'b8392bd964521f44e2727e911';
  var MC_ID = '1f4ef8c829';
  var MC_F_ID = '00927feaf0';
  var MC_HONEYPOT = 'b_b8392bd964521f44e2727e911_1f4ef8c829';

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('form-status--success', 'form-status--error');
    if (type === 'success') statusEl.classList.add('form-status--success');
    if (type === 'error') statusEl.classList.add('form-status--error');
  }

  function stripTags(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var honeypot = form.querySelector('input[name="' + MC_HONEYPOT + '"]');
    if (honeypot && honeypot.value) {
      return;
    }

    setStatus('', '');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var cb = 'mcJsonp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    var script = document.createElement('script');
    var timeoutId;

    function finish() {
      clearTimeout(timeoutId);
      if (window[cb]) {
        try {
          delete window[cb];
        } catch (err) {
          window[cb] = undefined;
        }
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      submitBtn.disabled = false;
      submitBtn.textContent = btnDefaultText;
    }

    window[cb] = function (data) {
      finish();

      if (data && data.result === 'success') {
        setStatus('success', "You're on the list. Stay tuned for first access.");
        form.reset();
        emailInput.blur();
        return;
      }

      var raw = data && data.msg;
      var combined = Array.isArray(raw) ? raw.join(' ') : String(raw || '');
      var msg = stripTags(combined) || 'Something went wrong. Please try again.';
      setStatus('error', msg);
    };

    script.onerror = function () {
      finish();
      setStatus('error', 'Connection failed. Please try again.');
    };

    var params = new URLSearchParams();
    params.set('u', MC_U);
    params.set('id', MC_ID);
    params.set('EMAIL', emailInput.value.trim());
    params.set('f_id', MC_F_ID);
    params.set('c', cb);
    params.set(MC_HONEYPOT, honeypot ? honeypot.value : '');

    script.src = MC_BASE + '?' + params.toString();
    document.body.appendChild(script);

    timeoutId = setTimeout(function () {
      if (!window[cb]) return;
      finish();
      setStatus('error', 'Request timed out. Please try again.');
    }, 20000);
  });
})();
