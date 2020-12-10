import React from 'react';
import { Link } from "react-router-dom";

import "../../css/pages/ListCategories.css"

const BACKEND_SERVER_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export default class ListCategories extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			data: []
		};  
	}
	
	componentDidMount() {
		fetch(BACKEND_SERVER_URL + "categories")
			.then(res => res.json())
			.then(json => this.setState({ data: json }));
	}
	
	render() {
		if(this.state.data.length === 0 ) {
			return (<div></div>)  
		} else {
			var blocks = [];
			this.state.data.forEach(function(element) {
				blocks.push(
					<div className="inner-container">
						<Link to={{pathname: `/categories/details/${element.id}`}}>
							<img className="listImage" alt="" src={`data:image/jpeg;base64,${element.imageBytes}`}/>
							<span className="categoryName center">{element.name}</span>
						</Link>
					</div>
				)
			})
			return (
				<div className="category-container">
					{blocks}
				</div>			  
			)
		}
	}
}
