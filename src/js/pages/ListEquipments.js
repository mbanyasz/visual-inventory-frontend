import React from 'react';  
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import "../../css/pages/CommonTable.css"

import green from '../../png/green.png';
import red from '../../png/red.png';

const columns = [
    {
		Header: "Edit",
		accessor: 'id',
		filterable: false,
		width: 40,
		Cell: cell => <div className="center"><Link to={{pathname: `/equipments/details/${cell.value}`}}>Edit</Link></div>
	},
	{
		Header: "Name",
		accessor: 'name',
		filterable: true,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	},
	{
		Header: "Functional",
		accessor: 'functional',
		filterable: false,
		width: 90,
		Cell: cell => <div className="center">{cell.value ? <img className="image" src={green} alt="greenLogo" /> : <img src={red} alt="redLogo" />}</div>,
	},
	{
		Header: "Category",
		accessor: 'categoryName',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/categories/details/${cell.original.categoryId}` }}>{cell.value}</Link></div>,
	},
	{
		Header: "Room",
		accessor: 'roomName',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/rooms/details/${cell.original.roomId}` }}>{cell.value}</Link></div>,
	},
    {
		Header: "Building",
		accessor: 'roomBuilding',
		filterable: true,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	},
	{
		Header: "Floor",
		accessor: 'roomFloor',
		filterable: true,
		filterMethod: (filter, row) => row[filter.id] == filter.value,
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	}]

export default class ListEquipments extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			data: []
		};  
	}
	
	componentDidMount() {
		fetch("http://192.168.1.5:8080/api/equipments")
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
