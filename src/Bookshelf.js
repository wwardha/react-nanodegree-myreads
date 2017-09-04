import React from 'react'
import PropTypes from 'prop-types';

class Bookshelf extends React.Component {
    static PropTypes = {
        books: PropTypes.array.isRequired,
        shelfName: PropTypes.string.isRequired,
        onChangeBookshelf: PropTypes.func.isRequired
    }
    
    render() {
        const {books, shelfName, onChangeBookshelf} = this.props
        return (
            <div>
                <div className="bookshelf">
                <h2 className="bookshelf-title">{shelfName}</h2>
                    <div className="bookshelf-books">
                    <ol className="books-grid">
                        {books.map((book) => (
                            <li key={book.id} >
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={book.shelf} onChange={(e) => {
                                            onChangeBookshelf(e, book.id)
                                        }}>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.author}</div>
                            </div>
                            </li>
                        ))}                  
                    </ol>
                    </div>
                </div>
            </div>      
        )
    }
}

export default Bookshelf