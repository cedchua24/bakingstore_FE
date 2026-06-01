import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CategoryServiceService from "./CategoryService.service";

const EditCategory = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchCategory(id);
        fetchCategoryList();
    }, []);

    const [category, setCategory] = useState({
        id: 0,
        category_name: '',
        ordering: 0,
        created_at: '',
        updated_at: ''
    });

    const [categoryList, setCategoryList] = useState([]);

    const [message, setMessage] = useState(false);

    const onChangeCategory = (e) => {
        setCategory({ ...category, category_name: e.target.value });
    }

    const onChangeOrdering = (e) => {
        setCategory({ ...category, ordering: Number(e.target.value) });
    }

    const isOrderingTaken = (ordering) => {
        return categoryList.some(categoryItem =>
            Number(categoryItem.ordering) === ordering && Number(categoryItem.id) !== Number(category.id)
        );
    }

    const updateCategory = () => {
        CategoryServiceService.update(category.id, category)
            .then(response => {
                setCategory(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchCategory = (id) => {
        CategoryServiceService.get(id)
            .then(response => {
                setCategory(response.data);
            })
            .catch(e => {
                console.log("error", e)
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

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
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
                    <Form.Control type="text" name="category_name" value={category.category_name} placeholder="Enter Category" onChange={onChangeCategory} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Ordering</Form.Label>
                    <Form.Select name="ordering" value={category.ordering} onChange={onChangeOrdering}>
                        <option value={0}>Select Ordering</option>
                        {
                            [...Array(categoryList.length)].map((_, index) => {
                                const ordering = index + 1;
                                const orderingTaken = isOrderingTaken(ordering);

                                return (
                                    <option
                                        key={ordering}
                                        value={ordering}
                                        disabled={orderingTaken}
                                        style={orderingTaken ? { color: 'red', backgroundColor: '#f8d7da' } : {}}
                                    >
                                        {ordering}
                                    </option>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" onClick={updateCategory}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditCategory
