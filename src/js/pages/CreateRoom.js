import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

export default class CreateRoom extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            name: '',
            building: '',
            floor: ''
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {       
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        var room = {
            name: this.state.name,
            building: this.state.building,
            floor: this.state.floor
        }

        await axios.post("http://192.168.1.5:8080/api/rooms/", room);

        this.props.history.push({
            pathname: '/rooms',
        })
    }
	
	render() { 
        return (
            <div className="container">
                <div className="header">Create a new room</div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <span className="row">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" value={this.state.name} 
                                onChange={this.handleChange} name="name" required></input>                            
                        </span>
                        <span className="row">
                            <label htmlFor="building">Building</label>
                            <input type="text" id="building" value={this.state.building} 
                                onChange={this.handleChange} name="building" required></input>                            
                        </span>
                        <span className="row">
                            <label htmlFor="floor">Floor</label>
                            <input type="number" id="floor" value={this.state.floor} 
                                onChange={this.handleChange} name="floor" required></input>                            
                        </span>
                        <span className="row">
                            <button type="submit" className="confirmButton">Submit</button>                     
                        </span>
                    </form>
                </div>
            </div>			  
        );		
	}
}
