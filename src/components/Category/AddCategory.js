import React, { useState, useEffect } from "react";
import CategoryServiceService from "./CategoryService.service";
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";


const AddCategory = () => {

    useEffect(() => {
        fetchCategoryList();
    }, []);

    const [category, setCategory] = useState({
        id: 0,
        category_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const [categoryList, setCategoryList] = useState([]);

    const onChangeCategory = (e) => {
        setCategory({ category_name: e.target.value });
    }

    const saveCategory = () => {
        CategoryServiceService.sanctum().then(response => {
            CategoryServiceService.create(category)
                .then(response => {
                    setCategoryList([...categoryList, response.data]);;
                    setCategory({
                        category_name: ''
                    });
                    setMessage(true);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteCategory = (id, e) => {

        const index = categoryList.findIndex(category => category.id === id);
        const newCategory = [...categoryList];
        newCategory.splice(index, 1);

        CategoryServiceService.delete(id)
            .then(response => {
                setCategoryList(newCategory);
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Added!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" value={category.category_name} name="category_name" placeholder="Enter Category" onChange={onChangeCategory} />
                    <Form.Text className="text-muted"  >
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveCategory}>
                    Submit
                </Button>
            </Form>
            <br></br>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Category Name</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        categoryList.map((category, index) => (
                            <tr key={category.id} >
                                <td>{category.id}</td>
                                <td>{category.category_name}</td>
                                <td>
                                    <Link variant="primary" to={"/editCategory/" + category.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteCategory(category.id, e)} >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}


export default AddCategory
