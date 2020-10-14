import React from 'react';
import axios from 'axios';

import "../../css/pages/CommonTable.css"
import "../../css/components/Form.css"

import no_image from '../../png/no-image.png';

export default class CreateCategory extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            name: '',
            image: null,
            imageBytes: null
        };
		   
        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);        
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

        let formData = new FormData();

        if(this.state.imageBytes == null) {
            let defaultImage = await fetch(no_image)
				.then(image => image.blob());
            formData.append("file", defaultImage);
        } else {
            formData.append("file", this.state.imageBytes);
        }

        formData.append('data', new Blob([JSON.stringify({"name": this.state.name})],
            {type: "application/json"}));

        await axios.post("http://192.168.1.5:8080/api/categories/", formData);

        this.props.history.push({
            pathname: '/categories',
        })
    }
    	
	render() { 
        var imageStyle = {
            width: "300px",
            height: "400px"
        };

        return (
            <div className="container">
                <div className="header">Create a new category</div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <span className="row">
                            <label htmlFor="name">Name*</label>
                            <input type="text" id="name" value={this.state.name} 
                                onChange={this.handleChange} name="name" required></input>                            
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
