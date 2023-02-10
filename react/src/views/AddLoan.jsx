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

    const [loanAmount, setLoanAmount] = useState(0);
    const [totalPlusInterest, setTotalPlusInterest] = useState(0);
    const [paymentDue, setPaymentDue] = useState('');


    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const handleLoanFileSelect = (event) => {
        setLoanFile(event.target.files[0])
    }

    const onLoanAmountEnter = (ev) => {
        
        const loanAmountC = ev.target.value

        if(loanAmountC < 1000){
            return 
        }

        setLoanAmount(loanAmountC)
        setLoanRequest({ ...loanRequest, loan_amount: loanAmountC })


        const nextMonth = addMonths(new Date(), 1);
        setPaymentDue(nextMonth.toDateString())


        const interest = 0.1 * loanAmountC
        const floatAmount = parseFloat(loanAmountC)
        const totalPlusInterest = interest + floatAmount
        setTotalPlusInterest(totalPlusInterest)


    }

    function addMonths(date, months) {
        date.setMonth(date.getMonth() + months);

        return date;
    }

    const onSubmit = ev => {
        ev.preventDefault()

        setLoanRequest({ ...loanRequest, user_id: user.id })

        const formData = new FormData();

        for (var key in loanRequest) {
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

                            <Row>

                                <Col>
                                    {!loading && (
                                        <div className="card animated fadeInDown">
                                            <form className="row g-3" onSubmit={onSubmit}>
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label">Loan Amount</label>
                                                    <input type="number" autoComplete="off" className="form-control" id="inputText4" onChange={onLoanAmountEnter} required />
                                                </div>
                                                <div className="form-floating">
                                                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} onChange={ev => setLoanRequest({ ...loanRequest, description: ev.target.value })} required></textarea>
                                                    <label htmlFor="floatingTextarea2">Loan Description</label>
                                                </div>
                                                <div className="form-group required">
                                                    <input type="file" onChange={handleLoanFileSelect} required />
                                                    <label htmlFor="floatingTextarea2">Upload File</label>
                                                    <div class="alert alert-danger" role="alert">
                                                        Upload Previous 3 months Mpesa Statement or Pay slip
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary">Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </Col>

                                <Col>

                                    Loan Application Review


                                    <Row>
                                        <Col>
                                            <div className="form-floating">
                                                <input className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} value={loanAmount} disabled></input>
                                                <label htmlFor="floatingTextarea2">Amount</label>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-floating">
                                                <input className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} value={totalPlusInterest} disabled></input>
                                                <label htmlFor="floatingTextarea2">Total plus Interest</label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-floating">
                                        <input className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ "height": "100px" }} value={paymentDue} disabled></input>
                                        <label htmlFor="floatingTextarea2">Payment Due</label>
                                    </div>
                                </Col>
                            </Row>


                        </Container>
                    </Col>

                </Row>

            </Container>
        </>
    )
}
