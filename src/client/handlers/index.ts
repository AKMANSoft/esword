import * as booksHandler from './books.handler'
import * as chaptersHandler from './chapters.handler'
import * as versesHandler from './verses.handler'
import * as authorsHandler from './authors.handler'
import * as commentariesHandler from './commentaries.handler'
import * as usersHandler from './users.handler'
import * as notesHandler from './notes.handler'
import * as topicsHandler from './topics.handler'


const clientApiHandlers = {
    books: booksHandler,
    chapters: chaptersHandler,
    verses: versesHandler,
    authors: authorsHandler,
    commentaries: commentariesHandler,
    users: usersHandler,
    notes: notesHandler,
    topics: topicsHandler
}

export default clientApiHandlers;
