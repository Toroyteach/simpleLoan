import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import Records from "./tblloanUtils/Records.jsx";
import Pagination from "./tblloanUtils/Pagination.jsx";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setNotification } = useStateContext()


  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    getLoans();
  }, [])

  // const onDeleteClick = loan => {
  //   if (!window.confirm("Are you sure you want to delete this Loan Application?")) {
  //     return
  //   }
  //   // axiosClient.delete(`/users/${loan.id}`)
  //   //   .then(() => {
  //   //     setNotification('User was successfully deleted')
  //   //     getUsers()
  //   //   })
  // }

  const getLoans = () => {
    setLoading(true)
    axiosClient.get('/loans')
      .then(({ data }) => {
        setLoading(false)
        setLoans(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = loans.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(loans.length / recordsPerPage)

  return (
    <div style={{ "height": "65vh" }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Loan Requests</h1>
      </div>
      <div className="card animated fadeInDown">
        {loading &&
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        }
        <Records data={currentRecords} getLoans={getLoans} />
        <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      </div>
    </div>
  )
}
