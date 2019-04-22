import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {PropTypes} from 'prop-types';

import * as BooksAPI from './BooksAPI';
import Book from './Book';

//some constants required for the state of the bookshelves
const currentlyReading = { option : 'currentlyReading', value : 'Currently Reading' };
const wantToRead = { option : 'wantToRead', value : 'Want to Read' };
const read = { option : 'read', value : 'Read' };
const none = { option : 'none', value : 'None' };

//the final bookshelf state - dropdown option orders arrays
const bookStates = {
    	currentlyReading : [currentlyReading, wantToRead, read, none],
     	wantToRead: [wantToRead, currentlyReading, read, none],
     	read: [read, currentlyReading, wantToRead, none ],
  		none: [none, wantToRead, currentlyReading, read]
};


/**
* @description - SearchPage component - loads on /search url path
* loads all the books from the backend via a search query
* Exisiting books in the shelves are also shown with their current shelf in the BookShelves
* Displays all the Book components by passing correct - (order, books) - shelf specific order and books
* has the SearchPage state.

* @prop {array} books - recieves the book object to be displayed with backend data
* @prop {func} onMove - emits the onChange event recieved from a Book, back to the App (parent) component to handle 
* @method - startSearch -'start searching' event handler
*/

class SearchPage extends Component {
  
  //initial state
  state = {
    	searchedBooks: [],
    	errMessage: '',
    	query: ''
   };
  

/**
* @description - 'startSearch' event handler
**** Will take userinput and call the Backend API only if the userinput is not empty!
* will filter the books returned from the API, so that their Current BookShelve version is displayed and not the one returned from the API
* sets the searchedBooks [] 
* @param {e} event
*/

  startSearch = (uInput) => {
    let existingBooks= this.props.books;
    this.setState({query: uInput, errMessage: ''});
    if(uInput!=="") {
    	BooksAPI.search(uInput, 10)
      	.then((gotBooks) => {
      		let updatedBooks = gotBooks.map(someBook=>{
            	let found = existingBooks.find(foundBook=>{
              		return someBook.industryIdentifiers[0].identifier===foundBook.industryIdentifiers[0].identifier;
            	});
          		return found !==undefined ? found:someBook;
          	});
	//b) Search results are not shown when all of the text is deleted out of the search input box.
	//Inside 'then' part of the promise check if(query === this.state.query) 
	//to ensure that we are not going to replace the contents to an old response.
        	if(uInput === this.state.query) {
          		this.setState((currentState) => {
            		currentState.searchedBooks = updatedBooks.filter(book=> book.imageLinks!==undefined);
            		currentState.errMessage ="";
            		//console.log("WRong-->",currentState);
            		return currentState;
          		});
       		}
      }).catch(e=>{this.setState({searchedBooks: [],errMessage:"Can't find what you are looking for, search with a different key!"});});
    }
  	else {
    	this.setState((currentState) => {
        	currentState.searchedBooks = [];
          	currentState.errMessage = "";
          	return currentState;
        });
    }
  };
  
	
  /**
* @description -  render() method - The All the Books component based on the search
* Will display the books by passing the correct props (order,books) to each of them.
*/
  
  render() {
	const {searchedBooks} = this.state;
  	return (
    	<div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              <div className="search-books-input-wrapper">
                <input onChange={(e)=>this.startSearch(e.target.value)} value={this.state.query} type="text" placeholder="Search by title or author"/>
				{this.state.errMessage}
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
					{searchedBooks.length>0?searchedBooks.map((book,index)=>{ 
                      //console.log("SearchPage-->",book);
                      //console.log(bookStates[book.shelf] ? bookStates[book.shelf] : bookStates['none']);
                      return (
    					<li key={index}>
                        	<Book order={ book.shelf ? bookStates[book.shelf] : bookStates['none']} 
									aBook={book} handleMove={(e,book)=>this.props.onMove(null,e.target.value,book)}/>
                      </li>
    					)}):null}
			</ol>
            </div>
          </div>
    );
  }
}

SearchPage.propTypes = {
  	onMove: PropTypes.func.isRequired,
	books: PropTypes.array.isRequired
};


export default SearchPage;