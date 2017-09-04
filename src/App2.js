import React from 'react'
import { Route, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI'
import Bookshelf from './Bookshelf'
import SearchBook from './SearchBook'
import sortBy from 'sort-by'
import './App.css'

class BooksApp extends React.Component {
    state = 
    {
        books: []
    }

    componentDidMount() {
        BooksAPI.getAll().then((result) => {
          this.setState({ books: result })
        })
    }

    changeBookshelf = (e, id) => {
        let books = this.state.books.filter((book) => book.id === id)
        let shelf = e.target.value
        
        BooksAPI.update(books[0], shelf).then(() => {
            this.moveBookToShelf(id, shelf)
        })
    }

    changeSearchBookshelf = (books) => {
        this.setState( {books: books} )
    }

    moveBookToShelf(id, shelf) {
        let updateBook = this.state.books.filter((book) => book.id === id)
        updateBook[0].shelf = shelf

        let updateBooks = this.state.books.filter((book) => book.id !== id).concat(updateBook)

        this.setState({updateBooks})
    }

    render() {
        let currentlyReadingBooks = this.state.books.filter((book) => book.shelf === 'currentlyReading')
        let wantToReadBooks = this.state.books.filter((book) => book.shelf === 'wantToRead')
        let readBooks = this.state.books.filter((book) => book.shelf === 'read')

        currentlyReadingBooks.sort(sortBy('title'))
        wantToReadBooks.sort(sortBy('title'))
        readBooks.sort(sortBy('title'))

        return (
            <div className="app">
                <Route exact path='/' render={()=>(
                    <div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <div>
                            <Bookshelf books={currentlyReadingBooks} onChangeBookshelf={this.changeBookshelf} shelfName='Currently Reading' />
                            <Bookshelf books={wantToReadBooks} onChangeBookshelf={this.changeBookshelf} shelfName='Want to Read' />
                            <Bookshelf books={readBooks} onChangeBookshelf={this.changeBookshelf} shelfName='Read' />
                        </div>
                    </div>
                    <div className="open-search">
                        <Link to='/search'>Add a book</Link>
                    </div>                    
                </div>
                )}/>
                <Route path='/search' render={()=>(
                    <div>
                        <SearchBook booksOnShelf={this.state.books} onChangeBookshelf={this.changeSearchBookshelf} />
                    </div>
                )}/>
            </div>
        )
    }   
}

export default withRouter(BooksApp)