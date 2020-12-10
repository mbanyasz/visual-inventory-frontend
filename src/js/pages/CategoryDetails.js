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

function b64toBlob(b64Data, sliceSize=512) {
		const contentType = 'image/png';
		const byteCharacters = atob(b64Data);
		const byteArrays = [];
	  
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		  const slice = byteCharacters.slice(offset, offset + sliceSize);	  
		  const byteNumbers = new Array(slice.length);
		  for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		  }	  
		  const byteArray = new Uint8Array(byteNumbers);
		  byteArrays.push(byteArray);
		}
	  
		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
}

export default class CreateCategory extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			imageWasChanged: false,
			category : {
				name: '',
				image: null,
				imageBytes: null,
				items: []
			}
        };
		   
        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);  		
		this.confirmDeleteCategory = this.confirmDeleteCategory.bind(this);  		
    }

    handleChange(event) {       
        this.setState({
			...this.state,
			category : {
				...this.state.category,
				[event.target.name]: event.target.value
			}
        });
	}
		
	async componentDidMount() {
		await fetch(BACKEND_SERVER_URL + "categories/" + this.props.match.params.id)
			.then(res => res.json())
			.then(json => this.setState({ category: json }));
		this.setState({
			category : {
				...this.state.category,
				image: URL.createObjectURL(b64toBlob(this.state.category.imageBytes))
			}
		});
	}

    onImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
				imageWasChanged: true,
				category : {
					...this.state.category,
					image: URL.createObjectURL(img),
                	imageBytes: img
				}
			});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

		let formData = new FormData();		
		if(this.state.imageWasChanged) {
			formData.append("file", this.state.category.imageBytes);
		} else {
			let image = await fetch(this.state.category.image)
				.then(image => image.blob());
			formData.append("file", image);
		}

		formData.append('data', new Blob([JSON.stringify({"name": this.state.category.name})],
		 	{ type: "application/json" }));

        await axios.put(BACKEND_SERVER_URL + "categories/" + this.state.category.id, formData);

		this.props.history.push({
            pathname: '/categories',
        })
	}
	
	async confirmDeleteCategory(id, equipments) {
		if(equipments && equipments.length > 0) {
			window.alert("You can't delete this category until it has equipments associated with it")
		} else {
			if(window.confirm("Are you sure you wish to delete this category?")) {
				await axios.delete(BACKEND_SERVER_URL + "categories/" + id);
				this.props.history.push({
					pathname: '/categories',
				})
			}
		}	
	}
	
	render() { 
        var imageStyle = {
            width: "300px",
            height: "400px"
		};
	
		var tableDiv = (<div></div>);
		var editDiv = (
			<div className="container">
				<div className="header">Edit category</div>
				<div className="form">
					<form onSubmit={this.handleSubmit}>
						<span className="row">
							<label htmlFor="name">Name*</label>
							<input type="text" id="name" value={this.state.category.name} 
								onChange={this.handleChange} name="name" required></input>                            
						</span>
						<span className="row">
							<label htmlFor="myImage">Picture</label>
							<input type="file" accept="image/*"
								onChange={this.onImageChange} name="image"/>                                        
						</span>
						<span className="row">
							<img src={this.state.category.image} style={this.state.category.image == null ? null : imageStyle} alt=""/>                    
						</span>                     
						<span className="row">
							<button className="deleteButton" type="button" onClick={() => this.confirmDeleteCategory(this.state.category.id, this.state.category.equipments)}>
								Delete
							</button>
							<button className="confirmButton" type="submit">Edit</button>                     
						</span>
					</form>
				</div>
			</div>)
		if(this.state.category.items.length !== 0 ) {
			tableDiv = (
				<div className="table">
					<ReactTableComponent  
						data = {this.state.category.items}
						columns = {columns}/> 
				</div>)	
		}
		return (<div className="container">{[editDiv, tableDiv]}</div>);	
	}
}
