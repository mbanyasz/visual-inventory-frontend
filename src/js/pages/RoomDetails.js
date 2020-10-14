import React from 'react';  
import axios from 'axios';
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import green from '../../png/green.png';
import red from '../../png/red.png';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

const columns = [
	{
		Header: "Edit",
		accessor: 'id',
		filterable: false,
		width: 40,
		Cell: cell => <div className="center"><Link to={{ pathname: `/equipments/details/${cell.value}` }}>Edit</Link></div>
	},
	{
		Header: "Delete",
		accessor: 'id',
		filterable: false,
		width: 70,
		Cell: cell => <div className="center"><button onClick={() => confirmDelete(`${cell.value}`)}>Delete</button></div>
	},
	{
		Header: "Name",
		accessor: 'name',
		filterable: true,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	},
	{
		Header: "Category",
		accessor: 'categoryName',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/categories/details/${cell.original.categoryId}` }}>{cell.value}</Link></div>,
	},
	{
		Header: "Functional",
		accessor: 'functional',
		filterable: false,
		width: 90,
		Cell: cell => <div className="center">{cell.value ? <img className="image" src={green} alt="greenLogo" /> : <img src={red} alt="redLogo" />}</div>,
	}];

function confirmDelete(id) {
	if(window.confirm("Are you sure you wish to delete this item?")) {
		axios.delete("http://192.168.1.5:8080/api/equipments/" + id);
		window.location.reload();
	}	
}

export default class RoomDetails extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			room: {
				name: '',
				building: '',
				floor: '',
				equipments: []
			}
        }; 
        
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.confirmDeleteRoom = this.confirmDeleteRoom.bind(this);
	}
	
    handleChange(event) {       
        this.setState({
            room : {							
				...this.state.room,
				[event.target.name]: event.target.value
			}
		});
	}
	
	componentDidMount() {
		fetch("http://192.168.1.5:8080/api/rooms/" + this.props.match.params.id)
			.then(res => res.json())
            .then(json => this.setState({ room: json }));
	}
    
    async handleSubmit(event) {
        event.preventDefault();

        var room = {
            name: this.state.room.name,
            building: this.state.room.building,
            floor: this.state.room.floor
        }

        await axios.put("http://192.168.1.5:8080/api/rooms/" + this.state.room.id, room);

        this.props.history.push({
            pathname: '/rooms',
        })
	}
	
	async confirmDeleteRoom(id, equipments) {
		if(equipments && equipments.length > 0) {
			window.alert("You can't delete this room until it has equipments associated with it")
		} else {
			if(window.confirm("Are you sure you wish to delete this room?")) {
				await axios.delete("http://192.168.1.5:8080/api/rooms/" + id);
				this.props.history.push({
					pathname: '/rooms',
				})
			}
		}	
	}
	
	render() {
		var tableDiv = (<div></div>);
		var editDiv = (
			<div>
				<div className="header">Edit room</div>
				<div className="form">
					<form onSubmit={this.handleSubmit}>
						<span className="row">
							<label htmlFor="name">Name</label>
							<input type="text" id="name" value={this.state.room.name} 
								onChange={this.handleChange} name="name" required></input>                            
						</span>
						<span className="row">
							<label htmlFor="building">Building</label>
							<input type="text" id="building" value={this.state.room.building} 
								onChange={this.handleChange} name="building" required></input>                            
						</span>
						<span className="row">
							<label htmlFor="floor">Floor</label>
							<input type="number" id="floor" value={this.state.room.floor} 
								onChange={this.handleChange} name="floor" required></input>                            
						</span>
						<span className="row">
							<button className="deleteButton" type="button" onClick={() => this.confirmDeleteRoom(this.state.room.id, this.state.room.equipments)}>
								Delete
							</button>
							<button className="confirmButton" type="submit">Edit</button>                       
						</span>
					</form>
				</div>
			</div>)
		if(this.state.room.equipments.length !== 0 ) {
			tableDiv = (
				<div className="table">
					<ReactTableComponent  
						data = {this.state.room.equipments}
						columns = {columns}/> 
				</div>)	
		}
		return (
			<div className="container">{[editDiv, tableDiv]}</div>
		);	       	
	}
}
