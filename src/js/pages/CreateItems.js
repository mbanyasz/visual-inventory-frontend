import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export default class CreateItems extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            rooms: [],
            equipments: [],
            name: '',
            numberOfItems: 1,
            roomId: '',
            equipmentId: ''
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
		await fetch(BACKEND_SERVER_URL + "rooms")
			.then(res => res.json())
            .then(json => this.setState({ rooms: json }));
        await fetch(BACKEND_SERVER_URL + "equipments")
			.then(res => res.json())
            .then(json => this.setState({ equipments: json }));
                              
        this.state.roomId = this.state.rooms[0].id;                  
        this.state.equipmentId = this.state.equipments[0].id;
	}

    handleChange(event) {    
        this.setState({            							
            [event.target.name]: event.target.value
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.numberOfItems == 0) {
            window.alert("Creating 0 items doesn't make much sense, sorry!")
        } else if (this.state.numberOfItems < 0) {
            window.alert("If you want to add less than 0 item, try deleting items instead!")
        } else if (this.state.numberOfItems > 64) {
            window.alert("Please don't create more than 64 items at once, this app runs from my 5 year old laptop");
        } else {
            var item = {
                roomId: this.state.roomId,
                equipmentId: this.state.equipmentId,
                numberOfItems: this.state.numberOfItems
            }

            await axios.post(BACKEND_SERVER_URL + "items/create", item);

            this.props.history.push({
                pathname: '/items',
            })
        }
    }

    createSelectRooms() {
        var rooms = [];        
        this.state.rooms.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.state.rooms.forEach(function(element) {
            rooms.push(<option value={element.id}>{element.name}</option>)
        })
        return rooms;
    }

    createSelectEquipments() {
        var equipments = [];        
        this.state.equipments.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.state.equipments.forEach(function(element) {
            equipments.push(<option value={element.id}>{element.name}</option>)
        })
        return equipments;
    }
	
	render() { 
        return (
            <div className="container">
                <div className="header">Create new items</div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <span className="row">
                            <label htmlFor="roomId">Room</label>
                            <select id="roomId" value={this.state.roomId} 
                                onChange={this.handleChange} name="roomId" required>
                                    {this.createSelectRooms()}                                    
                            </select>                            
                        </span>
                        <span className="row">
                            <label htmlFor="equipments">Equipment</label>
                            <select id="equipmentId" value={this.state.equipmentId} 
                                onChange={this.handleChange} name="equipmentId" required>
                                    {this.createSelectEquipments()}
                            </select>
                        </span>
                        <span className="row">
                            <label htmlFor="numberOfItems">#Number</label>
                            <input type="number" id="numberOfItems" value={this.state.numberOfItems} 
                                onChange={this.handleChange} name="numberOfItems" required>                                   
                            </input>                            
                        </span>
                        <span className="row">
                            <button className="confirmButton" type="submit">Submit</button>                     
                        </span>
                    </form>
                </div>
            </div>			  
        );		
	}
}
