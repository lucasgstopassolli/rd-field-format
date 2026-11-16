(function() {
  function setupRDPhone() {
    var originals = document.querySelectorAll('input[name="phone"]:not([type="hidden"]):not([data-rd-orig="true"])');

    for (var i = 0; i < originals.length; i++) {
      (function(origInput) {
        origInput.setAttribute('data-rd-orig', 'true');

        // 1. Cria o campo visual clonando classes e placeholder do original
        var visualInput = document.createElement('input');
        visualInput.type = 'tel';
        visualInput.name = 'phone_visual';
        visualInput.className = origInput.className;
        visualInput.placeholder = origInput.placeholder || '(11) 99999-9999';
        visualInput.setAttribute('autocomplete', 'tel');
        visualInput.setAttribute('minlength', '14');

        // Transfere obrigatoriedade e ID (para labels funcionarem) para o campo visual
        if (origInput.required) {
          visualInput.required = true;
          origInput.required = false;
        }
        if (origInput.id) {
          visualInput.id = origInput.id;
          origInput.removeAttribute('id');
        }

        // 2. Esconde o campo original apenas via CSS (mantendo type="tel" para o RD Station ler)
        origInput.tabIndex = -1;
        origInput.setAttribute('aria-hidden', 'true');
        origInput.style.position = 'absolute';
        origInput.style.opacity = '0';
        origInput.style.pointerEvents = 'none';
        origInput.style.width = '1px';
        origInput.style.height = '1px';
        origInput.style.zIndex = '-1';

        origInput.insertAdjacentElement('beforebegin', visualInput);

        // 3. Sincroniza máscara visual + valor +55 no original + eventos para SHA-256
        var syncPhone = function() {
          var digits = visualInput.value.replace(/\D/g, '');

          if (digits.indexOf('55') === 0 && digits.length >= 12) {
            digits = digits.slice(2);
          }
          digits = digits.slice(0, 11);

          var newFormattedE164 = digits.length > 0 ? '+55' + digits : '';

          if (digits.length === 0) {
            visualInput.value = '';
          } else if (digits.length <= 2) {
            visualInput.value = '(' + digits;
          } else if (digits.length <= 6) {
            visualInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
          } else if (digits.length <= 10) {
            visualInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
          } else {
            visualInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
          }

          // Atualiza o original e avisa o ConversionMapper/RD Station em tempo real
          if (origInput.value !== newFormattedE164) {
            origInput.value = newFormattedE164;
            origInput.dispatchEvent(new Event('input', { bubbles: true }));
            origInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        visualInput.addEventListener('input', syncPhone);
        visualInput.addEventListener('change', syncPhone);
        visualInput.addEventListener('blur', syncPhone);

        var parentForm = origInput.closest('form');
        if (parentForm) {
          parentForm.addEventListener('submit', syncPhone, true);
        }

        if (origInput.value) {
          visualInput.value = origInput.value;
          syncPhone();
        }
      })(originals[i]);
    }
  }

  setupRDPhone();
  var checks = 0;
  var timer = setInterval(function() {
    setupRDPhone();
    checks++;
    if (checks >= 30) clearInterval(timer);
  }, 500);
})();
