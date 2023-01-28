import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setNotification } = useStateContext()

  useEffect(() => {
    getLoans();
  }, [])

  const onDeleteClick = loan => {
    if (!window.confirm("Are you sure you want to delete this Loan Application?")) {
      return
    }
    // axiosClient.delete(`/users/${loan.id}`)
    //   .then(() => {
    //     setNotification('User was successfully deleted')
    //     getUsers()
    //   })
  }

  const getLoans = () => {
    setLoading(true)
    axiosClient.get('/loans')
      .then(({ data }) => {
        setLoading(false)
        setLoans(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Loan Requests</h1>
        {/* <Link className="btn-add" to="/users/new">Add new</Link> */}
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
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
              {loans.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.user_id}</td>
                  <td>{u.loan_amount}</td>
                  <td>{u.status_id}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/loans/' + u.id}>View</Link>
                    &nbsp;
                    {(user.role != 'admin') ? (
                      <></>
                    ) : (
                      <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
