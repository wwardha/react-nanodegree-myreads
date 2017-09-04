import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import PropTypes from 'prop-types'
import sortBy from 'sort-by'

class SearchBook extends React.Component {
    static PropTypes = {
        booksOnShelf: PropTypes.array.isRequired,
        onChangeBookshelf: PropTypes.func.isRequired
    }

    state = 
    {
        query: '',
        searchBooks: [],
        libraryBooks: [],
        bookIds: []
    }
    
    componentDidMount() {
        let bookIds = []
        let books = []

        if (this.props.booksOnShelf.length !== 0) {
            books = this.props.booksOnShelf
            bookIds = this.buildIds(this.props.booksOnShelf)  
            this.setState({libraryBooks: books, bookIds: bookIds})            
        }
        else {
            BooksAPI.getAll().then((result) => {
                bookIds = this.buildIds(result)  
                this.setState({libraryBooks: result, bookIds: bookIds})            
            })    
        }

    }

    buildIds = (books) => {
        let bookIds = []
        for (var i = 0; i < books.length; i++) {
            let bookId = books[i].id
            bookIds.push(bookId)
        }  

        return bookIds;
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            let paramQuery = e.target.value.trim()

            BooksAPI.search(paramQuery, 500).then((result) => {
                if (!result.error) {
                    let searchBookIds = []
                    for (var i = 0; i < result.length; i++) {
                        let book = result[i]
                        book['shelf'] = 'none'
                        searchBookIds.push(book.id)
                    }
                    
                    let searchBooks = result.filter((book) => {
                            return this.state.bookIds.indexOf(book.id) === -1;
                        }).concat(this.state.libraryBooks.filter((book) => {
                            return searchBookIds.indexOf(book.id) !== -1;
                        }))

                    searchBooks.sort(sortBy('title'))
                    this.setState({ query: paramQuery, searchBooks: searchBooks })    
                }
                else
                    this.setState({ query: paramQuery, searchBooks: result })    
            });
        }
    }

    handleChangeBookshelf = (e, id) => {    
        let searchBooks = Object.assign([], this.state.searchBooks);
        let bookIds = Object.assign([], this.state.bookIds);        
        let shelf = e.target.value.trim()

        for (var i = 0; i < searchBooks.length; i++) {
            var bookId = searchBooks[i].id  
            if (bookId === id) {        
                let book = searchBooks[i]
                book['shelf'] = shelf            
            }
        }
        this.setState({ searchBooks: searchBooks })

        let books = this.state.searchBooks.filter((book) => book.id === id)
        BooksAPI.update(books[0], shelf).then(() => {
            let libraryBooks = this.state.libraryBooks.filter((book) => book.id !== id)
                               .concat(this.state.searchBooks.filter((book) => book.id === id))
            bookIds.push(id)

            this.setState({ libraryBooks: libraryBooks, bookIds: bookIds })
            this.props.onChangeBookshelf(libraryBooks)
        })
    }

    render() {
        let books = this.state.searchBooks
        
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" onKeyPress={this.handleKeyPress}/>              
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {!books.error &&
                            books.map((book) => (
                            <li key={book.id} >
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={book.shelf} onChange={(e) => {
                                            this.handleChangeBookshelf(e, book.id)
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
                        {books.error &&
                            <div>There are no books for "{this.state.query}"</div>
                        }                       
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchBook;