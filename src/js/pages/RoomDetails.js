import React from 'react';  
import axios from 'axios';
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

import move from '../../images/move.png';
import deleteLogo from '../../images/delete.png';

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

const columns = [
	{
		Header: "",
		accessor: 'id',
		filterable: false,
		width: 30,
		Cell: cell => <div className="center"><Link to={{ pathname: `/items/move`, myProps: cell.original }}><img className="image" src={move} alt="moveLogo"/></Link></div>
	},
	{
		Header: "",
		accessor: 'id',
		filterable: false,
		width: 30,
		Cell: cell => <div className="center"><Link to={{ pathname: `/items/delete`, myProps: cell.original }}><img className="image" src={deleteLogo} alt="deleteLogo"/></Link></div>
	},
    {
		Header: "#",
		accessor: 'numberOfItems',
		filterable: false,		
		width: 80,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	},
	{
		Header: "Equipment",
		accessor: 'equipment.name',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/equipments/details/${cell.original.equipment.id}` }}>{cell.value}</Link></div>,
	},
	{
		Header: "Category",
		accessor: 'equipment.category.name',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/categories/details/${cell.original.equipment.category.id}` }}>{cell.value}</Link></div>,
	}
];

export default class RoomDetails extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			room: {
				name: '',
				building: '',
				floor: '',
				items: []
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
		fetch(BACKEND_SERVER_URL + "rooms/" + this.props.match.params.id)
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

        await axios.put(BACKEND_SERVER_URL + "rooms/" + this.state.room.id, room);

        this.props.history.push({
            pathname: '/rooms',
        })
	}
	
	async confirmDeleteRoom(id, items) {
		if(items && items.length > 0) {
			window.alert("You can't delete this room until it has items associated with it")
		} else {
			if(window.confirm("Are you sure you wish to delete this room?")) {
				await axios.delete(BACKEND_SERVER_URL + "rooms/" + id);
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
							<button className="deleteButton" type="button" onClick={() => this.confirmDeleteRoom(this.state.room.id, this.state.room.items)}>
								Delete
							</button>
							<button className="confirmButton" type="submit">Edit</button>                       
						</span>
					</form>
				</div>
			</div>)
		if(this.state.room.items.length !== 0 ) {
			tableDiv = (
				<div className="table">
					<ReactTableComponent  
						data = {this.state.room.items}
						columns = {columns}/> 
				</div>)	
		}
		return (
			<div className="container">{[editDiv, tableDiv]}</div>
		);	       	
	}
}
