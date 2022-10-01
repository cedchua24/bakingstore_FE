import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import TutorialDataService from "../services/tutorial.service";
const EditTutorial = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    id: '',
    category_name: '',
    created_at: '',
    updated_at: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getTutorial(id);
  }, {});

  const onChangeCategory = (e) => {
    const name = e.target.value;
    setCategory({ ...category, category_name: name });
  }

  const updateTutorial = () => {
    TutorialDataService.update(
      category.id,
      category
    )
      .then(response => {
        console.log(response.data);
        setMessage('The tutorial was updated successfully!')
        navigate('/')
      })
      .catch(e => {
        console.log(e);
      });
  }

  const deleteTutorial = () => {
    TutorialDataService.delete(category.id)
      .then(response => {
        console.log(response.data);
        navigate("/");
      })
      .catch(e => {
        console.log(e);
      });
  }

  const getTutorial = (id) => {
    TutorialDataService.get(id)
      .then(response => {
        setCategory(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

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
                onChange={onChangeCategory}
              />
            </div>

          </form>
          <button
            className="badge badge-danger mr-2"
            onClick={deleteTutorial}
          >
            Delete
          </button>
          <button
            type="submit"
            className="badge badge-success"
            onClick={updateTutorial}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  )
};

export default EditTutorial;