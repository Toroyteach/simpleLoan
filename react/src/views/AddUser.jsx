import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function AddUser() {
    const navigate = useNavigate();
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

    const onSubmit = ev => {
        ev.preventDefault()

        axiosClient.post('/createNewUser', user)
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

    return (
        <>
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
                                        <div className="col-md-12">
                                            <label for="inputEmail4" className="form-label">username</label>
                                            <input type="text" autocomplete="off" className="form-control" id="inputText4" value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} />
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

            </Container>
        </>
    )
}
