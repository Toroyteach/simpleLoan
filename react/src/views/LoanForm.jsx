import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'


export default function LoanForm() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [loan, setLoan] = useState({
        id: null,
        loan_amount: 0.0,
        status_id: null,
        description: '',
        max_limit_amount: 0,
        due_payment_date: '',
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user, setNotification, setAppNotification } = useStateContext()

    const [disabled, setDisabled] = useState(true);

    const getLoanDetails = () => {
        setLoading(true)
        axiosClient.get(`/loans/${id}`)
            .then(({ data }) => {
                setLoading(false)
                setLoan(data)

                if (data.status_id === 'AdjustAmount') {
                    setDisabled(false);
                }

            })
            .catch(() => {
                navigate('/notifications')
                setNotification('The loan Application item was deleted')
                setLoading(false)
            })
    }

    // const onSubmit = ev => {
    //     ev.preventDefault()
    //     if (loan.id) {
    //         axiosClient.put(`/loans/${loan.id}`, loan)
    //             .then(() => {
    //                 getLoanDetails()
    //                 setNotification('Loan was successfully updated')
    //                 navigate('/users')
    //             })
    //             .catch(err => {
    //                 const response = err.response;
    //                 if (response && response.status === 422) {
    //                     setErrors(response.data.errors)
    //                 }
    //             })
    //     } else {
    //         axiosClient.post('/loans', loan)
    //             .then(() => {
    //                 setNotification('Loan was successfully created')
    //                 navigate('/users')
    //             })
    //             .catch(err => {
    //                 const response = err.response;
    //                 if (response && response.status === 422) {
    //                     setErrors(response.data.errors)
    //                 }
    //             })
    //     }
    // }

    const getNotification = () => {
        axiosClient.get('/getNotifications')
            .then(({ data }) => {
                //setNotificationsCount(data)
                setAppNotification(data)
            })
            .catch(() => {

            })
    }

    const updateStatus = async () => {

        const { value: status } = await Swal.fire({
            title: 'Select field validation',
            input: 'select',
            inputOptions: {
                1: 'Processing',
                2: 'Approved',
                3: 'AdjustAmount',
                4: 'Rejected',
                5: 'Defaulted',
                6: 'Paid'
            },
            inputPlaceholder: 'Select new Status',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {

                    if (value) {
                        resolve()
                    } else {
                        resolve('You need to make a selection :)')
                    }
                })
            }
        })

        if (status) {

            const data = {
                status_id: status
            }

            axiosClient.put(`/updateStatus/${loan.id}`, data)
                .then(() => {
                    getLoanDetails()
                    getNotification()
                    setNotification('Loan Status was successfully updated')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })

        }
    }

    const makeRepayment = async () => {

        if (loan.status_id != 'Approved') {

            Swal.fire({
                position: 'top-end',
                icon: 'question',
                title: 'This loan Application is not yet approved.',
                showConfirmButton: false,
                timer: 2000
            })

            return
        }

        const { value: amount } = await Swal.fire({
            title: 'Would you like to make Loan Repayment',
            icon: 'question',
            input: 'range',
            inputLabel: 'Amount',
            inputAttributes: {
                min: 0,
                max: loan.balance_amount,
                step: 500
            },
            inputValue: 0
        })

        if (amount > 0) {

            const data = {
                amount: amount
            }

            axiosClient.put(`/makeRepayment/${loan.id}`, data)
                .then(() => {
                    getLoanDetails()
                    getNotification()
                    setNotification('Loan Repayment was successfully updated')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }

    }

    const setMaxCreditLimit = async () => {
        const { value: amount } = await Swal.fire({
            input: 'number',
            inputLabel: 'Maximum Loan Amount',
            inputPlaceholder: 'Enter Amount'
        })

        if (amount) {
            //ssend to database

            const data = {
                max_limit_amount: amount,
                status_id: 3
            }

            axiosClient.put(`/setMaxCreditLimit/${loan.id}`, data)
                .then(() => {
                    getLoanDetails()
                    getNotification()
                    setNotification('Loan Maximum limit was successfully updated')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    const setNewLoanAmount = async () => {

        const { value: amount } = await Swal.fire({
            title: 'Would you like to choose new Loan Amount',
            icon: 'question',
            input: 'range',
            inputLabel: 'New Loan Amount',
            inputAttributes: {
                min: 1000,
                max: loan.max_limit_amount,
                step: 500
            },
            inputValue: 1000
        })

        if (amount > 0) {

            const data = {
                loan_amount: amount,
                status_id: 1
            }

            axiosClient.put(`/setNewLoanAmount/${loan.id}`, data)
                .then(() => {
                    getLoanDetails()
                    getNotification()
                    setNotification('New Loan Amount was successfully updated')
                    setDisabled(true);
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    const setMpesaStatement = async () => {
        const { value: uid } = await Swal.fire({
            input: 'text',
            inputLabel: 'ENTER MPESA STATEMENT',
            inputPlaceholder: 'Enter Receipt number'
        })

        if (uid) {
            //ssend to database
            let text = uid;

            const data = {
                mpesa_receipt: text.toUpperCase(),
            }

            axiosClient.put(`/updateMpesaStatement/${loan.id}`, data)
                .then(() => {
                    getLoanDetails()
                    setNotification('Loan Mpesa Statement was successfully updated')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    const downloadStatement = () => {

        const config = {
            headers: {
                "responseType": "blob"
            }
        };

        const fileId = loan.file

        const id = fileId //fileId.substring(0, fileId.length-3);

        axiosClient.get(`/downloadLoanFile/${id}`, config)
            .then((response) => {

                console.log(response.data)

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${user.name}_mpesa_statement.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();

                // let url = window.URL.createObjectURL(response.data);
                // let a = document.createElement('a');
                // a.href = url;
                // a.setAttribute('download', `${user.name}_mpesa_statement.pdf`);
                // a.click();

            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })


    }

    useEffect(() => {

        getLoanDetails()

    }, [id])

    return (
        <>
            {/* {user.id && <h2>Loan Details:<span> {user.name}</span></h2>} */}

            <Container>

                {loading &&
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }

                <Row>
                    <Col>
                        <Card>
                            <Form>
                                <Row>
                                    <Col>
                                        <div className="form-floating mb-3">
                                            <input type="number" className="form-control" id="floatingInput" placeholder="name@example.com" value={loan.loan_amount} disabled />
                                            <label htmlFor="floatingInput">Loan Amount</label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-floating">
                                            <input type="number" className="form-control" id="floatingPassword" placeholder="0.00" value={loan.max_limit_amount} disabled />
                                            <label htmlFor="floatingPassword">Max Loan Limit</label>
                                        </div>
                                    </Col>
                                </Row>

                                <br />

                                <div className="form-floating">
                                    <textarea value={loan.description} className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} disabled></textarea>
                                    <label htmlFor="floatingTextarea2">Loan Description</label>
                                </div>

                                <br />

                                <Row>
                                    <Col>
                                        <div className="form-floating mb-3">
                                            <input type="number" className="form-control" id="floatingInput" placeholder="name@example.com" value={loan.repaid_amount} disabled />
                                            <label htmlFor="floatingInput">Repaid Amount</label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-floating">
                                            <input type="number" className="form-control" id="floatingPassword" placeholder="Password" value={loan.balance_amount} disabled />
                                            <label htmlFor="floatingPassword">Balance Amount</label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-floating">
                                            <input type="number" className="form-control" id="floatingPassword" placeholder="Password" value={loan.loan_amount_plus_interest} disabled />
                                            <label htmlFor="floatingPassword">Amount plus Interest</label>
                                        </div>
                                    </Col>
                                </Row>

                                <br />

                                <Row>
                                    <Col>
                                        <div className="form-floating mb-3">
                                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={loan.created_at} disabled />
                                            <label htmlFor="floatingInput">Date Created</label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={loan.status_id} disabled />
                                            <label htmlFor="floatingPassword">Status</label>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    {(user.role != 'admin') ? (
                                        <></>
                                    ) : (
                                        <Col>
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={loan.mpesa_receipt} disabled />
                                                <label htmlFor="floatingPassword">Mpesa Receipt</label>
                                            </div>
                                        </Col>
                                    )}

                                </Row>

                                <Row>
                                    {(user.role != 'admin') ? (
                                        <></>
                                    ) : (
                                        <Col>
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={loan.approved_date} disabled />
                                                <label htmlFor="floatingPassword">Approved Date</label>
                                            </div>
                                        </Col>
                                    )}
                                    <Col>
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={loan.due_payment_date} disabled />
                                            <label htmlFor="floatingPassword">Payment Due Date</label>
                                        </div>
                                    </Col>

                                </Row>

                            </Form>
                        </Card>
                    </Col>

                    {(user.role != 'admin') ? (
                        <Col>
                            <Container>

                                <button type="button" className="btn btn-primary" onClick={setNewLoanAmount} disabled={disabled}>Update Request Amount</button>

                            </Container>
                        </Col>
                    ) : (
                        <Col>
                            <Container>

                                <button type="button" className="btn btn-primary" onClick={makeRepayment}>Make Repayment</button>
                                <br /><br />
                                <button type="button" className="btn btn-secondary" onClick={updateStatus}>Update Status</button>
                                <br /><br />
                                <button type="button" className="btn btn-success" onClick={setMaxCreditLimit}>Set Max Credit Limit</button>
                                <br /><br />
                                <button type="button" className="btn btn-success" onClick={setMpesaStatement}>Set Mpesa Statement</button>
                                <br /><br />
                                <button type="button" className="btn btn-success" onClick={downloadStatement}>Download Statement</button>

                            </Container>
                        </Col>
                    )}

                    <Link className="btn-info" to={'/loans'}>Back</Link>

                </Row>
            </Container>
        </>
    )
}
