import React from 'react'; 
import ReactTableComponent from '../components/ReactTableComponent';
import { Link } from "react-router-dom";

import "../../css/pages/CommonTable.css"

import edit from '../../images/edit.png';

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

const columns = [
    {
		Header: "",
		accessor: 'id',
		filterable: false,
		width: 40,
		Cell: cell => <div className="center"><Link to={{ pathname: `/rooms/details/${cell.value}` }}><img className="image" src={edit} alt="editLogo"/></Link></div>
	},
	{
		Header: "Room",
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
		filterMethod: (filter, row) => row[filter.id] === parseInt(filter.value),
		Cell: cell => <div className="center"><span>{cell.value}</span></div>,
	}];

export default class ListRooms extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			data: []
		};  
	}
	
	componentDidMount() {
		fetch(BACKEND_SERVER_URL + "rooms")
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
