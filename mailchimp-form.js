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

  // Production: false. When true, only MC_DEV_DUPLICATE_BYPASS_EMAIL may skip the
  // "already subscribed" error and show the normal success state (for local testing).
  var MC_DEV_BYPASS_DUPLICATE_CHECK = false;
  var MC_DEV_DUPLICATE_BYPASS_EMAIL = 'fwsamnani@gmail.com';

  var junkPatterns = ['asdf', '123', 'test', 'fake', 'qwerty'];
  var invalidDomainPatterns = ['plan.com', 'asdf.com'];

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

  function isLowQualityEmail(email) {
    if (email.length < 5) return true;
    var at = email.indexOf('@');
    if (at < 1) return true;
    var local = email.slice(0, at);
    if (local.length < 3) return true;
    var isJunk =
      junkPatterns.some(function (p) {
        return email.indexOf(p) !== -1;
      }) ||
      invalidDomainPatterns.some(function (p) {
        return email.slice(-p.length) === p;
      });
    return isJunk;
  }

  function restoreSubmitUi() {
    if (!submitBtn || !form.contains(submitBtn)) return;
    submitBtn.disabled = false;
    submitBtn.textContent = btnDefaultText;
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

    var email = emailInput.value.toLowerCase().trim();

    if (isLowQualityEmail(email)) {
      if (statusEl) {
        statusEl.textContent = 'Please enter a valid email.';
        statusEl.className = 'form-status form-status--error';
      }
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
      restoreSubmitUi();
    }

    window[cb] = function (data) {
      finish();

      var raw = data && data.msg;
      var combined = Array.isArray(raw) ? raw.join(' ') : String(raw || '');
      var message = stripTags(combined);

      if (data && data.result === 'success') {
        if (message.toLowerCase().indexOf('already subscribed') !== -1) {
          if (
            !(
              MC_DEV_BYPASS_DUPLICATE_CHECK &&
              email === MC_DEV_DUPLICATE_BYPASS_EMAIL
            )
          ) {
            if (statusEl) {
              statusEl.textContent = "You're already on the list.";
              statusEl.className = 'form-status form-status--error';
            }
            return;
          }
        }
        form.innerHTML =
          '<div class="form-success-state" role="status">' +
          "<h3>You're in!</h3>" +
          '<p>We’ll reach out before anyone else.</p>' +
          '</div>';
        return;
      }

      var msg = message || 'Something went wrong. Try again.';
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.className = 'form-status form-status--error';
      }
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
