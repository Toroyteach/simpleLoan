import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';

const Sidebar = () => {

    const { user } = useStateContext()

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
                        <NavLink exact to="/dashboard" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/profile" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="chart-line">Profile</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/loans" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Loan</CDBSidebarMenuItem>
                        </NavLink>

                        {(user.role != 'admin') ? (
                            <>
                            </>
                        ) : (
                            <NavLink exact to="/users" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="table">Users</CDBSidebarMenuItem>
                            </NavLink>
                        )}

                        <NavLink exact to="/notifications" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="table">Notifications</CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;