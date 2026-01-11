import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import HomePage from './pages/Homepage.jsx';
import Dashboard from './Pages/UserDashboard.jsx';
import ApplyInternships from './Pages/UserDashboard/Applyinternship.jsx';
import AppliedInternships from './Pages/UserDashboard/Appliedinternship.jsx';
import BookmarkedInternships from './Pages/UserDashboard/Bookmarkedinternship.jsx';
import Internship from './Pages/UserDashboard/Internship.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "apply",
        element: <ApplyInternships />,
      },
      {
        path: "apply/interndetail/:internid",
        element: <Internship />,
      },
      {
        path: "applied",
        element: <AppliedInternships />,
      },
      {
        path: "bookmarked",
        element: <BookmarkedInternships />,
      },
    ],
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>  {/**why we do this */}    
  </StrictMode>
)
