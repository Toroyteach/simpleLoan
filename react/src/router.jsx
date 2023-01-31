import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/auth/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/auth/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Register from "./views/auth/Register.jsx";
import Loans from "./views/utils/Loans.jsx";
import Profile from "./views/utils/Profile.jsx";
import Notifications from "./views/utils/Notifications.jsx";
import LoanForm from "./views/LoanForm.jsx";
import AddUser from "./views/AddUser.jsx";
import AddLoan from "./views/AddLoan.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/users"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <AddUser key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/profile',
        element: <Profile/>
      },
      {
        path: '/loans',
        element: <Loans/>
      },
      {
        path: '/loans/:id',
        element: <LoanForm />
      },
      {
        path: '/loans/create',
        element: <AddLoan />
      },
      {
        path: '/notifications',
        element: <Notifications/>
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/register',
        element: <Register/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
