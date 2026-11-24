# lenkine.eu

Jednostránkový statický web pre Lenkine (knihy, obrazy, ghostwriting, herectvo, kontakt), postavený podľa dizajnu `Lenkine.dc.html` z Claude Design.

Bez build kroku: čisté HTML + CSS + malý vanilla JS.

```
index.html        hlavná stránka
styles.css        štýly (farby a písma ako CSS premenné v :root)
main.js           akcia SVOKRA, výber balíka, objednávkový formulár, filter obrazov
dakujem/          ďakovná stránka (fallback bez JavaScriptu)
img/              optimalizované obrázky (WebP)
docs/             ukážka z knihy (PDF)
netlify.toml      nastavenie Netlify + presmerovania starých URL
```

## Lokálne spustenie

```
python3 -m http.server 8000
```

## Netlify

- Build command: prázdny, publish directory: `.`
- Objednávky chodia cez **Netlify Forms** (formulár `objednavka`). V Netlify: *Forms → objednavka → Form notifications → Email notification* nastav na `info@lenkine.eu`.

## Bežné úpravy

- **Akcia SVOKRA** sa automaticky skryje po 18. 12. 2026 (dátum v `<head>` v `index.html`). Ceny akcie aj bežné ceny sú v `index.html` v sekcii `#knihy`.
- **Obraz predaný**: v `index.html` pridaj článku triedu `sold`, doplň `<div class="stamp">PREDANÉ</div>` a odstráň odkaz „Mám záujem“.
- **Nový obraz**: skopíruj blok `<article class="painting">`, obrázok daj do `img/` (WebP, max. 900 px).
