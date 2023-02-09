import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import Records from "./utils/tbllusersUtils/Records.jsx";
import Pagination from "./utils/tbllusersUtils/Pagination.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setNotification } = useStateContext()
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  if (user.role === 'user') {
    navigate('/dashboard')
  }

  useEffect(() => {
    getUsers();
  }, [])

  // const onDisableClick = user => {

  //   if (!window.confirm("Are you sure you want to Change login status for this user?")) {
  //     return
  //   }

  //   axiosClient.put(`/disableUser/${user.id}`)
  //     .then(() => {
  //       setNotification('User Login status was successfully Changed')
  //       getUsers()
  //     })
  // }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = users.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(users.length / recordsPerPage)

  //console.log(nPages, currentPage, indexOfLastRecord, currentRecords)

  return (
    <div style={{ "height": "65vh" }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        {/* <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                    &nbsp;

                    {u.status ? (
                      <button className="btn-disable" onClick={ev => onDisableClick(u)}>Disable</button>
                    ) : (
                      <button className="btn-enable" onClick={ev => onDisableClick(u)}>Enable</button>
                    )}


                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table> */}

        {loading &&
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        }
        <Records data={currentRecords} getUsers={getUsers} />
        <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}
