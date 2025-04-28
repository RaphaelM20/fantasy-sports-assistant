# Fantasy Sports Assistant

Fantasy Sports Assistant is a full-stack web application designed to help fantasy football enthusiasts manage their teams and optimize matchups. The app offers real-time team and player comparisons, NFL matchup schedules, win probability projections, and secure user authentication.

## 🚀 Features
- **User Authentication**: Register, login, and manage sessions securely using hashed passwords.
- **NFL Data Integration**: Fetch real-time team offense/defense rankings, weekly matchup schedules, and player statistics.
- **Fantasy Matchup Analysis**: Input your fantasy team and your opponent’s team to calculate projected scores and win probabilities.
- **Responsive UI**: Designed for both desktop and mobile users using HTML, CSS, and JavaScript.
- **Cloud Deployment**: Hosted on Railway for scalability and easy access.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: bcrypt for password hashing, JSON Web Tokens (JWT) for session management
- **APIs**: Integrated NFL data APIs
- **Deployment**: Railway

## 📥 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaphaelM20/fantasy-sports-assistant.git
   cd fantasy-sports-assistant
   ```
2. **Install server dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**  
   Create a `.env` file in the root directory and add the following:
   ```bash
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   ```
4. **Run the server:**
   ```bash
   node server.js
   ```
5. **Access the frontend:**  
   Open the `frontend` folder and launch the HTML files (`login.html`, `register.html`, `home.html`, etc.) directly in your web browser.


