A full-stack theatre booking system where users can browse movies, book tickets, and select seats, while admins can add, update, and manage movies & theaters—similar to AMC’s online booking system.

✨ Features
✅ User Authentication – Secure login & registration (JWT).
✅ Browse & Book Movies – View showtimes and reserve seats.
✅ Admin Dashboard – Add, update, and remove movies & theaters.
✅ Payment Integration – Checkout system for purchasing tickets.
✅ Search & Filters – Find movies based on genre, language, and time.

🛠 Tech Stack
Backend
.NET 7 (ASP.NET Core REST API)
Entity Framework Core
Microsoft SQL Server
Frontend
React.js (TypeScript)
Mantine UI & Bootstrap

🚀 Getting Started
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Anuraj235/Nasa-Films.git
cd Nasa-Films

2️⃣ Setup Backend
Update the database connection string in appsettings.json
Apply database migrations:
bash
Copy
Edit
dotnet ef database update
Run the backend:
bash
Copy
Edit
dotnet run
The API will run at http://localhost:5000

3️⃣ Setup Frontend
Navigate to frontend directory:
bash
Copy
Edit
cd frontend
Install dependencies & start the React app:
bash
Copy
Edit
yarn install
yarn start
The app will be available at http://localhost:3000
