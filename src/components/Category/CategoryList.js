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


const CategoryList = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
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

    const visibleCategories = categoryList
        .filter(item => item.category_name.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => Number(a.ordering) - Number(b.ordering) || Number(a.id) - Number(b.id));

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
                    <h1>Category list</h1>
                    <p>Keep your products organized and easy to find.</p>
                </div>
                <div className="category-total"><strong>{loading || loadError ? "—" : categoryList.length}</strong><span>Total categories</span></div>
            </header>

            {notice && <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>{notice.text}</Alert>}
            {loadError && <Alert variant="danger">Categories couldn’t be loaded. <Button variant="link" onClick={fetchCategoryList}>Try again</Button></Alert>}

            <section className="category-card category-list" aria-labelledby="category-list-title">
                <div className="category-list-heading category-list-toolbar"><div><h2 id="category-list-title">Your categories <span className="category-count">{categoryList.length}</span></h2><p>Manage names and the order they appear in.</p></div><Button as={Link} to="/addCategory" className="category-save category-add-link"><AddIcon fontSize="small" /> Add category</Button></div>
                <div className="category-search"><SearchIcon aria-hidden="true" /><Form.Control aria-label="Search categories" type="search" placeholder="Search categories…" value={search} onChange={event => setSearch(event.target.value)} /></div>
                <div className="category-table-wrap">
                    <table className="category-table">
                        <thead><tr><th scope="col">Order</th><th scope="col">Category name</th><th scope="col">ID</th><th scope="col" className="category-actions-heading">Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan={4} className="category-empty"><Spinner size="sm" animation="border" /> Loading categories…</td></tr> : loadError ? <tr><td colSpan={4} className="category-empty">The category list is unavailable. Try loading it again.</td></tr> : visibleCategories.length === 0 ? <tr><td colSpan={4} className="category-empty"><CategoryOutlinedIcon /><strong>{search.trim() ? "No matching categories" : "Start with your first category"}</strong><p>{search.trim() ? "Try a different name or clear your search." : "Use Add category to create your first product group."}</p>{search.trim() && <Button variant="link" onClick={() => setSearch("")}>Clear search</Button>}</td></tr> : visibleCategories.map(item => (
                                <tr key={item.id}>
                                    <td><span className="category-order-badge">{item.ordering || "—"}</span></td>
                                    <td className="category-name-cell">{item.category_name}</td>
                                    <td className="category-id">#{item.id}</td>
                                    <td><div className="category-actions"><Link className="category-edit" to={`/editCategory/${item.id}`} aria-label={`Edit ${item.category_name}`}><EditOutlinedIcon /> Edit</Link><Button className="category-delete" variant="link" disabled={deletingId !== null} onClick={() => deleteCategory(item)} aria-label={`Delete ${item.category_name}`}>{deletingId === item.id ? <Spinner size="sm" animation="border" /> : <DeleteOutlineIcon />}</Button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !loadError && <footer className="category-list-footer">Showing {visibleCategories.length} of {categoryList.length} categories <span>Sorted by display order</span></footer>}
            </section>
        </main>
    );
};

export default CategoryList;
