# Smart Offer Slot Booking System

This project is a full-stack application designed for booking smart offer slots. It consists of a **Node.js (React/Vite)** frontend and a **.NET (C#)** backend.

## 🚀 Technologies Used

### Frontend
- **React 19**
- **Vite** (Build Tool)
- **TypeScript**
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Three.js / React Three Fiber** (3D Elements)
- **Axios** (API Requests)
- **React Router** (Navigation)

### Backend
- **.NET (C#)**
- **ASP.NET Core Web API**
- (Include database and ORM details like Entity Framework, SQL Server/PostgreSQL if applicable)

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 or matching version)
- A Code Editor (like [VS Code](https://code.visualstudio.com/))
- (Optional) Visual Studio for the backend

---

### 1. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables (like API base URLs) as needed.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173` (or the port provided by Vite).

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/SmartOfferBooking
   ```
2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```
3. Update configuration:
   - Check `appsettings.Development.json` inside the API project.
   - Update the connection strings or other required settings.
4. Run the API:
   ```bash
   cd SmartOfferBooking.API
   dotnet run
   ```
5. The API will start and provide a localhost URL (e.g., `https://localhost:7001`). You can view the Swagger documentation if it's enabled by navigating to the `/swagger` endpoint.

---

## 🏗️ Project Structure

```text
Smart Offer Slot Booking System/
│
├── backend/                  # .NET backend solution
│   └── SmartOfferBooking/    # Solution folder
│       ├── SmartOfferBooking.API/
│       └── SmartOfferBooking.Tests/
│
├── frontend/                 # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code (components, pages, etc.)
│   ├── .env.example          # Template for environment variables
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite configuration
│
└── .gitignore                # Project Git exclusions
```

## 📝 License
This project is licensed under the [MIT License](LICENSE).
