import React from 'react';  
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import "../../css/pages/CommonTable.css"

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
    },
    {
		Header: "Room",
		accessor: 'room.name',
		filterable: true,
		Cell: cell => <div className="center"><Link to={{ pathname: `/rooms/details/${cell.original.room.id}` }}>{cell.value}</Link></div>,
    },
    {
		Header: "Building",
		accessor: 'room.building',
		filterable: true,
		Cell: cell => <div className="center">{cell.value}</div>,
    },
    {
		Header: "Floor",
		accessor: 'room.floor',
		filterable: true,
		filterMethod: (filter, row) => row[filter.id] === parseInt(filter.value),
		Cell: cell => <div className="center">{cell.value}</div>,
    }
];

export default class ListItems extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			data: []
		};  
	}
	
	componentDidMount() {
		fetch(BACKEND_SERVER_URL + "items")
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
