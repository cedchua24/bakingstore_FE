import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    // this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    this.state = {
      id: null,
      category_name: ""
    };
  }
  onChangeTitle(e) {
    this.setState({
        category_name: e.target.value
    });
  }
//   onChangeDescription(e) {
//     this.setState({
//       description: e.target.value
//     });
//   }
  saveTutorial() {
    var data = {
      category_name: this.state.category_name
    };
    TutorialDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          category_name: response.data.category_name
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newTutorial() {
    this.setState({
      id: null,
      category_name: ""
    });
  }
  render() {
    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newTutorial}>
                Add
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="title">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="category_name"
                  required
                  value={this.state.category_name}
                  onChange={this.onChangeTitle}
                  name="category_name"
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div> */}
              <button onClick={this.saveTutorial} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      );
  }
}
