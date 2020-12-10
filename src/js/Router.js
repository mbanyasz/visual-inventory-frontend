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
import ListItems from './pages/ListItems';
import CreateItems from './pages/CreateItems';
import MoveItems from './pages/MoveItems';
import DeleteItems from './pages/DeleteItems';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route } from "react-router-dom";

import '../css/Router.css';

function Router() {
	return (
		<div className="router">
			<BrowserRouter>
				<Route>
					<Route path="/" component={Navigation}></Route>						
					<Route exact path="/" component={HomePage}></Route>
					<Route exact path="/rooms" component={ListRooms}></Route>
					<Route exact path="/rooms/details/:id" component={RoomDetails}></Route>
					<Route exact path="/rooms/create" component={CreateRoom}></Route>
					<Route exact path="/categories" component={ListCategories}></Route>
					<Route exact path="/categories/details/:id" component={CategoryDetails}></Route>
					<Route exact path="/categories/create" component={CreateCategory}></Route>
					<Route exact path="/equipments" component={ListEquipments}></Route>
					<Route exact path="/equipments/details/:id" component={EquipmentDetails}></Route>
					<Route exact path="/equipments/create" component={CreateEquipment}></Route>						
					<Route exact path="/items" component={ListItems}></Route>					
					<Route exact path="/items/create" component={CreateItems}></Route>		
					<Route exact path="/items/move" component={MoveItems}></Route>
					<Route exact path="/items/delete" component={DeleteItems}></Route>
				</Route>
			</BrowserRouter>
		</div>			
	);
}

export default Router;
