
# ConnectDevs Server

A backend microservice built with **Node.js**, **Express**, and **MongoDB** for powering the ConnectDevs platform — a space for developers to connect, share, and collaborate.

## 🚀 Tech Stack
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication
- **Bcrypt** – Password hashing
- **Dotenv** – Environment configuration

---

## 📂 Project Structure
connectdevsserver/
│
├── src/
│ ├── app.js # Main application entry
│ ├── route/ # API route definitions
│ ├── model/ # Mongoose schemas
│ ├── config/ # Database connection setup
│ └── middlewares/ # Custom middlewares
│ └── utils/ # Custom utlity functions
├── .env.sample # Environment variables template
├── package.json
└── README.md


---

## ⚙️ Environment Variables

Copy `.env.sample` to `.env` and fill in the values:

PORT=5000
MONGODB_CONNECTION_URL=your_mongodb_connection_string
DUMMY_DEFAULT_PROFILE_IMG=url_to_default_profile_image
JWT_SECRET_KEY=your_secret_key


## 🛠 Installation & Local Development

### 1️⃣ Clone the repository
```bash
git clone https://github.com/ashish-manna/connectDEVs.git
cd connectDEVs
```
2️⃣ Install dependencies
 ```bash
npm install
```
3️⃣ Setup environment variables
```bash
cp .env.sample .env
# Update the .env file with your own values
```
4️⃣ Start the development server
```bash
npm run dev
```
The server will run on:
```bash
http://localhost:<PORT>
```

