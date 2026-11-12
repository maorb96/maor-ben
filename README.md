# מאור ובן

משחק שאלות זוגי לערב: טקס בשלושה שלבים (חימום, עומק, סיום חם) ושאלות לפי נושא.
אתר סטטי פשוט, בלי build ובלי תלויות.

## מבנה

```
index.html              המסך
css/style.css           עיצוב
js/questions.js         כל השאלות והנושאים
js/ideas.js             רעיונות לדייטים בבית, בחוץ ולבישול ביחד (בלי חלב)
js/app.js               לוגיקת המשחק
manifest.webmanifest    התקנה כאפליקציה במסך הבית
icons/icon.svg          אייקון
.nojekyll               מונע עיבוד Jekyll ב־GitHub Pages
```

## הרצה מקומית

פותחים את `index.html` בדפדפן, או:

```bash
npx serve .
```

## העלאה ל־GitHub

```bash
cd maor-ben
git init
git add .
git commit -m "מאור ובן - גרסה ראשונה"
git branch -M main
git remote add origin https://github.com/<USERNAME>/maor-ben.git
git push -u origin main
```

(קודם יוצרים ריפו ריק בשם `maor-ben` ב־GitHub, בלי README.)

## פריסה ל־GitHub Pages

1. בריפו: Settings ← Pages.
2. תחת Build and deployment: Source = Deploy from a branch.
3. Branch = `main`, תיקייה = `/ (root)`, ושמירה.
4. אחרי דקה־שתיים האתר זמין בכתובת:
   `https://<USERNAME>.github.io/maor-ben/`

כל `git push` ל־main מעדכן את האתר אוטומטית.

שימו לב: בחשבון חינמי, GitHub Pages עובד רק מריפו ציבורי, כך שגם השאלות יהיו גלויות לכל מי שמגיע לריפו.

## התקנה בטלפון

פותחים את הכתובת בטלפון ← "הוספה למסך הבית" (באייפון: כפתור השיתוף ב־Safari). האתר נפתח כמו אפליקציה, במסך מלא.

## הוספת רעיונות

ב־`js/ideas.js` מוסיפים שורה במערך `items` של הסוג המתאים: `t` כותרת, `d` תיאור, `tag` מחיר או זמן. המתכונים במערך `cook` צריכים להישאר בלי חלב.

## הוספת שאלות

ב־`js/questions.js` מוסיפים שורה במערך `qs` של הנושא המתאים.
נושא חדש: מוסיפים אובייקט חדש ל־`CATS` עם `id`, `name`, `hint` ו־`qs`.
שינוי מבנה הטקס (כמה שאלות בכל שלב, מאילו נושאים): במערך `RITUAL`.

האתר זוכר אילו שאלות כבר נשאלו בדפדפן שבו משחקים (localStorage), כדי שלא יחזרו עד שנגמר הנושא.
