import React from 'react'
import { Link } from "react-router-dom";
import { useStateContext } from '../../../context/ContextProvider';
import axiosClient from '../../../axios-client';

const Records = ({ data, getLoans }) => {

    const { user, setNotification } = useStateContext()

    const onDeleteClick = loan => {
        if (!window.confirm("Are you sure you want to delete this Loan Application?")) {
            return
        }
        axiosClient.delete(`/loans/${loan.id}`)
            .then(() => {
                getLoans()
                setNotification('Loan Application was successfully deleted')
            })
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Create Date</th>
                    <th>Actions</th>
                </tr>
            </thead>

            {data.length > 0 ? (

                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.user_id}</td>
                            <td>{item.loan_amount}</td>
                            <td>{item.status_id}</td>
                            <td>{item.created_at}</td>
                            <td>
                                <Link className="btn-edit" to={'/loans/' + item.id}>View</Link>
                                &nbsp;
                                {(user.role != 'admin') ? (
                                    <></>
                                ) : (
                                    <button className="btn-delete" onClick={ev => onDeleteClick(item)}>Delete</button>
                                )}

                            </td>
                        </tr>
                    ))}
                </tbody>

            ) : (
                <div className="alert alert-warning" role="alert">
                    There are no Loans at the moment.
                </div>
            )}


        </table>
    )
}

export default Records 