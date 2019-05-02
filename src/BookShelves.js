import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

import Shelf from './Shelf';

//some constants required for the state of the bookshelves
const currentlyReading = { option: 'currentlyReading', value: 'Currently Reading' };
const wantToRead = { option: 'wantToRead', value: 'Want to Read' };
const read = { option: 'read', value: 'Read' };
const none = { option: 'none', value: 'None' };

//the final bookshelf state - dropdown orders arrays
const bookStates = {
  currentlyReadingOrder: [currentlyReading, wantToRead, read, none],
  wantToReadOrder: [wantToRead, currentlyReading, read, none],
  readOrder: [read, currentlyReading, wantToRead, none]
};

/**
* @description - BookShelves component - loads on / url path
* loads the 3 different Shelf components passing different props - (order, books)
* (order, books) - shelf specific order and books
* has the BookShelves state
*
* @prop {array} books - recieves the book object to be displayed with backend data
* @prop {func} onBookMove - emits the onChange event back to the App (parent) component to handle, recieved from BookShelves 
* @method - moveBook -'on moving a book' event handler
*/
class BookShelves extends Component {

  /**
  * @description - 'on moving a book' event handler
  **** Will bubble the event back to the BookApp parent compoent
  * @param {string} source - Present shelf - (Current, Want, Read, None)
  * @param {string} destination - Move to the destination shelf - (Current, Want, Read, None)
  * @param {string} book - The book object bubbled from the Book Component
  */
  moveBook = (source, destination, book) => {
    this.props.onBookMove(source, destination, book);
  };


  /**
  * @description -  render() method - The View of BookShelves component
  * Will display 3 Shelf component, after filtering the books and passing the correct props (order,books) to each of them.
  */
  render() {
    const { books } = this.props;
    const { currentlyReadingOrder, wantToReadOrder, readOrder } = bookStates;

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <Shelf order={currentlyReadingOrder} books={books.filter(currentBook => currentBook.shelf === 'currentlyReading')}
              move={this.moveBook} />
            <Shelf order={wantToReadOrder} books={books.filter(currentBook => currentBook.shelf === 'wantToRead')} 
              move={this.moveBook} />
            <Shelf order={readOrder} books={books.filter(currentBook => currentBook.shelf === 'read')} 
              move={this.moveBook} />
          </div>
        </div>
        <div className="open-search">
          <Link to='/search'>Add a book</Link>
        </div>
      </div>

    );
  }
}

BookShelves.propTypes = {
  books: PropTypes.array.isRequired,
  onBookMove: PropTypes.func.isRequired
};

export default BookShelves;