import React from 'react';
import Navigation from './Navigation';
import ListRooms from './pages/ListRooms';
import RoomDetails from './pages/RoomDetails';
import CreateRoom from './pages/CreateRoom';
import ListCategories from './pages/ListCategories';
import CategoryDetails from './pages/CategoryDetails';
import CreateCategory from './pages/CreateCategory';
import ListEquipments from './pages/ListEquipments';
import EquipmentDetails from './pages/EquipmentDetails';
import CreateEquipment from './pages/CreateEquipment';
import { BrowserRouter, Route } from "react-router-dom";

import '../css/Router.css';

function Router() {
	return (
		<div>
			<div className="router">
				<BrowserRouter>
					<Route>
						<Route path="/" component={Navigation}></Route>
						<Route exact path="/home"></Route>
						<Route exact path="/rooms" component={ListRooms}></Route>
						<Route exact path="/rooms/details/:id" component={RoomDetails}></Route>
						<Route exact path="/rooms/create" component={CreateRoom}></Route>
						<Route exact path="/categories" component={ListCategories}></Route>
						<Route exact path="/categories/details/:id" component={CategoryDetails}></Route>
						<Route exact path="/categories/create" component={CreateCategory}></Route>
						<Route exact path="/equipments" component={ListEquipments}></Route>
						<Route exact path="/equipments/details/:id" component={EquipmentDetails}></Route>
						<Route exact path="/equipments/create" component={CreateEquipment}></Route>
					</Route>
				</BrowserRouter>
			</div>
		</div>				
	);
}

export default Router;