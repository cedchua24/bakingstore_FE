import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export default class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.state = {
      categories: [],
      category: null,
      currentIndex: -1,
      categoryName: ""
    };
  }
  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchTitle(e) {
    const categoryName = e.target.value;
    this.setState({
      categoryName: categoryName
    });
  }
  retrieveTutorials() {
    TutorialDataService.getAll()
      .then(response => {
        this.setState({
          categories: response.data
        });
        console.log(response.data);
        console.log("retrieveTutorials", this.state.categories);
      })
      .catch(e => {
        console.log(e);
      });
  }
  refreshList() {
    this.retrieveTutorials();
    this.setState({
      category: null,
      currentIndex: -1
    });
  }
  setActiveTutorial(data, index) {
    this.setState({
      category: data,
      currentIndex: index
    });
  }
  removeAllTutorials() {
    TutorialDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }
  searchTitle() {
    TutorialDataService.findByTitle(this.state.categoryName)
      .then(response => {
        this.setState({
          categories: response.data
        });

      })
      .catch(e => {
        console.log(e);
      });
  }


  render() {
    const { categoryName, categories, category, currentIndex } = this.state;
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={categoryName}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Tutorials List</h4>
          <ul className="list-group">
            {categories &&
              categories.map((category, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveTutorial(category, index)}
                  key={index}
                >
                  {category.category_name}
                </li>
              ))}
          </ul>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllTutorials}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {category ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Category name:</strong>
                </label>{" "}
                {category.category_name}
              </div>
              {/* <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentTutorial.description}
                </div>
                <div>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {currentTutorial.published ? "Published" : "Pending"}
                </div> */}
              <Link
                to={"/category/" + category.id}
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}