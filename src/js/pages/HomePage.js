import React from 'react';  

import "../../css/pages/HomePage.css"

import bme from '../../images/bme.jpg';

export default class HomePage extends React.Component {

	render() { 
        return (
            <div className="container">
                <img className="homeImage" src={bme} alt="bme"/>
            </div>			  
        );		
	}
}
