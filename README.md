# React + TypeScript + Vite

# 🏠 Smart IoT Dashboard

A **real-time IoT monitoring dashboard** built with **React (TypeScript)**, **Vite**, **Tailwind CSS v3**, and **Recharts**.  
This dashboard displays live sensor data (mocked for now), tracks alerts, and provides an intuitive control center for smart home monitoring.

![Dashboard Preview]![iot smart](https://github.com/user-attachments/assets/f38c4a2d-9cd2-4a7a-b846-26e9c0ed3488)

---

## ✨ Features

- 📡 **Real-time Sensor Monitoring** (mock WebSocket simulation for now, backend-ready)
- 🔔 **Alerts System** with notification banner and history panel
- 📊 **Beautiful Charts & Graphs** powered by [Recharts](https://recharts.org/)
- 🏷️ **User Roles & Authentication** (Admin / Viewer)
- 🖥️ **Responsive Design** (Optimized for desktop and tablets)
- 🎨 **Animated UI** with Tailwind CSS (custom animations and gradients)
- 🌐 **Ready for Backend Integration** (currently uses mock data but structured for API/WebSocket)

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript) + Vite
- **UI Styling:** Tailwind CSS v3 (with custom animations)
- **Charts:** Recharts
- **State Management:** React hooks + Context API
- **Routing:** React Router DOM v6
- **Auth (Mock):** Context-based authentication with roles
- **Build/Deploy:** Vite (compatible with Vercel/Netlify)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-iot-dashboard.git
cd smart-iot-dashboard
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run in Development
```bash
npm run dev
```
Then open: **http://localhost:5173**

### 4️⃣ Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Authentication

The project uses **mock authentication** (for demo purposes) with **two roles**:
- **Admin** → Username: `admin`, Password: `admin123`
- **Viewer** → Username: `viewer`, Password: `viewer123`

These roles restrict access to certain pages/components (ready for backend auth integration later).

---

## 🧩 Project Structure

```
smart-iot-dashboard/
├── src/
│   ├── components/         # Reusable UI components (StatsCard, AlertsPanel, etc.)
│   ├── context/            # Auth context provider
│   ├── hooks/              # Custom hooks (useAuth, useWebSocket)
│   ├── pages/              # Page components (Dashboard, Login)
│   ├── types/              # TypeScript types/interfaces
│   ├── App.tsx             # Main app entry (routes & providers)
│   ├── main.tsx            # ReactDOM entry point
│   └── index.css           # Tailwind + global styles
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md
```

---

## 🔧 Future Improvements
- ✅ Replace mock WebSocket with **real backend API/WebSocket**
- ✅ Implement **persistent authentication** (JWT or OAuth)
- ✅ Add **multi-device control (IoT commands)**
- ✅ Export data & reports (CSV/PDF)
- ✅ Dark/Light mode (optional, UI already themed)


---

## 🖥️ Deployment
You can easily deploy this project using:
- **[Vercel](https://vercel.com/)**
- **[Netlify](https://netlify.com/)**
- Any static hosting service (since it’s a Vite SPA build).

---

## 🤝 Contributing
Pull requests are welcome!  
If you want to contribute:
1. Fork this repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Added feature"`
4. Push branch: `git push origin feature/my-feature`
5. Submit a PR 🎉

---


## 👨‍💻 Author
Developed by **PedroRod**  
🔗 [GitHub](https://github.com/YOUR_USERNAME)







