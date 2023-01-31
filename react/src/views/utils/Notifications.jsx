import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, setNotification, setAppNotification } = useStateContext()

    useEffect(() => {
        getNotifications();
    }, [])

    const getNotifications = () => {
        setLoading(true)
        axiosClient.get(`/getNotification/${user.id}`)
            .then(({ data }) => {
                setLoading(false)
                setNotifications(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const onMarkReadClick = en => {

        const data = {
            id: en
        }

        axiosClient.put(`/makeAsRead/${user.id}`, data)
            .then(() => {
                getNotification()
                setNotification('User Notification marked as read')
                getNotifications()
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

    return (
        <>
            <div>Notifications</div>

            <Container style={{ "height": "60vh", "overflow": "auto" }}>

                {notifications.map(u => (


                    <div className="card border-info mb-3" style={{ "max-width": "18rem;" }}>
                        <div className="card-header">{u.data.message_name}</div>
                        <div className="card-body text-dark">
                            <h5 className="card-title">{u.data.notification_type}</h5>
                            <p className="card-text">{u.data.message_desc}.</p>
                        </div>

                        {/* {(user.role != 'admin') ? (
                            <>
                            </>
                        ) : (
                            <Link className="btn-edit" to={'/loans/' + u.id}>View</Link>
                        )} */}


                        {u.read_at != null ? (
                            <></>
                        ) : (
                            <button onClick={ev => onMarkReadClick(u.id)}> Marks as Read</button>
                        )}

                    </div>


                ))}


            </Container>
        </>
    )
}
