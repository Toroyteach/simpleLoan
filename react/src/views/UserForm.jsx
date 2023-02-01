import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Document, Page } from 'react-pdf';

export default function UserForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    firstname: '',
    lastname: '',
    id_number: '',
    number: '',
    address: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    photo_url: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()
  const [userLoans, setUserLoans] = useState([]);
  const [show, setHide] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // if (id) {
  //   useEffect(() => {
  //     setLoading(true)
  //     axiosClient.get(`/users/${id}`)
  //       .then(({ data }) => {
  //         setLoading(false)
  //         setUser(data)
  //         getUserLoans(id);
  //       })
  //       .catch(() => {
  //         setLoading(false)
  //       })
  //   }, [])
  // }

  const getUserData = () => {
    setLoading(true)
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setLoading(false)
        setUser(data)
        getUserLoans(id);
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onSubmit = ev => {
    ev.preventDefault()
    // if (user.id) {
    axiosClient.put(`/users/${user.id}`, user)
      .then(() => {
        getUserData()
        setNotification('User was successfully updated')
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
    // } else {
    //   axiosClient.post('/users', user)
    //     .then(() => {
    //       setNotification('User was successfully created')
    //     })
    //     .catch(err => {
    //       const response = err.response;
    //       if (response && response.status === 422) {
    //         setErrors(response.data.errors)
    //       }
    //     })
    // }
  }

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

  const getUserLoans = (id) => {
    setLoading(true)
    axiosClient.get(`/userLoans/${id}`)
      .then(({ data }) => {
        setLoading(false)
        setUserLoans(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  }

  useEffect(() => {
    getUserData()
  }, [id])

  return (
    <>
      {user.id && <h2>User : {user.name}</h2>}
      {!user.id && <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
      </div>

      <Link className="btn-info" to={'/users'}>Back</Link>

      <Container>
        <Row>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={"https://api.kuza.mtangazajisacco.co.ke/uploads/" + user.photo_url} />
              <Card.Body>
                <Card.Title> {user.name} </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Container>

              {!loading && (
                <div className="card animated fadeInDown">
                  <form className="row g-3" onSubmit={onSubmit}>
                    <div className="col-md-6">
                      <label for="inputEmail4" className="form-label">Firstname</label>
                      <input type="text" autocomplete="off" className="form-control" id="inputText4" value={user.firstname} onChange={ev => setUser({ ...user, firstname: ev.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label for="inputPassword4" className="form-label">Lastname</label>
                      <input type="text" autocomplete="off" className="form-control" id="inputText4" value={user.lastname} onChange={ev => setUser({ ...user, lastname: ev.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label for="inputEmail4" className="form-label">Email</label>
                      <input type="email" autocomplete="off" className="form-control" id="inputEmail4" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label for="inputEmail4" className="form-label">Phone Number</label>
                      <input type="number" autocomplete="off" className="form-control" id="inputNumber4" maxLength={12} value={user.number} onChange={ev => setUser({ ...user, number: ev.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label for="inputPassword4" className="form-label">Password</label>
                      <input autocomplete="off" type="password" className="form-control" id="inputPassword4" onChange={ev => setUser({ ...user, password: ev.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label for="inputPassword4" className="form-label">Confirm Password</label>
                      <input autocomplete="off" type="password" className="form-control" id="inputPassword4" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label for="inputPassword4" className="form-label">Id Number</label>
                      <input type="number" autocomplete="off" className="form-control" id="inputNumber4" value={user.id_number} onChange={ev => setUser({ ...user, id_number: ev.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label for="inputPassword4" className="form-label">Address</label>
                      <input type="text" autocomplete="off" className="form-control" id="inputText4" value={user.address} onChange={ev => setUser({ ...user, address: ev.target.value })} required />
                    </div>
                    <div className="col-12">
                      <select class="form-select" aria-label="Default select example" value={user.role} onChange={ev => setUser({ ...user, role: ev.target.value })} required>
                        <option selected>Add Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                  </form>
                </div>
              )}

            </Container>
          </Col>

        </Row>

        <br />
        <br />
        <br />

        <div>
          <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
            <h1>Loan Requests</h1>
            <button className="btn btn-primary">Print</button>
            <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
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


              {/* {!loading &&
                <tbody>
                  {userLoans.map(u => (
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
              } */}

              {(loading) ? (
                <tbody>
                {userLoans.map(u => (
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
              ) : (
                <div class="alert alert-warning" role="alert">
                  There are no Loans ata the moment.
                </div>
              )}


            </table>
          </div>
        </div>
      </Container>
    </>
  )
}
