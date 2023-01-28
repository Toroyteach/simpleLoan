import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, setNotification } = useStateContext()

    useEffect(() => {
        getNotifications();
    }, [])

    const getNotifications = () => {
        setLoading(true)
        axiosClient.get(`/getNotification/${user.id}`)
            .then(({ data }) => {
                setLoading(false)
                setNotifications(data)
                console.log(data)
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
                setNotification('User Notification marked as read')
                getNotifications()
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
                            <p className="card-text">{u.data.message_desc} Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>


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
