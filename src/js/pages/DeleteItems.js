import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export default class DeleteItems extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            numberOfItems: 1,
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

    handleChange(event) {    
        this.setState({            							
            [event.target.name]: event.target.value
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.numberOfItems === 0) {
            window.alert("Deleting 0 items doesn't make much sense, sorry!")
        } else if (this.state.numberOfItems < 0) {
            window.alert("If you want to delete less than 0 item, try adding items instead!")
        } else if (this.state.numberOfItems > this.state.params.numberOfItems) {
            var verb = this.state.params.numberOfItems > 1 ? "are" : "is";             
            var items = this.state.params.numberOfItems > 1 ? " items" : " item"; 
            window.alert("There " + verb + " only " + this.state.params.numberOfItems + items + ", you can't delete more than that!")
        } else {
            var item = {
                roomId: this.state.params.room.id,
                equipmentId: this.state.params.equipment.id,
                numberOfItems: this.state.numberOfItems
            }

            await axios.post(BACKEND_SERVER_URL + "items/delete", item);

            this.props.history.push({
                pathname: '/items',
            })
        }
    }
	
	render() { 
        if(this.state.params === undefined) {
            return (<div></div>);
        }
        else {
            return (
                <div className="container">
                    <div className="header">Delete items</div>
                    <div className="itemSelection">
                    <span className="row">
                            <label htmlFor="room">Room</label>      
                            <input type="text" id="room" value={this.state.params.room.name}
                                    name="room" disabled></input>                   
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
