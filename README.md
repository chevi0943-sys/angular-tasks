🚀 מערכת WolfTasks - ניהול משימות וצוותים
מערכת Full-Stack מתקדמת לניהול פרויקטים ומשימות בתוך צוותים, בסגנון Kanban/ClickUp.

📂 מבנה הפרויקט
הפרויקט מחולק לשני חלקים עיקריים:

task-manager: צד הלקוח (Frontend) שנבנה ב-Angular 20.

WolfTasksServer-main: צד השרת (Backend) שנבנה ב-Node.js עם מסד נתונים SQLite.

🛠 טכנולוגיות בשימוש
Frontend: Angular 20, TypeScript, SCSS.

Authentication: JWT (JSON Web Token).

Database: SQLite.

🚀 הוראות התקנה והרצה
1. הרצת צד השרת (Server)
יש לוודא שהשרת פועל בכתובת http://localhost:3000.

Bash
cd server
npm install
npm start
2. הרצת צד הלקוח (Client)
פתחי טרמינל חדש והריצי:

Bash
cd task-manager
npm install
ng serve
לאחר ההרצה, האפליקציה תהיה זמינה בכתובת: http://localhost:4200.

📋 תכונות עיקריות במערכת
מערכת הזדהות: הרשמה והתחברות מאובטחת לקבלת Token.

ניהול צוותים: יצירת צוותים והוספת חברים.

ניהול פרויקטים: חלוקת העבודה בצוות לפי פרויקטים מוגדרים.

לוח משימות (Task Board): הוספה, עדכון (PATCH), מחיקה וניהול תגובות לכל משימה.