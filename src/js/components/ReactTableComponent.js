import React from 'react';  
import ReactTable from "react-table-6";  

import "react-table-6/react-table.css";

import "../../css/components/ReactTableComponent.css"

export default class ReactTableComponent extends React.Component {

    constructor(props) {
		super(props);
        this.state = {
            data: props.data,
			columns: props.columns,
			defaultSort: props.defaultSorted,
			defaultPageSize: props.defaultPageSize,
			pageSizeOptions: props.pageSizeOptions,
			showPagination: props.showPagination
        }
    }

	render() {    
		return (  
			<div>
				<ReactTable className="react-table-component"
					data={this.state.data}  
					columns={this.state.columns}  
					defaultPageSize = {this.state.defaultPageSize === undefined ? 20 : this.state.defaultPageSize}  
					pageSizeOptions = {this.state.pageSizeOptions === undefined ? [20, 25] : this.state.pageSizeOptions}
					defaultSorted = {this.state.defaultSort}
					sortable={false}
					resizable={false}
					filterable
					showPagination={this.state.showPagination === undefined ? true : this.state.showPagination}  
					defaultFilterMethod={(filter, row) => String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())}
				/>				
			</div>   
		)  
	}
}