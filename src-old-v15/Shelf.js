import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import Book from './Book';


/**
* @description - Shelf component - displays all the books in that shelf
* @prop {array} order - recieves the required dropDown order from the BookShelves component
* @prop {array} books - recieves array of book objects to be displayed in that Shelf category, from the BookShelves component
* @prop {func} move - emits the onChange event back to the BookShelves (parent) component to handle.
* @method - handleMove -'on moving a book' event handler
*/

class Shelf extends Component {
  
  
  /**
* @description - 'handleMove' event handler
**** Will bubble the event back to the BookShelves (parent) component to handle.
* @param {object} - event - contianing source and destination
* @param {object} - book - The book object bubbled from the Book Component
*/
  handleMove = (e,book) => {
  	let source = this.props.order[0].option;
    let destination = e.target.value;
    this.props.move(source,destination,book);
  }; 
   
  /**
* @description -  render() method - Displays a BookShelf with books inside it.
* uses props to get the order of shelf, and the booksto show in it.
* Will display the books by passing the correct props (order,books) to each of them.
*/
  
  render() {
    const { order, books } = this.props;
    
  	return (
      <div className="bookshelf">
                  <h2 className="bookshelf-title">{order[0].value}</h2>
                  <div className="bookshelf-books">
      
                    <ol className="books-grid">
      				{books.map((book,index)=>{ return (
    					<li key={index}>
                        	<Book order={order} aBook={book} handleMove={this.handleMove}/>
                      </li>
    )})}				
                    </ol>
                  </div>
                </div>
      
          );
  }
}

Shelf.propTypes = {
  	order: PropTypes.array.isRequired,
	books: PropTypes.array.isRequired,
	move: PropTypes.func.isRequired
};


export default Shelf;