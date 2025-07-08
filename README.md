# Mess Management System

A web-based platform to streamline meal booking and mess management for hostels, providing advance meal registration, digital menu display, and automated billing based on attendance.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Highlights](#api-highlights)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Mess Management System enables students to register for their meals in advance (at least 24 hours prior to mealtime), view hall-specific menus, and ensures that mess staff can prepare appropriate quantities of food. This system helps reduce food waste, allows students to pay only for the meals they consume, and provides transparent billing at the end of the month.

**Key Use Cases:**
- Students can book or skip meals easily via a web portal.
- Mess managers get accurate headcounts for every meal.
- Menus for each hall are displayed online.
- Students are billed based only on the meals they attended.

---

## Features

- **User Authentication:** Secure login and registration for students.
- **Meal Booking:** Book/cancel meals for specific days and meal types (breakfast/lunch/dinner) ahead of time.
- **Menu Display:** Weekly/daily menus for each mess hall are displayed on the website.
- **Dynamic Billing:** Calculate each student's mess bill according to the meals actually booked and consumed.
- **Role Management:** Separate interfaces for students and mess administrators.
- **Food Inventory Prediction:** Kitchen staff can see exactly how much food to prepare each day.
- **Extras and Special Menus:** Menus can include regular, extras, and special dishes.
- **Responsive UI:** Modern frontend using React/Next.js.

---

## How It Works

1. **Student Login:** Users sign up and log in with credentials.
2. **Meal Booking:** Students book their desired meals for upcoming days (with a 24-hour advance requirement).
3. **Menu Browsing:** Users can view the menu for each hall and each day before booking.
4. **Meal Consumption:** Attendance is tracked for each meal; students who booked can attend.
5. **Billing:** At the end of the month, only meals consumed are billed.
6. **Admin Dashboard:** Mess staff view bookings, manage menus, and see food quantity requirements.

---

## Tech Stack

- **Frontend:** React, Next.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Other:** CORS, dotenv

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MrTimeHacker1/Mess-Management-System.git
   cd Mess-Management-System
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   npm install express jsonwebtoken bcryptjs
   # Configure your MongoDB URI in .env as MONGO_URI
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the app:**  
   Open your browser at `http://localhost:3000`

---

## Project Structure

```
Mess-Management-System/
├── client/              # Frontend (React/Next.js)
│   ├── app/
│   ├── components/
│   └── ...
├── server/              # Backend (Node.js/Express)
│   ├── api/             # Route handlers
│   ├── models/          # Mongoose models (User, Meal, Booking, etc.)
│   ├── utils/           # Seed scripts, helpers, middleware
│   └── server.js        # Server entry point
└── README.md
```

---

## API Highlights

- **/api/auth** — User authentication routes (login, register)
- **/api/bookings** — Book/cancel meals, view booking history
- **/api/halls** — Get available mess halls
- **/api/meals** — Get menu for halls by day/meal type

Example:  
To book a meal (POST `/api/bookings`):
```json
{
  "hallId": "<hall_id>",
  "mealType": "lunch",
  "date": "2025-07-09T00:00:00.000Z"
}
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, enhancements, or feature requests.

---

## License

This project is licensed under the MIT License.
