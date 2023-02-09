import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import Sidebar from "../views/new/Sidebar";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification, setNotification } = useStateContext();

  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data)
      })
  }, [])

  if (!token) {

    return <Navigate to="/login" />

  }

  if (user.account_activated === 0) {

    if (location.pathname == '/profile') {

    } else {

      setNotification("You need to Update your details to procceed");

      return <Navigate to="/profile" />
    }

  }

  return (
    <div id="defaultLayout">
      {/* <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
      </aside> */}
      <Sidebar />
      <div className="content">
        <header>
          <div>
            Welcome &nbsp; {user.name}
          </div>
        </header>

        <main>
          <Outlet />
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
