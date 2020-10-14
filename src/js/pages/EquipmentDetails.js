import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

export default class EquipmentDetails extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            rooms: [],
            categories: [],
            equipment: {}
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.confirmDeleteEquipment = this.confirmDeleteEquipment.bind(this);  
    }

    componentDidMount() {
        fetch("http://192.168.1.5:8080/api/equipments/" + this.props.match.params.id)
            .then(res => res.json())
            .then(json => this.setState({ equipment: json }));
		fetch("http://192.168.1.5:8080/api/rooms")
			.then(res => res.json())
            .then(json => this.setState({ rooms: json }));
        fetch("http://192.168.1.5:8080/api/categories")
			.then(res => res.json())
            .then(json => this.setState({ categories: json }));
	}

    handleChange(event) {        
        this.setState({            							
			equipment : {							
				...this.state.equipment,
				[event.target.name]: event.target.value
			}
        });
    }

    handleCheckboxChange(event) { 
        this.setState({            							
			equipment : {							
				...this.state.equipment,
				functional: !this.state.equipment.functional
			}
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        var equipment = {
            name: this.state.equipment.name,
            roomId: this.state.equipment.roomId,
            categoryId: this.state.equipment.categoryId,
            functional: this.state.equipment.functional
        }

        await axios.put("http://192.168.1.5:8080/api/equipments/" + this.state.equipment.id, equipment);

        this.props.history.push({
            pathname: '/equipments',
        })
    }

    async confirmDeleteEquipment(id) {
        if(window.confirm("Are you sure you wish to delete this equipment?")) {
            await axios.delete("http://192.168.1.5:8080/api/equipments/" + id);
            this.props.history.push({
                pathname: '/equipments',
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

    createSelectCategories() {
        var categories = [];        
        this.state.categories.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.state.categories.forEach(function(element) {
            categories.push(<option value={element.id}>{element.name}</option>)
        })
        return categories;
    }
	
	render() {
        return (
            <div className="container">
                <div className="header">Edit equipment</div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <span className="row">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" value={this.state.equipment.name} 
                                onChange={this.handleChange} name="name" required>
                            </input>                            
                        </span>
                        <span className="row">
                            <label htmlFor="roomId">Room</label>
                            <select id="roomId" value={this.state.equipment.roomId} 
                                onChange={this.handleChange} name="roomId" required>
                                    {this.createSelectRooms()}                                    
                            </select>                            
                        </span>
                        <span className="row">
                            <label htmlFor="category">Category</label>
                            <select id="categoryId" value={this.state.equipment.categoryId} 
                                onChange={this.handleChange} name="categoryId" required>
                                    {this.createSelectCategories()}
                            </select>
                        </span>
                        <span className="row">
                            <label htmlFor="functional">Functional</label>
                            <input type="checkbox" id="functional" defaultChecked={this.state.equipment.functional}
                                 onClick={this.handleCheckboxChange} name="functional"/>  
                        </span>
                        <span className="row">
                            <button className="deleteButton" type="button" onClick={() => this.confirmDeleteEquipment(this.state.equipment.id)}>
								Delete
							</button>
                            <button className="confirmButton" type="submit">Submit</button>                     
                        </span>
                    </form>
                </div>
            </div>			  
        );		
	}
}
