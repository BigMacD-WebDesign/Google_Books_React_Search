import React, { Component } from "react";
import Jumbotron from "../components/Jumbotron";
import DeleteBtn from "../components/DeleteBtn";
import API from "../utils/GoogleAPI";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import SaveBtn from "../components/SaveBtn/SaveBtn";

class Search extends Component {
  // Setting our component's initial state
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: ""
  };

  // When the component mounts, load all books and save them to this.state.books
//   componentDidMount() {
//     this.loadBooks();
//   }

  // Loads all books  and sets them to this.state.books
  loadBooks = (res) => {
    let data = res.data.items
    console.log(data);
    let bookList = []
    for (let i = 0; i < data.length; i ++ ){
      let record = {
        id: data[i].id,
        title: data[i].volumeInfo.title,
        authors: data[i].volumeInfo.authors,
        description: data[i].volumeInfo.description,
        image: data[i].volumeInfo.imageLinks.thumbnail || "No image available"
      }
      bookList.push(record);
    }
    this.setState({ books: bookList });
    console.log(this.state.books);
  };

  // Deletes a book from the database with a given id, then reloads books from the db
  saveBook = book => {
    // console.log(book)
    API.saveBook(book)
    //   .then(res => this.loadBooks())
    //   .catch(err => console.log(err));
  };

  // Handles updating component state when the user types into the input field
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  handleFormSubmit = event => {
    event.preventDefault();
    console.log(this.state.title);
    if (this.state.title) {
      API.getBooks(
        this.state.title
      )
        .then(res => this.loadBooks(res))
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Books"
              />
             
              <FormBtn
                disabled={!(this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => {
                  return (
                    <ListItem key={book.id}>
                      <a href={"/books/" + book.id}>
                      <div className="text-center"><img src={book.image}/></div><br></br>
                        <strong>
                          {book.title} by {book.author}
                        </strong>
                        {book.description}
                      </a>
                      <SaveBtn onClick={() => this.saveBook(book)} />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )} 
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;
