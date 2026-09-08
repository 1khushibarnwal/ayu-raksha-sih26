import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import DashboardLayout from './components/DashboardLayout'

import Assessment from './pages/Assessment'
import InnovationAnalyzer from './pages/InnovationAnalyzer'
import MyInnovations from './pages/MyInnovations'
import ProfileSettings from './pages/ProfileSettings'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/analyzer"
          element={<InnovationAnalyzer />}
        />

        <Route
          path="/innovations"
          element={<MyInnovations />}
        />

        <Route
          path="/settings"
          element={<ProfileSettings />}
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
            path="analyzer"
            element={<InnovationAnalyzer />}
          />

          <Route
            path="innovations"
            element={<MyInnovations />}
          />

          <Route
            path="health"
            element={
              <h1>My Health</h1>
            }
          />

          <Route
            path="assessment"
            element={<Assessment />}
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
            element={<ProfileSettings />}
          />

        </Route>

      </Routes>
      </ErrorBoundary>

    </BrowserRouter>
  )
}

export default App