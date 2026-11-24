// Lenkine.eu — interakcie: akcia SVOKRA, výber balíka, objednávka (Netlify Forms), filter obrazov.
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // ---------- Akcia / balíky ----------
  var promoAllowed = !root.classList.contains('promo-off');
  var promoOn = promoAllowed;

  var promoSet = $('[data-offers="promo"]');
  var regularSet = $('[data-offers="regular"]');
  var toggle = $('.promo-toggle');
  var summary = $('[data-summary]');
  var packageField = $('[data-package-field]');
  var codeField = $('[data-code-field]');
  var priceFoot = $('[data-price-foot]');
  var fromPrice = $('[data-from-price]');

  function activeSet() { return promoOn ? promoSet : regularSet; }

  function syncPackage() {
    var checked = $('input:checked', activeSet()) || $('input', activeSet());
    if (!checked) return;
    checked.checked = true;
    summary.textContent = checked.dataset.label + ' · ' + checked.dataset.price;
    packageField.value = checked.value;
  }

  function applyPromo() {
    promoSet.hidden = !promoOn;
    promoSet.disabled = !promoOn;
    regularSet.hidden = promoOn;
    regularSet.disabled = promoOn;
    // pri prepnutí začni prvou možnosťou
    var first = $('input', activeSet());
    if (first) first.checked = true;
    codeField.value = promoOn ? 'SVOKRA' : '';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(promoOn));
      toggle.textContent = promoOn ? '✓ kód SVOKRA uplatnený' : 'Uplatniť kód SVOKRA';
    }
    priceFoot.textContent = promoOn
      ? 'Akciová cena s kódom SVOKRA platí do 18. 12. 2026.'
      : 'Bežné ceny. Pri 5 kusoch poštovné zdarma.';
    if (fromPrice) fromPrice.textContent = promoAllowed ? '18,90 €' : '18 €';
    syncPackage();
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (!promoAllowed) return;
      promoOn = !promoOn;
      applyPromo();
    });
  }
  $$('input[name="balik-vyber"]').forEach(function (input) {
    input.addEventListener('change', syncPackage);
  });
  applyPromo();

  // ---------- Doprava → adresa ----------
  var form = $('[data-order-form]');
  var addressLabel = $('[data-address-label]');
  var addressInput = $('[data-address-input]');
  var packetaHint = $('[data-packeta-hint]');

  function syncDelivery() {
    var d = $('input[name="doprava"]:checked', form);
    var packeta = !d || d.value === 'Packeta';
    addressLabel.textContent = packeta ? 'Výdajné miesto Packeta' : 'Adresa doručenia';
    addressInput.placeholder = packeta ? 'Názov výdajného miesta' : 'Ulica, číslo, mesto, PSČ';
    addressInput.autocomplete = packeta ? 'off' : 'street-address';
    packetaHint.hidden = !packeta;
  }
  $$('input[name="doprava"]', form).forEach(function (i) { i.addEventListener('change', syncDelivery); });
  syncDelivery();

  // ---------- Venovanie ----------
  var dedToggle = $('[data-dedication-toggle]');
  var dedText = $('[data-dedication]');
  function syncDedication() {
    dedText.hidden = !dedToggle.checked;
    if (dedToggle.checked) dedText.focus();
  }
  dedToggle.addEventListener('change', syncDedication);
  dedText.hidden = !dedToggle.checked;

  // ---------- Odoslanie (Netlify Forms cez fetch) ----------
  var thanks = $('[data-thanks]');
  var errorBox = $('[data-form-error]');
  var submitBtn = $('button[type="submit"]', form);

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return; // nechaj prehliadač ukázať chyby
    e.preventDefault();
    syncPackage();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Odosielam…';

    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus();
    }).catch(function () {
      errorBox.hidden = false;
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Odoslať objednávku';
    });
  });

  $('[data-reset]').addEventListener('click', function () {
    form.reset();
    promoOn = promoAllowed;
    applyPromo();
    syncDelivery();
    dedText.hidden = true;
    thanks.hidden = true;
    form.hidden = false;
    $('input[name="meno"]', form).focus();
  });

  // ---------- Filter obrazov ----------
  var grid = $('[data-paintings]');
  $$('[data-filter]').forEach(function (btn, _, all) {
    btn.addEventListener('click', function () {
      all.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      grid.classList.toggle('only-available', btn.dataset.filter === 'avail');
    });
  });
})();
