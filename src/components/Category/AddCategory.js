import React, { useState, useEffect } from "react";
import CategoryServiceService from "./CategoryService.service";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./AddCategory.css";

const emptyCategory = { id: 0, category_name: "", ordering: 0, status: 0, created_at: "", updated_at: "" };

const AddCategory = () => {
    const [category, setCategory] = useState({ ...emptyCategory });
    const [categoryList, setCategoryList] = useState([]);
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");

    const fetchCategoryList = async () => {
        setLoading(true);
        setLoadError(false);
        try {
            const response = await CategoryServiceService.getAll();
            setCategoryList(response.data);
        } catch {
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategoryList(); }, []);

    const isOrderingTaken = ordering => categoryList.some(item => Number(item.ordering) === ordering);
    // One more position than the number of categories always leaves an available choice.
    const orderingOptions = Array.from({ length: categoryList.length + 1 }, (_, index) => index + 1);
    const visibleCategories = categoryList
        .filter(item => item.category_name.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => Number(a.ordering) - Number(b.ordering) || Number(a.id) - Number(b.id));

    const saveCategory = async event => {
        event.preventDefault();
        if (saving) return;
        if (!category.category_name.trim() || !category.ordering || isOrderingTaken(category.ordering)) {
            setNotice({ variant: "danger", text: "Enter a category name and choose an available display order." });
            return;
        }
        setSaving(true);
        setNotice(null);
        try {
            await CategoryServiceService.sanctum();
            await CategoryServiceService.create({ ...category, category_name: category.category_name.trim() });
            setCategory({ ...emptyCategory });
            setNotice({ variant: "success", text: `“${category.category_name.trim()}” was added successfully.` });
            await fetchCategoryList();
        } catch {
            setNotice({ variant: "danger", text: "We couldn’t add this category. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const deleteCategory = async item => {
        if (!window.confirm(`Delete “${item.category_name}”? This cannot be undone.`)) return;
        setDeletingId(item.id);
        setNotice(null);
        try {
            await CategoryServiceService.delete(item.id);
            setCategoryList(current => current.filter(entry => entry.id !== item.id));
            setNotice({ variant: "success", text: `“${item.category_name}” was deleted.` });
        } catch {
            setNotice({ variant: "danger", text: "We couldn’t delete this category. It may still be in use. Please try again." });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="category-page">
            <header className="category-hero">
                <div className="category-hero-icon"><CategoryOutlinedIcon /></div>
                <div className="category-hero-copy">
                    <span>PRODUCT ORGANIZATION</span>
                    <h1>Categories</h1>
                    <p>Keep your products organized and easy to find.</p>
                </div>
                <div className="category-total"><strong>{loading || loadError ? "—" : categoryList.length}</strong><span>Total categories</span></div>
            </header>

            {notice && <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>{notice.text}</Alert>}
            {loadError && <Alert variant="danger">Categories couldn’t be loaded. <Button variant="link" onClick={fetchCategoryList}>Try again</Button></Alert>}

            <div className="category-layout">
                <section className="category-card category-create" aria-labelledby="category-create-title">
                    <div className="category-card-heading">
                        <span className="category-section-icon"><AddIcon /></span>
                        <div><h2 id="category-create-title">Add category</h2><p>Create a new home for your products.</p></div>
                    </div>
                    <Form onSubmit={saveCategory}>
                        <fieldset disabled={saving || loading || loadError || deletingId !== null}>
                            <Form.Group className="mb-4" controlId="category-name">
                                <Form.Label>Category name <span aria-hidden="true">*</span></Form.Label>
                                <Form.Control required type="text" value={category.category_name} placeholder="e.g. Baking ingredients" onChange={event => setCategory({ ...category, category_name: event.target.value })} />
                                <Form.Text>Use a short, descriptive name.</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="category-order">
                                <Form.Label>Display order <span aria-hidden="true">*</span></Form.Label>
                                <Form.Select required value={category.ordering || ""} onChange={event => setCategory({ ...category, ordering: Number(event.target.value) })}>
                                    <option value="">Choose a position</option>
                                    {orderingOptions.map(ordering => <option key={ordering} value={ordering} disabled={isOrderingTaken(ordering)}>{ordering}{isOrderingTaken(ordering) ? " — In use" : " — Available"}</option>)}
                                </Form.Select>
                                <Form.Text>Lower numbers appear first. Each position is unique.</Form.Text>
                            </Form.Group>
                            <Button className="category-save" type="submit">{saving ? <Spinner size="sm" animation="border" /> : <AddIcon fontSize="small" />}{saving ? "Adding category…" : "Add category"}</Button>
                        </fieldset>
                    </Form>
                    <div className="category-tip"><CategoryOutlinedIcon fontSize="small" /><p>A little organization goes a long way. Group similar products so they’re easier to browse.</p></div>
                </section>

                <section className="category-card category-list" aria-labelledby="category-list-title">
                    <div className="category-list-heading"><div><h2 id="category-list-title">Your categories <span className="category-count">{categoryList.length}</span></h2><p>Manage names and the order they appear in.</p></div></div>
                    <div className="category-search"><SearchIcon aria-hidden="true" /><Form.Control aria-label="Search categories" type="search" placeholder="Search categories…" value={search} onChange={event => setSearch(event.target.value)} /></div>
                    <div className="category-table-wrap">
                        <table className="category-table">
                            <thead><tr><th scope="col">Order</th><th scope="col">Category name</th><th scope="col">ID</th><th scope="col" className="category-actions-heading">Actions</th></tr></thead>
                            <tbody>
                                {loading ? <tr><td colSpan={4} className="category-empty"><Spinner size="sm" animation="border" /> Loading categories…</td></tr> : loadError ? <tr><td colSpan={4} className="category-empty">The category list is unavailable. Try loading it again.</td></tr> : visibleCategories.length === 0 ? <tr><td colSpan={4} className="category-empty"><CategoryOutlinedIcon /><strong>{search.trim() ? "No matching categories" : "Start with your first category"}</strong><p>{search.trim() ? "Try a different name or clear your search." : "Add a category using the form to get organized."}</p>{search.trim() && <Button variant="link" onClick={() => setSearch("")}>Clear search</Button>}</td></tr> : visibleCategories.map(item => (
                                    <tr key={item.id}>
                                        <td><span className="category-order-badge">{item.ordering || "—"}</span></td>
                                        <td className="category-name-cell">{item.category_name}</td>
                                        <td className="category-id">#{item.id}</td>
                                        <td><div className="category-actions"><Link className="category-edit" to={`/editCategory/${item.id}`} aria-label={`Edit ${item.category_name}`}><EditOutlinedIcon /> Edit</Link><Button className="category-delete" variant="link" disabled={deletingId !== null || saving} onClick={() => deleteCategory(item)} aria-label={`Delete ${item.category_name}`}>{deletingId === item.id ? <Spinner size="sm" animation="border" /> : <DeleteOutlineIcon />}</Button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && !loadError && <footer className="category-list-footer">Showing {visibleCategories.length} of {categoryList.length} categories <span>Sorted by display order</span></footer>}
                </section>
            </div>
        </main>
    );
};

export default AddCategory;
