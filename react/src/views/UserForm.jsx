import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Document, Page } from 'react-pdf';

import Records from "./utils/tblloanUtils/Records.jsx";
import Pagination from "./utils/tblloanUtils/Pagination.jsx";

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

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
    account_activated: null,
    photo_url: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()
  const [userLoans, setUserLoans] = useState([]);
  const [show, setHide] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const doc = new jsPDF()

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

        // if (data.account_activated === 0) {

        //   setUser({ ...user, firstname: ' ' })
        //   setUser({ ...user, lastname: ' ' })
        //   setUser({ ...user, address: ' ' })
        //   setUser({ ...user, password: ' ' })

        // }

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

  const downloadUserStatement = () => {
    setLoading(true)

    const id = user.id;

    axiosClient.get(`/userStatement/${id}`)
      .then(({ data }) => {
        setLoading(false)

        if (data.data.length > 0) {

          const loanArray = data.data
          const pdfData = []

          loanArray.forEach((item, index) => {

            pdfData.push([index + 1, item.user_id, item.loan_amount, item.created_at, item.approved_date, item.status_id, item.mpesa_receipt, item.balance_amount, item.due_payment_date])

          })

          doc.autoTable({
            body: [
              [{ content: `Name:${user.firstname} ${user.lastname}       Email:${user.email}        Number:${user.number}`, colSpan: 2, rowSpan: 2, styles: { halign: 'left' } }],
            ],
          })
          doc.autoTable({
            styles: { fontSize: 8 },
            head: [['Id', 'User', 'Amount-Requested', 'Created', 'Approved', 'Status', 'Mpesa-Statement', 'Balance', 'Payment-Due']],
            body: pdfData,
          })
          doc.save(`user_${user.name}_report.pdf`)

        } else {

          setNotification("No data to generate Report")

        }

      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getUserData()
  }, [id])

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = userLoans.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(userLoans.length / recordsPerPage)

  return (
    <>
      {user.id && <h2>User : {user.name}</h2>}

      {!user.id && <h2>New User</h2>}

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

      <Container style={{ "height": "70vh", "overflow": "auto" }}>
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
                      <select className="form-select" aria-label="Default select example" value={user.role} onChange={ev => setUser({ ...user, role: ev.target.value })} required>
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
            <button className="btn btn-primary" onClick={downloadUserStatement}>Print Report</button>
          </div>
          <div className="card animated fadeInDown">

            <Records data={currentRecords} />
            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </Container>
    </>
  )
}
