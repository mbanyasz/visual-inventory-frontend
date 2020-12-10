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

export default class EquipmentDetails extends React.Component {

    constructor(props) {
        super(props);
		this.state = {            
			imageWasChanged: false,
            categories: [],
            equipment: {
				name: '',
				image: null,
                imageBytes: null,
                category : {},
				items: []
			}
        }; 
        
        this.handleChange = this.handleChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.confirmDeleteEquipment = this.confirmDeleteEquipment.bind(this);  
    }

    async componentDidMount() {
		await fetch(BACKEND_SERVER_URL + "equipments/" + this.props.match.params.id)
            .then(res => res.json())
            .then(json => this.setState({ equipment: json }));
        await fetch(BACKEND_SERVER_URL + "categories")
            .then(res => res.json())
            .then(json => this.setState({ categories: json }));
		this.setState({
			equipment : {
				...this.state.equipment,
				image: URL.createObjectURL(b64toBlob(this.state.equipment.imageBytes))
			}
		});
	}

    handleChange(event) {        
        this.setState({            							
			equipment : {							
                ...this.state.equipment,
                [event.target.name]: event.target.value				
			}
        });
    }

    handleCategoryChange(event) {        
        this.setState({            							
			equipment : {							
                ...this.state.equipment,
                category : {
                    ...this.state.equipment.category,
                    [event.target.name]: event.target.value	
                }			
			}
        });
    }

    
    async handleSubmit(event) {
        event.preventDefault();

        var equipment = {
            "name": this.state.equipment.name,
            "categoryId": this.state.equipment.category.id
        }

        let formData = new FormData();
		if(this.state.imageWasChanged) {
			formData.append("file", this.state.equipment.imageBytes);
		} else {
			let image = await fetch(this.state.equipment.image)
				.then(image => image.blob());
			formData.append("file", image);
		}

		formData.append('data', new Blob([JSON.stringify(equipment)], {type: "application/json"}));

        await axios.put(BACKEND_SERVER_URL + "equipments/" + this.state.equipment.id, formData);

        this.props.history.push({
            pathname: '/equipments',
        })
    }

    async confirmDeleteEquipment(id, items) {
        if(items && items.length > 0) {
			window.alert("You can't delete this equipment until it has items associated with it")
		} else {
			if(window.confirm("Are you sure you wish to delete this equipment?")) {
                await axios.delete(BACKEND_SERVER_URL + "equipments/" + id);
                this.props.history.push({
                    pathname: '/equipments',
                })
            }
		}
	}

    onImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
				imageWasChanged: true,
				equipment : {
					...this.state.equipment,
					image: URL.createObjectURL(img),
                	imageBytes: img
				}
			});
        }
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
        var imageStyle = {
            width: "300px",
            height: "400px"
        };
		var tableDiv = (<div></div>);
		var editDiv = (
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
                            <label htmlFor="category">Category</label>
                            <select id="id" value={this.state.equipment.category.id} 
                                onChange={this.handleCategoryChange} name="id" required>
                                    {this.createSelectCategories()}
                            </select>
                        </span>
                        <span className="row">
							<label htmlFor="myImage">Picture</label>
							<input type="file" accept="image/*"
								onChange={this.onImageChange} name="image"/>                                        
						</span>
                        <span className="row">
							<img src={this.state.equipment.image} style={this.state.equipment.image == null ? null : imageStyle} alt=""/>                    
						</span>      
                        <span className="row">
                            <button className="deleteButton" type="button" onClick={() => this.confirmDeleteEquipment(this.state.equipment.id, this.state.equipment.items)}>
								Delete
							</button>
                            <button className="confirmButton" type="submit">Submit</button>                     
                        </span>
                    </form>
                </div>
            </div>	
            )
		if(this.state.equipment.items.length !== 0 ) {
			tableDiv = (
				<div className="table">
					<ReactTableComponent  
						data = {this.state.equipment.items}
						columns = {columns}/> 
				</div>)	
		}
		return (
			<div className="container">{[editDiv, tableDiv]}</div>
		);	       	
	}

}
