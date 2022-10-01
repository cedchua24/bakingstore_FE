import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    // this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);
    this.state = {
      category: {
        id: null,
        category_name: ""
      },
      message: ""
    };
    console.log('props', this.props);
  }
  componentDidMount() { 
   this.getTutorial(this.props.match.params.id);
   // this.getTutorial(1);
  }
  onChangeTitle(e) {
    const name = e.target.value;
    this.setState(function(prevState) {
      return {
        category: {
          ...prevState.category,
          category_name: name
        }
      };
    });
  }

    

//   onChangeDescription(e) {
//     const description = e.target.value;
    
//     this.setState(prevState => ({
//       currentTutorial: {
//         ...prevState.currentTutorial,
//         description: description
//       }
//     }));
//   }
  getTutorial(id) {
    TutorialDataService.get(id)
      .then(response => {
        this.setState({
          category: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  updatePublished(status) {
    var data = {
      id: this.state.category.id,
      category_name: this.state.category.category_name
    };
    TutorialDataService.update(this.state.category.id, data)
      .then(response => {
        this.setState(prevState => ({
            category: {
            ...prevState.category
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  updateTutorial() {
    TutorialDataService.update(
      this.state.category.id,
      this.state.category
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The tutorial was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  deleteTutorial() {    
    TutorialDataService.delete(this.state.category.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/categories')
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    const { category } = this.state;
    return (
      <div>
        {category ? (
          <div className="edit-form">
            <h4>Tutorial</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  value={category.category_name}
                  onChange={this.onChangeTitle}
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentTutorial.description}
                  onChange={this.onChangeDescription}
                />
              </div> */}
              {/* <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentTutorial.published ? "Published" : "Pending"}
              </div> */}
            </form>
            {/* {currentTutorial.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )} */}
            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteTutorial}
            >
              Delete
            </button>
            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateTutorial}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}