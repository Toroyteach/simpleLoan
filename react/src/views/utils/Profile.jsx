import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const { user, setNotification, setUser } = useStateContext()

    const [updateUser, setUpdateUser] = useState({
        id: null,
        name: '',
        firstname: '',
        lastname: '',
        id_number: '',
        number: '',
        address: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const [errors, setErrors] = useState(null)

    const [image, setImage] = useState([])

    const [imageUrl, setImageUrl] = useState('')

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const handleFileSelect = (event) => {
        setImage(event.target.files[0])
    }

    const uploadImage = en => {

        en.preventDefault()

        const formData = new FormData();

        formData.append("file", image);

        axiosClient.post(`/uploadUserImage`, formData, config)
            .then(() => {
                setLoading(false)
                setNotification('Image was successfully uploaded')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })

    }

    useEffect(() => {
        
        setUpdateUser(user)

    }, [user])

    const onSubmit = ev => {
        ev.preventDefault()

        setLoading(true)

        axiosClient.put(`/usersUpdate/${user.id}`, updateUser)
            .then(({data}) => {
                setLoading(false)
                console.log(data)
                //setUser(data)
                setNotification('User was successfully updated')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1>Profile</h1>
                {/* <Link className="btn-add" to="/users/new">Add new</Link> */}
            </div>

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

            <Container>
                <Row>
                    <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={"https://kuza.mtangazaji.com/uploads/" + user.photo_url} />
                            <Card.Body>
                                <Card.Title> {user.name} </Card.Title>
                            </Card.Body>
                            <Card.Body>
                                <form onSubmit={uploadImage}>
                                    <input type="file" onChange={handleFileSelect} />
                                    <button type="submit" className="btn btn-primary">Upload</button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Form onSubmit={onSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupText">
                                        <Form.Label>Firstname</Form.Label>
                                        <input type="text" placeholder="Enter Firstname" value={updateUser.firstname} onChange={ev => setUpdateUser({ ...updateUser, firstname: ev.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Lastname</Form.Label>
                                        <input type="text" placeholder="Enter Lastame" value={updateUser.lastname} onChange={ev => setUpdateUser({ ...updateUser, lastname: ev.target.value })} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>Email address</Form.Label>
                                <input autocomplete="off" type="email" placeholder="Enter Email" value={updateUser.email} onChange={ev => setUpdateUser({ ...updateUser, email: ev.target.value })} disabled />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Password</Form.Label>
                                        <input autocomplete="off" type="password" placeholder="Enter Password" onChange={ev => setUpdateUser({ ...updateUser, password: ev.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <input autocomplete="off" type="password" placeholder="Confirm Password"  onChange={ev => setUpdateUser({ ...updateUser, password_confirmation: ev.target.value })} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Phone Number</Form.Label>
                                        <input type="number" placeholder="Enter Phone Number" value={updateUser.number} onChange={ev => setUpdateUser({ ...updateUser, number: ev.target.value })} required />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Id Number</Form.Label>
                                        <input type="number" placeholder="Enter Id Number" value={updateUser.id_number} onChange={ev => setUpdateUser({ ...updateUser, id_number: ev.target.value })} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>Address</Form.Label>
                                <input type="text" placeholder="Enter Address" value={updateUser.address} onChange={ev => setUpdateUser({ ...updateUser, address: ev.target.value })} />
                            </Form.Group>
                            <Button type="submit">Update</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}
