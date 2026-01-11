import { useState } from 'react'
import HomePage from './pages/Homepage'
import Dashboard from './Pages/UserDashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Dashboard/>
    </>
  )
}

export default App
