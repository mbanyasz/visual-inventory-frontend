import React from 'react';  
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

import no_image from '../../images/no-image.png';

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export default class CreateEquipment extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            categories: [],
            name: '',
            categoryId: '',
            image: null,
            imageBytes: null
        }; 
        		   
        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
    }

    async componentDidMount() {
        await fetch(BACKEND_SERVER_URL + "categories")
			.then(res => res.json())
            .then(json => this.setState({ categories: json }));                              
    
        this.state.categoryId = this.state.categories[0].id;
	}

    handleChange(event) {    
        this.setState({            							
            [event.target.name]: event.target.value
        });
    }

    onImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({							
				...this.state,
                image: URL.createObjectURL(img),
                imageBytes: img
            });
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        var equipment = {
            "name": this.state.name,
            "categoryId": this.state.categoryId
        }

        let formData = new FormData();

        if(this.state.imageBytes == null) {
            let defaultImage = await fetch(no_image)
				.then(image => image.blob());
            formData.append("file", defaultImage);
        } else {
            formData.append("file", this.state.imageBytes);
        }

        formData.append('data', new Blob([JSON.stringify(equipment)], {type: "application/json"}));

        await axios.post(BACKEND_SERVER_URL + "equipments/", formData);

        this.props.history.push({
            pathname: '/equipments',
        })
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
                            <label htmlFor="category">Category</label>
                            <select id="categoryId" value={this.state.categoryId} 
                                onChange={this.handleChange} name="categoryId" required>
                                    {this.createSelectCategories()}
                            </select>
                        </span>
                        <span className="row">
                            <label htmlFor="imageBytes">Picture</label>
                            <input type="file" id="imageBytes" accept="image/*"
                                onChange={this.onImageChange} name="imageBytes"/>                     
                        </span> 
                        <span className="row">
                            <img src={this.state.image} style={this.state.image == null ? null : imageStyle} alt=""/>                    
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
