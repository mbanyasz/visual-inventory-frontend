import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export default class MoveItems extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            rooms: [],
            numberOfItems: 1,
            roomId: '',
            params: props.location.myProps
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        if(this.state.params === undefined) {
            this.props.history.push({
                pathname: '/items',
            })
        }
    }

    async componentDidMount() {
        if(this.state.params !== undefined) {
            await fetch(BACKEND_SERVER_URL + "rooms")
                .then(res => res.json())
                .then(json => this.setState({ rooms: json }));
                                
            this.state.roomId = this.state.rooms[0].id;
        }
	}

    handleChange(event) {    
        this.setState({            							
            [event.target.name]: event.target.value
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.numberOfItems < 1) {
            window.alert("Moving less than 1 item doesn't make much sense, sorry!")
        } else if (this.state.numberOfItems > this.state.params.numberOfItems) {
            var verb = this.state.params.numberOfItems > 1 ? "are" : "is";             
            var items = this.state.params.numberOfItems > 1 ? " items" : " item"; 
            window.alert("There " + verb + " only " + this.state.params.numberOfItems + items + ", you can't move more than that!")
        } else {
            var item = {
                fromRoomId: this.state.params.room.id,
                toRoomId: this.state.roomId,
                equipmentId: this.state.params.equipment.id,
                numberOfItems: this.state.numberOfItems
            }
    
            await axios.post(BACKEND_SERVER_URL + "items/move", item);
    
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

	render() {
        if(this.state.params === undefined) {
            return (<div></div>);
        }
        else {
            return (
                <div className="container">
                    <div className="header">Move items</div>
                    <div className="itemSelection">
                    <span className="row">
                            <label htmlFor="fromRoom">From</label>      
                            <input type="text" id="fromRoom" value={this.state.params.room.name}
                                    name="fromRoom" disabled></input>                   
                        </span>
                        <span className="row">
                            <label htmlFor="equipment">Equipment</label>      
                            <input type="text" id="equipment" value={this.state.params.equipment.name}
                                    name="equipment" disabled></input>                   
                        </span>
                        <span className="row">
                            <label htmlFor="numberOfAvailableItems">#Available</label>      
                            <input type="number" id="numberOfAvailableItems" value={this.state.params.numberOfItems}
                                    name="numberOfAvailableItems" disabled></input>                   
                        </span>
                    </div>
                    <div className="form">                
                        <form onSubmit={this.handleSubmit}>        
                            <span className="row">
                                <label htmlFor="roomId">To</label>
                                <select id="roomId" value={this.state.roomId} 
                                    onChange={this.handleChange} name="roomId" required>
                                        {this.createSelectRooms()}                                    
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
}
