import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Card from 'react-bootstrap/Card';

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

  const [imageUrl, setImageUrl] = useState('')

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('User was successfully updated')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/users', user)
        .then(() => {
          setNotification('User was successfully created')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

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

      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={"http://127.0.0.1:8000/uploads/"+user.photo_url} />
        <Card.Body>
          <Card.Title> {user.name} </Card.Title>
        </Card.Body>
      </Card>

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
              <input type="email"autocomplete="off"  className="form-control" id="inputEmail4" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} required />
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
    </>
  )
}
