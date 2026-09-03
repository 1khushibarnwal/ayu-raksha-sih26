import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* AUTHENTICATED APP */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="health"
            element={
              <h1>My Health</h1>
            }
          />

          <Route
            path="assessment"
            element={
              <h1>Assessment</h1>
            }
          />

          <Route
            path="insights"
            element={
              <h1>Insights</h1>
            }
          />

          <Route
            path="history"
            element={
              <h1>History</h1>
            }
          />

          <Route
            path="settings"
            element={
              <h1>Settings</h1>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App