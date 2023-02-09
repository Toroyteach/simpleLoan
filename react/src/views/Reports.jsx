import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

export default function Reports() {

  const [loading, setLoading] = useState(false);
  const { user, setNotification } = useStateContext()
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);

  const doc = new jsPDF()

  const onUsersExportClick = () => {

    setLoading(true)

    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false)

        if (data.data.length > 0) {

          const userArray = data.data
          const pdfData = []

          userArray.forEach((item, index) => {

            pdfData.push([index + 1, item.firstname, item.lastname, item.number, item.email])

          })

          doc.autoTable({
            body: [
              [{ content: 'Users List', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
            ],
          })
          doc.autoTable({
            head: [['Id', 'Firstname', 'Lastname', 'Number', 'Email']],
            body: pdfData,
          })
          doc.save('Users.pdf')

        } else {

          setNotification("No data to generate Report")

        }

      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onLoanExportClick = () => {
    setLoading(true)

    axiosClient.get('/loans')
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
              [{ content: 'Loan Applications List', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
            ],
          })
          doc.autoTable({
            styles: { fontSize: 8 },
            head: [['Id', 'User', 'Amount-Requested', 'Created', 'Approved', 'Status', 'Mpesa-Statement', 'Balance', 'Payment-Due']],
            body: pdfData,
          })
          doc.save('Loans.pdf')

        } else {

          setNotification("No data to generate Report")

        }

      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onApprovedLoanExportClick = () => {
    setLoading(true)

    axiosClient.get('/approvedLoans')
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
              [{ content: 'Approved Loan Applications List', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
            ],
          })
          doc.autoTable({
            styles: { fontSize: 8 },
            head: [['Id', 'User', 'Amount-Requested', 'Created', 'Approved', 'Status', 'Mpesa-Statement', 'Balance', 'Payment-Due']],
            body: pdfData,
          })
          doc.save('ApprovedLoan.pdf')

        } else {

          setNotification("No data to generate Report")

        }

      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onPendingExportClick = () => {

    setLoading(true)

    axiosClient.get('/pendingLoans')
      .then(({ data }) => {
        setLoading(false)

        if (data.data.length > 0) {

          const loanArray = data.data
          const pdfData = []

          loanArray.forEach((item, index) => {

            pdfData.push([index + 1, item.user_id, item.loan_amount, item.created_at, item.approved_date, item.status_id, item.loan_amount_plus_interest])

          })

          doc.autoTable({
            body: [
              [{ content: 'Approved Loan Applications List', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
            ],
          })
          doc.autoTable({
            styles: { fontSize: 8 },
            head: [['Id', 'User', 'Amount-Requested', 'Created', 'Approved', 'Status', 'Amount plus Interest']],
            body: pdfData,
          })
          doc.save('PendingLoan.pdf')

        } else {

          setNotification("No data to generate Report")

        }


      })
      .catch(() => {
        setLoading(false)
      })

  }


  if (user.role === 'user') {
    navigate('/dashboard')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Reports</h1>

        {loading &&
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        }


        <Container>

          <Row>
            <Col>
              <Card>
                <Row>
                  <Col>
                    <Button variant="outline-secondary" onClick={onUsersExportClick}>Users</Button>{' '}
                  </Col>
                  <Col>
                    <Button variant="outline-secondary" onClick={onLoanExportClick}>Loans</Button>{' '}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Row>
                  <Col>
                    <Button variant="outline-secondary" onClick={onApprovedLoanExportClick}>Approved Loans</Button>{' '}
                  </Col>
                  <Col>
                    <Button variant="outline-secondary" onClick={onPendingExportClick}>Pending Loans</Button>{' '}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>

      </div>
    </div>
  )
}
