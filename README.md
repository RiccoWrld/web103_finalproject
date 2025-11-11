# 🦸‍♂️ HabitHero

### CodePath WEB103 Final Project

**Designed and developed by:**  
Ricardo Beale, Vitaliy Prymak, Om Patki

🔗 **Link to deployed app:** _coming soon_

---

## 🧩 About

### 📝 Description and Purpose
HabitHero is a fullstack web app that helps users build and track positive habits through small daily goals.  
Each completed habit helps the user’s “hero” grow stronger, motivating consistency and self-improvement.  
The app allows users to add, edit, and delete habits, view progress, and earn virtual achievements for streaks.

### 💡 Inspiration
We were inspired by apps like **Habitica** and **Duolingo** that combine productivity with fun.  
Many people struggle to stay consistent, so we wanted to create something that makes tracking habits more engaging — turning discipline into a game.

---

## ⚙️ Tech Stack
- **Frontend:** React, React Router, Tailwind CSS  
- **Backend:** Express.js, Node.js, PostgreSQL

---

## 🌟 Features

### 🪪 Authentication ✅
Users will be able to create an account, log in, and securely access their personalized habit data.
![](gifs/Authentication.gif)

### 🧠 Habit Dashboard with Habit Cards ✅ 
Users can view all their habits in one place with progress tracking and streak counts. Each habit will be displayed as a card showing its name, progress, category, and completion status, allowing users to easily track and manage their habits.

### ➕ Add / Edit / Delete Habits ✅ 
Users can create new habits, update them, or remove them easily from their dashboard.

### 🔄 Mark as Completed on Same Page ✅
Users can mark habits as complete for the day **without leaving the dashboard** (handled on same page).

### 💬 Modal Confirmation ✅
A confirmation modal appears when deleting a habit — no page navigation needed.




---

## 🔥 Bonus (Stretch Features)
- Show motivational quotes or toast messages after completing habits  
- Progress bar animations for hero level  
- User login with simple authentication

---

## 💻 Installation Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-team/habithero.git
```
### 2. Install dependencies
```bash
cd habithero
npm install
cd client
npm install
```
### 3. Create and seed the PostgreSQL database
```bash
npm run db:reset
```
### 4. Run both servers
```bash
npm run dev
```
### 5. Open the app
- Visit: http://localhost:5173
