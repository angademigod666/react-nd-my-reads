import React, { Component } from 'react';
import {PropTypes} from 'prop-types';

/** Stateless Book component
* @description - Book component - displays a single book, with correct dropdown order
* @prop {array} order - recieves the required dropDown order from the Shelf component
* @prop {object} aBook - recieves the book object to be displayed with backend data
* @prop {func} handleMove - emits the onChange event back to the Shelf or SearchPage (parents) component to handle 
*/
class Book extends Component {
  
  /**
* @description -  render() method - uses only props to show a single Book,- 
* Author, thumbnail, dropdown order is shown corretly
* emits a change event for changing the bookshelf
*/
  render() {
    const { order, aBook, handleMove } = this.props;
    const imageLink = aBook.imageLinks?aBook.imageLinks.thumbnail:null;
  	return (
      <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={ { width: 128, height: 193, backgroundImage: `url(${imageLink})` }}></div>
                            <div className="book-shelf-changer">
                              <select onChange={(e)=>{handleMove(e,aBook)}}>
								<option value="move" disabled>Move to...</option>
								{order.map((anOption, index)=>{ return (
                                     <option key={index} value={anOption.option}>{anOption.value}</option>           
                                                );})}
                              </select>
                            </div>
                          </div>
                          <div className="book-title">{aBook.title}</div>
                          <div className="book-authors">{aBook.authors?aBook.authors.map((auth,index)=>{ return (
<span key={index}>{auth+" "}</span>)} ): null }</div>
                        </div>
          );
  }
}

Book.propTypes = {
  	order: PropTypes.array.isRequired,
	aBook: PropTypes.object.isRequired,
	handleMove: PropTypes.func.isRequired
};


export default Book;