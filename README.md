<div align="center">
  <img src="./public/img/icons/logo.png" alt="SkipSmart Logo" width="120" />
  <h1>SkipSmart Frontend</h1>
  <p><strong>A modern, PWA-enabled attendance tracking system tailored for UFAZ University students.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Vue.js-3.2-4FC08D?style=flat-square&logo=vue.js" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vuex-4.0-4FC08D?style=flat-square&logo=vue.js" alt="Vuex 4" />
    <img src="https://img.shields.io/badge/Vue%20Router-4.0-4FC08D?style=flat-square&logo=vue.js" alt="Vue Router 4" />
    <img src="https://img.shields.io/badge/Element%20Plus-2.5-409EFF?style=flat-square&logo=element" alt="Element Plus" />
    <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa" alt="PWA" />
  </p>
</div>

---

SkipSmart powers an innovative attendance tracking system, dedicated to assisting UFAZ University students in managing their attendance effectively. This project is built with **Vue 3** and is designed as a **Progressive Web App (PWA)**, offering a seamless and mobile-responsive experience.

## ✨ Features

*   📊 **Effortless Attendance Tracking**
    *   Monitor your class attendance and missed sessions in real time, ensuring you never fall behind on your studies.
*   📈 **Comprehensive Attendance Insights**
    *   Access detailed reports on your attendance history and skipped classes to make informed decisions about your academic performance.
*   📱 **Progressive Web App (PWA)**
    *   Installable on mobile devices with offline capabilities for uninterrupted access.
*   🎨 **User-Friendly Interface**
    *   Enjoy an intuitive and easy-to-navigate design built with modern UI libraries, tailored specifically for UFAZ students.
*   🔒 **Secure Admin Panel**
    *   Role-based access control for administrators to manage courses, groups, and overall system data.

## 🛠️ Tech Stack

*   **Frontend Framework**: Vue 3 (Composition API)
*   **State Management**: Vuex 4
*   **Routing**: Vue Router 4
*   **Styling**: SCSS
*   **UI Component Library**: Element Plus
*   **PWA**: `@vue/cli-plugin-pwa`, `register-service-worker`
*   **Charting**: Chart.js

## 🚀 Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn

### Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Camrado/attendance-recorder-frontend.git
    cd skipsmart-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary API endpoints:
    ```env
    VUE_APP_API_BASE_URL=http://localhost:5000/api
    ```

### Development

To start the development server with hot-reload:
```bash
npm run serve
```

### Production Build

To compile and minify the application for production:
```bash
npm run build
```

### Linting

To run the linter and fix basic formatting issues:
```bash
npm run lint
```

## 📂 Project Structure

```
skipsmart-frontend/
├── public/           # Static assets and index.html
├── src/
│   ├── assets/       # SCSS styles, images, fonts
│   ├── components/   # Reusable Vue components
│   ├── router/       # Vue Router configuration
│   ├── store/        # Vuex state management modules
│   ├── views/        # Page-level Vue components
│   ├── App.vue       # Root component
│   └── main.js       # Entry point
├── .env              # Environment configuration
└── package.json      # Project metadata and dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
