import React from "react";
import { Link } from "react-router-dom";

import '../css/Navigation.css';

export default class Navigation extends React.Component {

    render() {
        return (
            <div>
                <div className="navbar">
                    <div className="dropdown">
                        <button className="dropbtn">Rooms</button>
                        <div className="dropdown-content">
                            <Link to="/rooms">List Rooms</Link>
                            <Link to="/rooms/create">Create Room</Link>
                        </div>
                    </div>      
                    <div className="dropdown">
                        <button className="dropbtn">Categories</button>
                        <div className="dropdown-content">
                            <Link to="/categories">List Categories</Link>
                            <Link to="/categories/create">Create Category</Link>
                        </div>
                    </div>      
                    <div className="dropdown">
                        <button className="dropbtn">Equipment</button>
                        <div className="dropdown-content">
                            <Link to="/equipments">List Equipments</Link>
                            <Link to="/equipments/create">Create Equipment</Link>
                        </div>
                    </div> 
                </div>
            </div>            
        );
    }
}