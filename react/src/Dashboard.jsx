import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CDBBox, CDBContainer } from 'cdbreact';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import axiosClient from './axios-client';
import { useStateContext } from './context/ContextProvider';

const Dashboard = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [graphData, setGraphData] = useState(null)
  const [usersCount, setUsersCount] = useState(null)
  const [loaned, setLoaned] = useState(null)
  const [paidBack, setPaidBack] = useState(null)
  const { user } = useStateContext()


  const data = {
    labels,
    datasets: [
      {
        label: 'Loaned Out',
        data: graphData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      // {
      //   label: 'Paid Back',
      //   data: labels.map(() => Math.floor(Math.random() * 1000) + 1),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      //   yAxisID: 'y1',
      // },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Amount Loaned vs Paid against Time',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  useEffect(() => {
    getDashBoard();
  }, [])

  const getDashBoard = () => {

    axiosClient.get('/adminDashboard')
      .then(({ data }) => {

        setGraphData(data.graphData)
        setUsersCount(data.usersCount)
        setLoaned(data.amountLoaned)
        setPaidBack(data.amountPaidBack)

      })
      .catch(() => {
      })
  }

  return (
    <Container style={{ "height": "75vh", "overflow": "auto" }}>
      <Row>

        <Col>
          <div className="card text-white bg-secondary mb-3">
            <div className="card-header">Users</div>
            <div className="card-body">

              {(user.role != 'admin') ? (
                <h2 className="card-title"></h2>
              ) : (
                <h2 className="card-title">{usersCount}</h2>
              )}
            </div>
          </div>
        </Col>

        <Col>
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Amount Loaned</div>
            <div className="card-body">
              <h2 className="card-title">KSH {loaned}</h2>
            </div>
          </div>
        </Col>

        <Col>
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Amount Paid back</div>
            <div className="card-body">
              <h2 className="card-title">Ksh {paidBack}</h2>
            </div>
          </div>
        </Col>

      </Row>

      <br />

      <br />

      <Container>

        <Row>

          <Col>
            <Line options={options} data={data} />
          </Col>

        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;