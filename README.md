# CarCare - Workshop Booking Platform

CarCare is a comprehensive platform that allows users to find, book, and manage car maintenance and repair services from registered workshops.

## 🚀 Features

- User authentication (Admin, Users, and Workshops)
- Location-based workshop discovery
- Real-time chat with workshop owners
- Secure online payments with Stripe
- Booking and appointment scheduling

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Payment Gateway:** Stripe
- **Real-time Communication:** Socket.io

## 📌 Installation & Setup

### Steps to Run

#### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/muhadkeloth/carcare.git
   cd carcare/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```



## 📜 License

This project is licensed under the [MIT License](LICENSE).


## 📧 Contact

For any inquiries, reach out at [muhadkeloth@gmail.com](mailto\:muhadkeloth@gmail.com).

