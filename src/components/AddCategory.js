import React, { useState }  from "react";
import { useParams, useNavigate } from 'react-router-dom';
import TutorialDataService from "../services/tutorial.service";

const AddCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [submitted, setSubmitted] = useState(false);
    const [category, setCategory] = useState({
      id: '',
      category_name: '',
      created_at: '',
      updated_at: ''
    });

    const onChangeTitle = (e) => {
        const name = e.target.value;
        setCategory({...category, category_name: name});
    }

    const saveCategory = (e) => {
        var data = category;
        TutorialDataService.create(data)
          .then(response => {
            setSubmitted(true);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
      const newCategegory = () => {
        setCategory({});
        setSubmitted(false);
      }

    const [message, setMessage] = useState('');

    return (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success"  onClick={newCategegory}>
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
                  value={category.category_name}
                  onChange={onChangeTitle}
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
              <button onClick={saveCategory} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      );
}

export default AddCategory
