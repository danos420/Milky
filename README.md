# מילקי: ברדק אחולמניוקי 🐶

משחק תלת־ממד בדפדפן: מילקי, אבא, דני, השכנים והחתול. בית אחד שלא ישרוד את היום.

## מבנה
- `src/js/` – הקוד, מחולק לחלקים לפי נושא. הסדר נקבע ב־`src/js/ORDER.txt` (הכל רץ כסקריפט אחד, לפי הסדר).
- `src/styles.css`, `src/body.html` – העיצוב והממשק.
- `src/sw.js` – עבודה בלי אינטרנט (Service Worker).
- `assets/` – אייקונים ו־three.js (r149).
- `tools/icon.js` – מצייר את האייקון של מילקי מתוך המשחק עצמו.
- `tests/` – בדיקות אוטומטיות (Playwright).

## בנייה
```
python3 build.py          # dist/ : אפליקציה מוכנה להעלאה
python3 build.py --check  # גם מוודא שהבנייה זהה לגרסה הקודמת
```
`dist/index.html` + כל התיקייה = האתר. `dist/artifact.html` = הגרסה לעמוד ב־claude.ai.

## בדיקות
```
NODE_PATH=$(npm root -g) node tests/logic.js dist/index.html
NODE_PATH=$(npm root -g) node tests/pwa.js     # התקנה + עבודה בלי אינטרנט
```

## העלאה לאוויר
כל אחסון סטטי עם https: GitHub Pages, Netlify, Cloudflare Pages או itch.io (HTML game, להעלות את ה־zip של dist).
