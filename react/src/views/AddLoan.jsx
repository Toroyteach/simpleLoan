import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function AddLoan() {
    const navigate = useNavigate();
    const [loanRequest, setLoanRequest] = useState({
        loan_amount: '',
        description: '',
        user_id: null,
        uploadfile: null
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user, setNotification, setAppNotification } = useStateContext()

    const [loanFile, setLoanFile] = useState([])

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const handleLoanFileSelect = (event) => {
        setLoanFile(event.target.files[0])
    }

    const onSubmit = ev => {
        ev.preventDefault()

        setLoanRequest({ ...loanRequest, user_id: user.id })

        const formData = new FormData();

        for ( var key in loanRequest ) {
            formData.append(key, loanRequest[key]);
        }

        formData.append("uploadfile", loanFile);

        axiosClient.post('/loans', formData, config)
            .then(() => {
                getNotification()
                setNotification('User was successfully created')
                navigate('/loans')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
    }

    const getNotification = () => {
        axiosClient.get('/getNotifications')
            .then(({ data }) => {
                //setNotificationsCount(data)
                setAppNotification(data)
            })
            .catch(() => {

            })
    }

    useEffect(() => {

        //getNotification()

    }, [])

    useEffect(() => {

        setLoanRequest({ ...loanRequest, user_id: user.id })

    }, [user])

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
                                            <label htmlFor="inputEmail4" className="form-label">Loan Amount</label>
                                            <input type="number" autoComplete="off" className="form-control" id="inputText4" onChange={ev => setLoanRequest({ ...loanRequest, loan_amount: ev.target.value })} required />
                                        </div>
                                        <div className="form-floating">
                                            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} onChange={ev => setLoanRequest({ ...loanRequest, description: ev.target.value })} required></textarea>
                                            <label htmlFor="floatingTextarea2">Loan Description</label>
                                        </div>
                                        <div className="form-group">
                                            <input type="file" onChange={handleLoanFileSelect} required/>
                                            <label htmlFor="floatingTextarea2">Upload Loan Statement</label>
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
