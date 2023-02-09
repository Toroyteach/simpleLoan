import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';
import { useEffect } from 'react';
import axiosClient from '../../axios-client';

const Sidebar = () => {

    const { user, setUser, setToken, appNotificationsCount, setAppNotification } = useStateContext()

    const navigate = useNavigate();

    const getNotification = () => {
        axiosClient.get('/getNotifications')
            .then(({ data }) => {

                setAppNotification(data)
            })
            .catch(() => {

            })
    }

    const onLogout = () => {

        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    useEffect(() => {

        getNotification();

    }, [])

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        My Loan System
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact="true" to="/dashboard" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact="true" to="/profile" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="chart-line">Profile</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact="true" to="/loans" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="credit-card">Loan</CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink exact="true" to="/loans/create" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="credit-card">Request Loan</CDBSidebarMenuItem>
                        </NavLink>

                        {(user.role != 'admin') ? (
                            <>
                            </>
                        ) : (
                            <NavLink exact="true" to="/users" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="user">Users</CDBSidebarMenuItem>
                            </NavLink>
                        )}

                        {(user.role != 'admin') ? (
                            <>
                            </>
                        ) : (
                            <NavLink exact="true" to="/reports" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="table" >Reports</CDBSidebarMenuItem>
                            </NavLink>
                        )}


                        {(appNotificationsCount <= 0) ? (
                            <NavLink exact="true" to="/notifications" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="bell">Notifications</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (

                            <NavLink exact="true" to="/notifications" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="bell">
                                    Notifications
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {appNotificationsCount}
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </CDBSidebarMenuItem>
                            </NavLink>
                        )}

                        <CDBSidebarMenuItem icon="bell" onClick={onLogout}>Logout</CDBSidebarMenuItem>

                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;