import React from 'react'
import { Link } from "react-router-dom";
import { useStateContext } from '../../../context/ContextProvider';
import axiosClient from '../../../axios-client';

const Records = ({ data, getUsers }) => {

    const { setNotification } = useStateContext()

    const onDisableClick = user => {

        if (!window.confirm("Are you sure you want to Change login status for this user?")) {
            return
        }

        axiosClient.put(`/disableUser/${user.id}`)
            .then(() => {
                getUsers()
                setNotification('User Login status was successfully Changed')
            })
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Create Date</th>
                    <th>Actions</th>
                </tr>
            </thead>



            {data.length > 0 ? (

                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.created_at}</td>
                            <td>
                                <Link className="btn-edit" to={'/users/' + item.id}>Edit</Link>
                                &nbsp;

                                {item.status ? (
                                    <button className="btn-disable" onClick={ev => onDisableClick(item)}>Disable</button>
                                ) : (
                                    <button className="btn-enable" onClick={ev => onDisableClick(item)}>Enable</button>
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