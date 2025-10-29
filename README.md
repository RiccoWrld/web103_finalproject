🦸‍♂️ HabitHero

CodePath WEB103 Final Project

Designed and developed by: Ricardo Beale, Vitaliy Prymak, Om Patki

🔗 Link to deployed app: coming soon

🧩 About
📝 Description and Purpose

HabitHero is a fullstack web app that helps users build and track positive habits through small daily goals. Each completed habit helps the user’s “hero” grow stronger, motivating consistency and self-improvement. The app allows users to add, edit, and delete habits, view progress, and earn virtual achievements for streaks.

💡 Inspiration

We were inspired by apps like Habitica and Duolingo that combine productivity with fun. Many people struggle to stay consistent, so we wanted to create something that makes tracking habits more engaging — turning discipline into a game.

⚙️ Tech Stack

Frontend: React, React Router, Tailwind CSS
Backend: Express.js, Node.js, PostgreSQL

🌟 Features
🧠 Habit Dashboard

Users can view all their habits in one place with progress tracking and streak counts.

➕ Add / Edit / Delete Habits

Users can create new habits, update them, or remove them easily from their dashboard.

🧭 Filter by Category

Users can filter or sort habits by category (e.g. Health, Learning, Mindset).

🦸 Default Habits on Signup

When a new user creates an account, they automatically get 3 starter habits like “Drink Water,” “Read 10 Minutes,” and “Stretch.”

🔄 Progress Update on Same Page

Users can mark habits as complete for the day without leaving the dashboard (handled on same page).

💬 Modal Confirmation

A confirmation modal appears when deleting or completing a habit — no page navigation needed.

🔥 Bonus (Stretch Features)

Show motivational quotes or toast messages after completing habits

Progress bar animations for hero level

User login with simple authentication

💻 Installation Instructions

Clone the repository

git clone https://github.com/your-team/habithero.git


Install dependencies

cd habithero
npm install
cd client
npm install


Create and seed the PostgreSQL database

npm run db:reset


Run both servers

npm run dev


Open your app at http://localhost:5173
