import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CategoryServiceService from "./CategoryService.service";

const EditCategory = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchCategory(id);
    }, []);

    const [category, setCategory] = useState({
        id: 0,
        category_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeCategory = (e) => {
        setCategory({ ...category, category_name: e.target.value });
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
                    <Form.Text className="text-muted"  >
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={updateCategory}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditCategory
