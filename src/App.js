import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';

import * as BooksAPI from './BooksAPI';

import SearchPage from './SearchPage';
import BookShelves from './BookShelves';

/**
* @description - BooksApp component - the app root
* loads the --SearchPage component
* loads the --BookShelves component via Router
* has the BookShelves state
* @method - moveTheBook -'on moving a book' event handler
* @method - addAndMoveTheBook - 'add a new book to a shelf from the search, or change the book-shelf from the search' event handler
*/
class BooksApp extends Component {
  
  // an initial state of the app holding empty books array and an empty error message.
  state = {
    books: [],
    errMessage: ''
  }

/**
* @description - 'componentDidMount' lifecycle method
* Will get all books in the bookshelves (having shelf attr)
* BooksAPI.getAll() - backend call
*/
  componentDidMount() { 
    BooksAPI.getAll()
      .then((gotBooks) => {
        this.setState((currentState) => ({
          books: currentState.books.concat(gotBooks)
        }));
      }).catch(e=>this.setState({books: [],errMessage:"Can't load your books, please check the network!"}));
  }

/**
* @description - 'on moving a book' event handler
**** Will manage the shelf attribute of a book to change it's shelf 
**** Will update the state and also the backend
* @param {string} source - Present shelf - (Current, Want, Read, None)
* @param {string} destination - Move to the destination shelf - (Current, Want, Read, None)
* @param {string} book - The book object bubbled from the Book Component
*/
	moveTheBook = (source,destination,book) => {
      	this.setState((currentState)=>{
        	let foundBook = currentState.books.find((aBook)=>{ return aBook.id === book.id });
          	let indexOfFound = currentState.books.indexOf(foundBook);
          	if(destination==='none') {
            	//foundBook.shelf = undefined;
              	foundBook.shelf = 'none';
              	currentState.books = currentState.books.filter((book)=>book.id !== foundBook.id);
            } else {
              	foundBook.shelf = destination; // change it!!!
          		currentState.books[indexOfFound] = foundBook;
            }
          	BooksAPI.update(book,destination)
          		.then((updated)=>{
              		return currentState;
        		}).catch(e=>this.setState({errMessage:"Could't update the bookshelf, please try after sometime."}));
          	
        });
      	
    }

/**
* @description - 'add a new book to a shelf from the search, or change the book-shelf from the search' event handler
**** Will manage the shelf attribute of a new book to change it's shelf (none --> (Current, Want, Read, None) )
**** Will update the state and also the backend
* @param {string} source - Present shelf - (Current, Want, Read, None)
* @param {string} destination - Move to the destination shelf - (Current, Want, Read, None)
* @param {string} book - The book object bubbled from the SearchPage Component
*/

		addAndMoveTheBook = (source,destination,book) => {
      	this.setState((currentState)=>{
        	let foundBook = currentState.books.find((aBook)=>{ return aBook.id === book.id });
          	let indexOfFound = currentState.books.indexOf(foundBook);
          	if(foundBook) { //if it's an existing book in the books array
            	foundBook.shelf = destination; // chnage it!!!
          		currentState.books[indexOfFound] = foundBook;
      			BooksAPI.update(foundBook,destination)
          			.then((updated)=>{
                  	return currentState;
        		}).catch(e=>this.setState({errMessage:"Could't update the bookshelf, please try after sometime."}));
            }
          else { //if it's an New book in the books array
          	let newBook = book;
          	newBook.shelf = destination;
          	currentState.books = currentState.books.concat([newBook]);
          	BooksAPI.update(newBook,destination)
          			.then((updated)=>{
                 		return currentState;
        			}).catch(e=>this.setState({errMessage:"Could't add to the bookshelf, please try after sometime."}));
          }
          
      });
    }

/**
* @description - The root render() method
* Will manage the routes
* url path / - 			loads the BookShelves component - books currently in the shelves
* url path /search - 	loads the SearchPage component - allows user to search and and a book to their shelves.
*/

  render() {
    return (
      <div className="app">
       <Route path='/search' render={({ history }) => (
          <SearchPage
            onMove={(source,destination,bookISBN13) => {
              this.addAndMoveTheBook(source,destination,bookISBN13);
              history.push('/');
            }} books={this.state.books===[]?this.componentDidMount().books:this.state.books}/>
        )}/>
		<div>{this.state.errMessage}</div>
        <Route exact path='/' render={() => (
          <BookShelves
            books={this.state.books}
            onBookMove={this.moveTheBook}/>
        )}/>
	</div>
    )
  }
}

export default BooksApp;
