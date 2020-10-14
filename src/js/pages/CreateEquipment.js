import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

export default class CreateEquipment extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            rooms: [],
            categories: [],
            name: '',
            numberOfEquipment: 1,
            roomId: '',
            categoryId: ''
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
		await fetch("http://192.168.1.5:8080/api/rooms")
			.then(res => res.json())
            .then(json => this.setState({ rooms: json }));
        await fetch("http://192.168.1.5:8080/api/categories")
			.then(res => res.json())
            .then(json => this.setState({ categories: json }));
                              
        this.state.roomId = this.state.rooms[0].id;                  
        this.state.categoryId = this.state.categories[0].id;
	}

    handleChange(event) {    
        this.setState({            							
            [event.target.name]: event.target.value
        });
    }
    
    async handleSubmit(event) {
        event.preventDefault();

        var equipment = {
            name: this.state.name,
            roomId: this.state.roomId,
            categoryId: this.state.categoryId,
            numberOfEquipment: this.state.numberOfEquipment
        }

        await axios.post("http://192.168.1.5:8080/api/equipments/", equipment);

        this.props.history.push({
            pathname: '/equipments',
        })
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
                <div className="header">Create a new equipment</div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <span className="row">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" value={this.state.name} 
                                onChange={this.handleChange} name="name" required>
                            </input>                            
                        </span>
                        <span className="row">
                            <label htmlFor="roomId">Room</label>
                            <select id="roomId" value={this.state.roomId} 
                                onChange={this.handleChange} name="roomId" required>
                                    {this.createSelectRooms()}                                    
                            </select>                            
                        </span>
                        <span className="row">
                            <label htmlFor="category">Category</label>
                            <select id="categoryId" value={this.state.categoryId} 
                                onChange={this.handleChange} name="categoryId" required>
                                    {this.createSelectCategories()}
                            </select>
                        </span>
                        <span className="row">
                            <label htmlFor="catenumberOfEquipmentgory">#Number</label>
                            <input type="number" id="numberOfEquipment" value={this.state.numberOfEquipment} 
                                onChange={this.handleChange} name="numberOfEquipment" required>                                   
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
