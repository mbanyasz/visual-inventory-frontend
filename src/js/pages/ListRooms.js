import React from 'react';  
import axios from 'axios';
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import "../../css/pages/CommonTable.css"

const columns = [
    {
		Header: "Edit",
		accessor: 'id',
		filterable: false,
		width: 40,
		Cell: cell => <div className="center"><Link to={{ pathname: `/rooms/details/${cell.value}` }}>Edit</Link></div>
	},
	{
		Header: "Delete",
		accessor: 'id',
		filterable: false,
		width: 70,
		Cell: cell => <div className="center"><button onClick={() => confirmDelete(`${cell.value}`)}>Delete</button></div>
	},
	{
		Header: "name",
		accessor: 'name',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/rooms/details/${cell.original.id}` }}>{cell.value}</Link></div>,
	},
	{
		Header: "Building",
		accessor: 'building',
		filterable: true,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	},
	{
		Header: "Floor",
		accessor: 'floor',
		filterable: true,
		filterMethod: (filter, row) => row[filter.id] == filter.value,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	}];

function confirmDelete(id) {
	if(window.confirm("Are you sure you wish to delete this item?")) {
		axios.delete("http://192.168.1.5:8080/api/rooms/" + id);
		window.location.reload();
	}	
}

export default class ListRooms extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			data: []
		};  
	}
	
	componentDidMount() {
		fetch("http://192.168.1.5:8080/api/rooms")
				.then(res => res.json())
				.then(json => this.setState({ data: json }));
	}
	
	render() { 
		if(this.state.data.length === 0 ) {
			return (<div></div>)  
		} else {
			return (
				<div className="container">
					<div className="table">
						<ReactTableComponent  
							data = {this.state.data}
							columns = {columns}/> 
					</div>
				</div>			  
			)
		}
	}
}
