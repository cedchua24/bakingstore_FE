import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import MarkUpPriceService from "../MarkUpPrice/MarkUpPriceService.service";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

const productSearchText = (product) => [
    product.product_name,
    product.category_name,
    product.business_type,
    product.packaging,
    product.weight,
    product.variation,
    product.new_price,
    product.sale_price,
    Number(product.sale_price) > 0 ? 'sale promo' : '',
    product.product_id,
    product.id
].filter((item) => item !== null && item !== undefined).join(' ').toLowerCase();

const limitProductsByGroup = (products, limit) => {
    const limitedProducts = [];
    let lastProductId = null;
    for (const product of products) {
        const productGroupId = product.product_id ?? product.id;
        if (limitedProducts.length >= limit && productGroupId !== lastProductId) {
            break;
        }
        limitedProducts.push(product);
        lastProductId = productGroupId;
    }
    return limitedProducts;
};

const AddProductCustomerOrderTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchShopOrderTransaction(id);
        fetchShopOrder(id);

        fetchShopOrderDTO(id);
    }, []);

    const [deleteOpenModal, setDeleteOpenModal] = useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [validatorModal, setValidatorModal] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(null)
    const [deleteId, setDeleteId] = useState(0)

    const [stock, setStock] = useState(0);


    const [orderShop, setOrderShop] = useState({
        id: 0,
        shop_transaction_id: id,
        branch_stock_transaction_id: 0,
        mark_up_product_id: 0,
        shop_order_profit: 0,
        order_profit: 0,
        product_id: 0,
        shop_order_quantity: 0,
        shop_order_price: 0,
        business_type: '',
        stock: 0,
        profit: 0,
        sale_price: 0,
        shop_order_total_price: 0,
        fixed_price: 0,
        discount_percentage: 0,
        discount: '',
        discount_amount: 0,
        created_at: ''
    });

    const [origPrice, setOrigPrice] = useState(0);
    const [profit, setProfit] = useState(0);

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        profit: 0,
        requestor: 0,
        checker: 0,
        sr_name: '',
        date: '',
        requestor_name: '',
        checker_name: '',
        created_at: '',
        updated_at: ''
    });

    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        mark_up_product_id: 0,
        business_type: '',
        product_name: '',
        constant_shop_order_price: 0,
        shop_order_price: 0,
        fixed_price: 0,
        mup_profit: 0,
        stock: 0,
        shop_order_profit: 0,
        shop_order_quantity: 0,
        shop_order_total_price: 0,
        discount: '',
        discount_percentage: 0,
        discount_amount: 0
    });



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 'calc(100% - 32px)', sm: 440 },
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2.5, sm: 3 },
        '& .MuiTextField-root': { width: '100%' },
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchShopOrder(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);


    const steps = [
        'Created Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const TAX_RATE = 0.12;

    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [message, setMessage] = useState(false);


    function inputValidation() {
        console.log('orderShop', orderShop);

        if (orderShop.product_id == 0) {
            setValidator({
                severity: 'warning',
                message: 'Please choose Product',
                isShow: true,
            });

        } else
            if (orderShop.shop_order_price < 1) {
                setValidator({
                    severity: 'warning',
                    message: 'Please input Valid Price',
                    isShow: true,
                });
            }
            else if (orderShop.shop_order_quantity < 1) {
                setValidator({
                    severity: 'warning',
                    message: 'Please insert Quantity',
                    isShow: true,
                });
            } else if (orderShop.shop_order_quantity > orderShop.stock) {
                setValidator({
                    severity: 'error',
                    message: 'Quantity is more than to Stocks',
                    isShow: true,
                });
            } else if (orderShop.discount == 'AMOUNT' && orderShop.discount_percentage == 0) {
                setValidator({
                    severity: 'error',
                    message: 'Required Discounted Amount',
                    isShow: true,
                });
            } else if (orderShop.discount == 'PERCENTAGE' && orderShop.discount_percentage == 0) {
                setValidator({
                    severity: 'error',
                    message: 'Required Discounted Percentage',
                    isShow: true,
                });
            } else if (shopOrderTransaction.checker == 0 && orderShop.shop_order_profit < 1 && orderShop.sale_price < 1) {
                setValidator({
                    severity: 'error',
                    message: 'Price is less than to Capital',
                    isShow: true,
                });
            } else {
                setValidator({
                    severity: '',
                    message: '',
                    isShow: false,
                });

                const index = orderShopDTO.shopOrderList.filter(obj => {
                    return obj.mark_up_product_id === orderShop.mark_up_product_id;
                });
                console.log('orderShop', orderShop);
                console.log('orderShopDTO', orderShopDTO);
                console.log('index', index);
                if (index.length === 0) {
                    setSubmitLoadingAdd(true);
                    setIsAddDisabled(true);


                    ShopOrderService.sanctum().then(() => {
                        ShopOrderService.create(orderShop)
                            .then(response => {

                                if (response.data.code == 200) {
                                    setValidator({
                                        severity: 'success',
                                        message: response.data.message,
                                        isShow: true,
                                    });
                                } else {
                                    setValidator({
                                        severity: 'error',
                                        message: response.data.message,
                                        isShow: true,
                                    });

                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                                }
                                fetchShopOrder(id);
                                setOrderShop({
                                    shop_transaction_id: id,
                                    product_id: 0,
                                    shop_order_price: 0,
                                    shop_order_quantity: 0,
                                    shop_order_total_price: 0,
                                    fixed_price: 0,
                                    discount: '',
                                    discount_percentage: 0,
                                    discount_amount: 0,
                                });
                                setValue(null);
                                fetchShopOrderDTO(id);
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            })
                            .catch(e => {

                                setValidator({
                                    severity: 'error',
                                    message: e.response?.data?.message || 'Something went wrong.',
                                    isShow: true,
                                });

                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });

                            })
                            .finally(() => {
                                setSubmitLoadingAdd(false);
                                setIsAddDisabled(false);
                            });
                    });

                } else {
                    setValidator({
                        severity: 'error',
                        message: 'Product already exists!',
                        isShow: true,
                    });
                }

            }
        window.scrollTo(0, 0);
    }


    const onChangeInput = (e) => {
        e.persist();
        console.log(e.target.name)
        setOrderShop({
            ...orderShop,
            [e.target.name]: e.target.value,
        });
    }

    const onChangeDiscount = (e) => {
        console.log(e.target.name)
        setOrderShop({
            ...orderShop,
            discount: e.target.value,
            shop_order_price: 0,
            shop_order_profit: 0,
            shop_order_total_price: Number(orderShop.fixed_price) * Number(orderShop.shop_order_quantity),
            discount_percentage: 0,
            discount_amount: 0,
        });
    }


    const onChangeQuantity = (e) => {
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            shop_order_quantity: e.target.value,
            shop_order_profit: computeProfit2(orderShop.discount_amount, e.target.value, orderShop.profit),
            shop_order_total_price: Number(orderShop.shop_order_price) * Number(e.target.value)
        });
    }

    const onChangeMarkUpPercentage = (e) => {
        console.log('disc precentage', e.target.value);
        const discountedPrice = (orderShop.fixed_price / 100) * e.target.value;
        const discountedPriceNewPrice = Number(orderShop.fixed_price) - discountedPrice;
        const shop_order_total_price = discountedPriceNewPrice * orderShop.shop_order_quantity;
        setOrderShop({
            ...orderShop,
            discount_percentage: e.target.value,
            discount_amount: discountedPrice,
            shop_order_price: discountedPriceNewPrice,
            shop_order_profit: computeProfit2(discountedPrice, orderShop.shop_order_quantity, orderShop.profit),
            shop_order_total_price: shop_order_total_price
        });
    }

    const onChangeMarkUpPrice = (e) => {
        console.log('disc', e.target.value);
        console.log('shop_order_price', Number(orderShop.fixed_price));

        const discountedPriceNewPrice = Number(orderShop.fixed_price) - e.target.value;
        console.log('discountedPriceNewPrice', discountedPriceNewPrice);
        const shop_order_total_price = discountedPriceNewPrice * orderShop.shop_order_quantity;
        console.log('shop_order_total_price', shop_order_total_price);
        setOrderShop({
            ...orderShop,
            discount_percentage: e.target.value,
            discount_amount: e.target.value,
            shop_order_price: discountedPriceNewPrice,
            shop_order_profit: computeProfit2(e.target.value, orderShop.shop_order_quantity, orderShop.profit),
            shop_order_total_price: shop_order_total_price
        });
    }

    const computeProfit2 = ($disc, $quantity, $profit) => {
        console.log('disc', $disc);
        console.log('quantity', $quantity);
        console.log('profit', $profit);

        const $newdisc = $disc * $quantity;
        const $newprofit = $profit * $quantity;

        const $diffPrice = $newprofit - $newdisc;
        console.log('diffPrice', $diffPrice);

        return $diffPrice;

    }


    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            shop_order_quantity: e.target.value,
            shop_order_profit: computeProfitModal(Number(orderSupplierModal.fixed_price), Number(orderSupplierModal.shop_order_price),
                e.target.value, orderSupplierModal.mup_profit),
            shop_order_total_price: orderSupplierModal.shop_order_price * e.target.value
        });
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();

        console.log('orderSupplierModal', orderSupplierModal);
        console.log('disc', e.target.value);
        console.log('shop_order_price', Number(orderSupplierModal.fixed_price));

        const discountedPriceNewPrice = Number(orderSupplierModal.fixed_price) - e.target.value;
        console.log('discountedPriceNewPrice', discountedPriceNewPrice);
        const shop_order_total_price = discountedPriceNewPrice * orderSupplierModal.shop_order_quantity;
        console.log('shop_order_total_price', shop_order_total_price);
        setOrderSupplierModal({
            ...orderSupplierModal,
            discount: e.target.value != orderSupplierModal.constant_shop_order_price ? 'AMOUNT' : orderSupplierModal.discount,
            shop_order_price: e.target.value,
            discount_amount: Number(orderSupplierModal.fixed_price) - e.target.value,
            shop_order_profit: computeProfitModal(Number(orderSupplierModal.fixed_price), e.target.value,
                orderSupplierModal.shop_order_quantity, orderSupplierModal.mup_profit),
            shop_order_total_price: e.target.value * Number(orderSupplierModal.shop_order_quantity)
        });
    }


    const computeProfitModal = ($fixed_price, $new_price, $quantity, $profit) => {

        const $diff_price = $fixed_price - $new_price;

        const $newProfit = $profit - $diff_price

        return $newProfit * $quantity;

    }

    const handleInputChange = (e, value) => {
        e.persist();
        setValue(value);
        console.log('eym', value)
        if (!value) {
            setOrderShop({
                ...orderShop,
                shop_transaction_id: id,
                branch_stock_transaction_id: 0,
                shop_order_price: 0,
                fixed_price: 0,
                mark_up_product_id: 0,
                order_profit: 0,
                profit: 0,
                product_id: 0,
                stock: 0,
                sale_price: 0,
                business_type: '',
                shop_order_quantity: 0,
                shop_order_profit: 0,
                shop_order_total_price: 0,
                discount_percentage: 0,
                discount: '',
                discount_amount: 0,
            });
            setStock(0);
            return;
        }
        if (orderShop.business_type === 'WHOLESALE') {
            setStock(value.stock);
        } else {
            setStock(value.stock_pc);
        }
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            branch_stock_transaction_id: value.branch_stock_transaction_id,
            shop_order_price: value.new_price,
            fixed_price: value.new_price,
            mark_up_product_id: value.id,
            order_profit: value.profit,
            profit: value.profit,
            product_id: value.product_id,
            stock: value.stock,
            sale_price: value.sale_price,
            business_type: value.business_type,
            shop_order_total_price: Number(value.new_price) * Number(orderShop.shop_order_quantity),
            shop_order_quantity: 0, // start of empty
            shop_order_profit: 0,
            shop_order_total_price: 0,
            discount_percentage: 0,
            discount: '',
            discount_amount: 0,
        });
        setOrigPrice(value.new_price)
        setProfit(value.profit)
    }

    const fetchProductList = (checker) => {
        if (checker != 0) {
            MarkUpPriceService.fetchMarkUpShoporder()
                .then(response => {
                    console.log("product List: ", response.data)
                    setProducts(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                });
        } else {
            MarkUpPriceService.getAll()
                .then(response => {
                    console.log("product List: ", response.data)
                    setProducts(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                });
        }

    }

    const fetchShopOrderTransaction = async (id) => {
        console.log('test')
        await ShopOrderTransactionService.fetchShopOrderTransaction(id)
            .then(response => {
                console.log('fetchShopOrderTransaction', response.data)
                setShopOrderTransaction(response.data);
                fetchProductList(response.data.checker);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrder = async (id) => {
        await ShopOrderService.fetchShopOrder(id)
            .then(response => {
                // setOrderSupplierModal(response.data);
                console.log(response.data)
                setOrigPrice(response.data.shop_order_price);
                setProfit(response.data.shop_order_profit / response.data.shop_order_quantity)

                setOrderSupplierModal({
                    ...orderSupplierModal,
                    id: response.data.id,
                    product_name: response.data.product_name,
                    shop_transaction_id: response.data.shop_transaction_id,
                    shop_order_price: response.data.shop_order_price,
                    constant_shop_order_price: response.data.shop_order_price,
                    fixed_price: response.data.new_price,
                    mup_profit: response.data.profit,
                    mark_up_product_id: response.data.mark_up_product_id,
                    order_profit: response.data.shop_order_profit,
                    product_id: response.data.product_id,
                    stock: response.data.business_type == 'WHOLESALE' ? response.data.stock : response.data.stock_pc,
                    sale_price: response.data.sale_price,
                    business_type: response.data.business_type,
                    shop_order_total_price: response.data.shop_order_total_price,
                    shop_order_quantity: response.data.shop_order_quantity, // start of empty
                    discount: response.data.discount,
                    discount_amount: response.data.discount_amount,
                    discount_percentage: response.data.discount_percentage
                });


            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderDTO = async (id) => {
        await ShopOrderService.fetchShopOrderDTO(id)
            .then(response => {
                setOrderShopDTO(response.data);
                const totalPrice = response.data.shopOrderTransaction.shop_order_transaction_total_price;
                const subtotal = totalPrice / (1 + TAX_RATE);

                setinvoiceSubtotal(subtotal);
                setinvoiceTaxes(totalPrice - subtotal);
                setinvoiceTotal(totalPrice);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const saveCustomerOrder = (event) => {
        event.preventDefault();
        inputValidation();
    }




    const updateOrderTransaction = () => {

        ShopOrderTransactionService.update(id, shopOrderTransaction)
            .then(response => {
                setMessage(true);
                fetchShopOrderTransaction(id);
            })
            .catch(e => {
                console.log(e);
            });
    }


    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", orderSupplierModal);
        console.log("deleteId", deleteId);
        ShopOrderService.delete(deleteId, orderSupplierModal)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'success',
                    message: 'Successfuly Deleted!',
                    isShow: true,
                });
                fetchShopOrderDTO(id);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }




    const openDelete = (id) => {
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }

    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        if (orderSupplierModal.shop_order_price < 1) {
            setValidatorModal({
                severity: 'warning',
                message: 'Please input Valid Price',
                isShow: true,
            });
            setSubmitLoading(false);
        }
        else if (orderSupplierModal.shop_order_quantity > orderSupplierModal.stock) {
            setValidatorModal({
                severity: 'warning',
                message: 'Quantity is more than to Stocks',
                isShow: true,
            });
            setSubmitLoading(false);
        } else if (shopOrderTransaction.checker == 0 && orderSupplierModal.shop_order_profit < 1 && orderSupplierModal.sale_price < 1) {
            setValidatorModal({
                severity: 'error',
                message: 'Price is less than to Capital',
                isShow: true,
            });
            setSubmitLoading(false);
        } else {

            ShopOrderService.update(orderSupplierModal.id, orderSupplierModal)
                .then(response => {
                    console.log(response.data);
                    setSubmitLoading(false);
                    setOpen(false);
                    if (response.data.code == 200) {
                        setSubmitLoading(false);
                        setOpen(false);
                        window.scrollTo(0, 0);
                        setValidatorModal({
                            severity: 'success',
                            message: 'Successfuly Added!',
                            isShow: true,
                        });
                    } else if (response.data.code == 400) {
                        setSubmitLoading(false);
                        setOpen(false);
                        window.scrollTo(0, 0);
                        setValidatorModal({
                            severity: 'error',
                            message: response.data.message,
                            isShow: true,
                        });
                    } else {
                        setSubmitLoading(false);
                        setOpen(false);
                        setValidatorModal({
                            severity: 'error',
                            message: "Unknown Error",
                            isShow: true,
                        });
                    }
                    fetchShopOrderDTO(id);
                })
                .catch(e => {
                    console.log(e);
                    setValidatorModal({
                        severity: 'error',
                        message: e.response.data.message,
                        isShow: true,
                    });
                });
        }
    }

    const finalizeOrder = () => {
        navigate('/shopOrderTransaction/finalizeShopOrder/' + id);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const productUnitWeight = (product) => {
        const weight = Number(product.weight || 0);
        const quantity = Number(product.quantity || 1);
        const unitWeight = weight / quantity;
        return Number.isInteger(unitWeight) ? unitWeight : Number(unitWeight.toFixed(3));
    };

    const productSizeLabel = (product) => {
        const unitSize = `${productUnitWeight(product)}${product.variation || ''}`;
        return product.business_type === 'WHOLESALE' && Number(product.quantity) > 1
            ? `(${unitSize} x ${product.quantity})`
            : unitSize;
    };

    const productLabel = (product) => {
        if (!product) {
            return '';
        }

        const packageName = product.business_type === 'WHOLESALE' ? ` ${product.packaging || 'Box'}` : '';
        const saleLabel = Number(product.sale_price) > 0 ? ' • SALE' : '';
        return `${product.product_name}${packageName} ${productSizeLabel(product)}${saleLabel}`;
    };

    const orderedProducts = useMemo(() => Array.from(products.reduce((productGroups, product) => {
        const groupKey = product.product_id ?? product.id;
        if (!productGroups.has(groupKey)) {
            productGroups.set(groupKey, []);
        }
        productGroups.get(groupKey).push(product);
        return productGroups;
    }, new Map()).values()).flat(), [products]);

    const productSearchIndex = useMemo(() => new Map(
        orderedProducts.map((product) => [product, productSearchText(product)])
    ), [orderedProducts]);

    const filterProducts = (options, state) => {
        const searchTerms = state.inputValue.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (searchTerms.length === 0) {
            return limitProductsByGroup(options, 80);
        }

        const matches = [];
        let lastMatchedProductId = null;
        for (const product of options) {
            const searchableProduct = productSearchIndex.get(product) || '';
            if (searchTerms.every((term) => searchableProduct.includes(term))) {
                const productGroupId = product.product_id ?? product.id;
                if (matches.length >= 80 && productGroupId !== lastMatchedProductId) {
                    break;
                }
                matches.push(product);
                lastMatchedProductId = productGroupId;
            }
        }
        return matches;
    };

    const availableProductStock = (product) => product.business_type === 'WHOLESALE'
        ? Number(product.stock || 0)
        : Number(product.stock_pc ?? product.stock ?? 0);

    const itemDescription = (row) => row.business_type === 'WHOLESALE'
        ? `${row.packaging} (${row.weight / row.quantity}${row.variation}${row.quantity === 1 ? '' : ' x ' + row.quantity})`
        : `(${Number.isInteger(row.weight / row.quantity) ? (row.weight / row.quantity) : (row.weight / row.quantity).toPrecision(2)}${row.variation})`;

    const discountText = (row) => row.discount === 'PERCENTAGE'
        ? `${row.discount_percentage}%, -${row.discount_amount}`
        : row.discount === 'AMOUNT'
            ? `-${row.discount_amount}`
            : '';

    const currentOrderType = shopOrderTransaction.checker !== 0 ? 'Shop Branch Order' : 'Online Order';
    const selectedProductReady = orderShop.product_id !== 0;
    const transactionVipCustomers = Array.isArray(shopOrderTransaction.vip_customers)
        ? shopOrderTransaction.vip_customers
        : [];

    const renderTransactionVipCustomers = () => {
        if (transactionVipCustomers.length === 0) {
            return null;
        }

        return (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                {transactionVipCustomers.map((vipCustomer) => (
                    <Chip
                        key={`${vipCustomer.vip_customer_transaction_id}-${vipCustomer.vip_customer_id}`}
                        size="small"
                        variant="outlined"
                        label={vipCustomer.vip_name || 'VIP'}
                        icon={
                            <Box
                                component="span"
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: vipCustomer.vip_color || '#9ca3af',
                                    border: '1px solid #cbd5e1',
                                    ml: '6px !important'
                                }}
                            />
                        }
                    />
                ))}
            </Stack>
        );
    };

    return (
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
                                <StorefrontIcon color="primary" />
                                <Chip size="small" color={shopOrderTransaction.checker !== 0 ? 'primary' : 'success'} label={currentOrderType} />
                                <Chip size="small" variant="outlined" label={`Ref #${shopOrderTransaction.id || id}`} />
                            </Stack>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: 0 }}>
                                Add Products
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                                <Typography color="text.secondary">
                                    {shopOrderTransaction.shop_name || 'Shop'} order for {shopOrderTransaction.requestor_name || 'customer'}
                                </Typography>

                            </Stack>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="overline" color="text.secondary">Current Total</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {numberFormat(invoiceTotal || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {orderShopDTO.shopOrderList.length} item{orderShopDTO.shopOrderList.length === 1 ? '' : 's'} in order
                            </Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ mt: 3 }}>
                        <Stepper activeStep={1} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Paper>

                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity} sx={{ mb: 2 }}>{validator.message}</Alert>
                }

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(320px, .85fr)' }, gap: 2, mb: 2 }}>
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Order Details</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Confirm the transaction information before adding items.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Shop</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.shop_name || '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">{shopOrderTransaction.checker !== 0 ? 'Requestor' : 'Customer'}</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.requestor_name || '-'}</Typography>
                                        {renderTransactionVipCustomers()}
                                    </Stack>
                                </Box>
                                {shopOrderTransaction.checker !== 0 &&
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Checker</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.checker_name || '-'}</Typography>
                                    </Box>
                                }
                                {shopOrderTransaction.checker === 0 &&
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Sales Rep</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.sr_name || '-'}</Typography>
                                    </Box>
                                }
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Date</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.updated_at || '-'}</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <Stack spacing={1.5}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Summary</Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Quantity</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.shop_order_transaction_total_quantity || 0}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{numberFormat(invoiceSubtotal || 0)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Tax estimate</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{numberFormat(invoiceTaxes || 0)}</Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontWeight: 700 }}>Grand Total</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{numberFormat(invoiceTotal || 0)}</Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                    <form onSubmit={saveCustomerOrder}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Product</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Choose a product, set quantity, and apply discount when available.
                                </Typography>
                            </Box>

                            <Autocomplete
                                fullWidth
                                options={orderedProducts}
                                getOptionDisabled={(product) => availableProductStock(product) < 1}
                                value={value}
                                id="product-search"
                                onChange={handleInputChange}
                                groupBy={(product) => product.category_name || 'Other Products'}
                                getOptionLabel={productLabel}
                                isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
                                filterOptions={filterProducts}
                                autoHighlight
                                openOnFocus
                                selectOnFocus
                                clearOnBlur={false}
                                noOptionsText="No products match your search"
                                renderOption={(props, product) => {
                                    const isWholesale = product.business_type === 'WHOLESALE';
                                    return (
                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{
                                            py: 1.25,
                                            gap: 1.5,
                                            alignItems: 'center',
                                            bgcolor: '#fff',
                                            '&.Mui-focused': {
                                                bgcolor: '#f3f4f6'
                                            },
                                            '&[aria-selected="true"]': {
                                                bgcolor: '#e5e7eb'
                                            }
                                        }}
                                    >
                                        <Box
                                            aria-hidden="true"
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                flexShrink: 0,
                                                borderRadius: '50%',
                                                bgcolor: isWholesale ? '#d97706' : '#2563eb'
                                            }}
                                        />
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                                                <Typography sx={{ minWidth: 0, fontWeight: 700 }} noWrap>
                                                    {product.product_name}
                                                </Typography>
                                                {isWholesale &&
                                                    <Chip
                                                        size="small"
                                                        variant="outlined"
                                                        label={String(product.packaging || 'Box').toUpperCase()}
                                                        sx={{
                                                            height: 20,
                                                            flexShrink: 0,
                                                            borderColor: '#92400e',
                                                            color: '#92400e',
                                                            bgcolor: '#fffbeb',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 800
                                                        }}
                                                    />
                                                }
                                                {Number(product.sale_price) > 0 &&
                                                    <Chip
                                                        size="small"
                                                        color="error"
                                                        label="SALE"
                                                        sx={{ height: 20, flexShrink: 0, fontSize: '0.65rem', fontWeight: 900 }}
                                                    />
                                                }
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary">
                                                {productSizeLabel(product)}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
                                            <Chip
                                                size="small"
                                                color={isWholesale ? 'warning' : 'primary'}
                                                variant="outlined"
                                                label={isWholesale ? 'WHOLESALE' : 'RETAIL'}
                                                sx={{ fontWeight: 800 }}
                                            />
                                            <Chip
                                                size="small"
                                                color={availableProductStock(product) > 0 ? 'success' : 'error'}
                                                label={`Stock ${availableProductStock(product)}`}
                                            />
                                            <Typography sx={{ minWidth: 80, textAlign: 'right', fontWeight: 800 }}>
                                                {numberFormat(product.new_price)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search and choose product"
                                        placeholder="Try product name, category, package, weight, or price"
                                        helperText={`${products.length} products available • Type more words to narrow large result sets`}
                                        variant="outlined"
                                    />
                                )}
                            />

                            {value &&
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 1.5,
                                        p: 1.5,
                                        borderColor: '#d1d5db',
                                        bgcolor: '#fafafa'
                                    }}
                                >
                                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Box
                                            aria-hidden="true"
                                            sx={{
                                                width: 9,
                                                height: 9,
                                                flexShrink: 0,
                                                borderRadius: '50%',
                                                bgcolor: value.business_type === 'WHOLESALE' ? '#d97706' : '#2563eb'
                                            }}
                                        />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                                <Typography sx={{ fontWeight: 800 }}>{value.product_name}</Typography>
                                                {value.business_type === 'WHOLESALE' &&
                                                    <Chip size="small" variant="outlined" color="warning" label={String(value.packaging || 'Box').toUpperCase()} />
                                                }
                                                {Number(value.sale_price) > 0 &&
                                                    <Chip size="small" color="error" label="SALE" sx={{ fontWeight: 900 }} />
                                                }
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">{productSizeLabel(value)}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            color={value.business_type === 'WHOLESALE' ? 'warning' : 'primary'}
                                            label={value.business_type === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL'}
                                        />
                                        <Chip size="small" color="success" label={`Stock ${availableProductStock(value)}`} />
                                        <Typography sx={{ minWidth: 82, textAlign: 'right', fontWeight: 800 }}>
                                            {numberFormat(value.new_price)}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            }

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="shop-order-quantity">Quantity</InputLabel>
                                    <Input
                                        type="number"
                                        id="shop-order-quantity"
                                        name="shop_order_quantity"
                                        value={orderShop.shop_order_quantity}
                                        onChange={onChangeQuantity}
                                        disabled={!selectedProductReady}
                                    />
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="shop-order-price">Price</InputLabel>
                                    <Input
                                        type="number"
                                        id="shop-order-price"
                                        name="fixed_price"
                                        value={orderShop.fixed_price}
                                        startAdornment={<InputAdornment position="start">PHP</InputAdornment>}
                                        disabled={!selectedProductReady}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="discount-select-label">Discount</InputLabel>
                                    <Select
                                        labelId="discount-select-label"
                                        id="discount-select"
                                        value={orderShop.discount}
                                        name="discount"
                                        label="Discount"
                                        onChange={onChangeDiscount}
                                        disabled={shopOrderTransaction.checker !== 0}
                                    >
                                        <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                        <MenuItem value="AMOUNT">Amount</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="shop-order-total">Total Price</InputLabel>
                                    <Input
                                        id="shop-order-total"
                                        name="shop_order_total_price"
                                        value={orderShop.shop_order_total_price}
                                        onChange={onChangeInput}
                                        startAdornment={<InputAdornment position="start">PHP</InputAdornment>}
                                        disabled
                                    />
                                </FormControl>
                            </Box>

                            {orderShop.discount &&
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="discount-value">
                                            {orderShop.discount === 'PERCENTAGE' ? 'Discount Percentage' : 'Discount Amount'}
                                        </InputLabel>
                                        <Input
                                            id="discount-value"
                                            name="discount_percentage"
                                            value={orderShop.discount_percentage}
                                            onChange={orderShop.discount === 'PERCENTAGE' ? onChangeMarkUpPercentage : onChangeMarkUpPrice}
                                            startAdornment={orderShop.discount === 'AMOUNT' ? <InputAdornment position="start">PHP</InputAdornment> : null}
                                            endAdornment={orderShop.discount === 'PERCENTAGE' ? <InputAdornment position="end">%</InputAdornment> : null}
                                        />
                                    </FormControl>

                                    <TextField
                                        label="Discount Value"
                                        value={numberFormat(orderShop.discount_amount || 0)}
                                        disabled
                                    />
                                </Box>
                            }

                            {submitLoadingAdd && <LinearProgress color="warning" />}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isAddDisabled}
                                    startIcon={<AddShoppingCartIcon />}
                                    size="large"
                                >
                                    Add Product
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>

                <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', overflow: 'hidden', mb: 2 }}>
                    <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Products in Order</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Review, edit, or remove items before finalizing.
                        </Typography>
                    </Box>
                    <TableContainer sx={{ mt: 2 }}>
                        <Table sx={{ minWidth: 860 }} aria-label="shop order items">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Qty.</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Unit</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Discount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderShopDTO.shopOrderList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                            <Typography sx={{ fontWeight: 600 }}>No products added yet</Typography>
                                            <Typography variant="body2" color="text.secondary">Select a product above to start building this order.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : orderShopDTO.shopOrderList.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600 }}>{row.product_name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{itemDescription(row)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                        <TableCell align="right">{row.unit}</TableCell>
                                        <TableCell align="right">{numberFormat(row.fixed_price)}</TableCell>
                                        <TableCell align="right">{discountText(row)}</TableCell>
                                        <TableCell align="right">{numberFormat(row.shop_order_price)}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>{numberFormat(row.shop_order_total_price)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Update">
                                                <IconButton onClick={(e) => handleOpen(row.id, e)} color="primary">
                                                    <UpdateIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={(e) => openDelete(row.id, e)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell colSpan={6} sx={{ fontWeight: 800 }}>Grand Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>{numberFormat(invoiceTotal || 0)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={finalizeOrder}
                        disabled={orderShopDTO.shopOrderList.length === 0}
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Next
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{shopOrderTransaction.requestor_name}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Reference Number: #{shopOrderTransaction.id}
                    </Typography>
                    <Stack spacing={1}>
                        {orderShopDTO.shopOrderList.map((row) => (
                            <Typography key={row.id} variant="body2">
                                {row.shop_order_quantity} x {numberFormat(row.shop_order_price)} - {row.product_name} {itemDescription(row)}
                                {row.discount === 'PERCENTAGE' ? `, Disc ${row.discount_percentage}% -${row.discount_amount}` : row.discount === 'AMOUNT' ? `, Disc -${row.discount_amount}` : ''} = {numberFormat(row.shop_order_total_price)}
                            </Typography>
                        ))}
                    </Stack>
                    {/* <Divider sx={{ my: 2 }} /> */}
                    <Typography sx={{ fontWeight: 800 }}>Total: {numberFormat(orderShopDTO.shopOrderTransaction.shop_order_transaction_total_price || 0)}</Typography>
                </Paper>

                <Dialog
                    open={deleteOpenModal}
                    onClose={handleDeleteCloseModal}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">Delete product?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">
                            This item will be removed from the order.
                        </Typography>
                        {submitLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <CircularProgress />
                            </Box>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                        <Button color="error" variant="contained" onClick={(e) => deleteOrderTransaction(deleteId, e)} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                            Update Product
                        </Typography>
                        {validatorModal.isShow &&
                            <Alert variant="filled" severity={validatorModal.severity} sx={{ mb: 2 }}>{validatorModal.message}</Alert>
                        }
                        {submitLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CircularProgress />
                            </Box>
                        }
                        <Stack spacing={2}>
                            <TextField
                                disabled
                                label="Product Name"
                                variant="filled"
                                name="product_name"
                                value={orderSupplierModal.product_name}
                            />

                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="update-shop-order-price">Price</InputLabel>
                                <Input
                                    id="update-shop-order-price"
                                    name="shop_order_price"
                                    value={orderSupplierModal.shop_order_price}
                                    onChange={onChangeInputPriceModal}
                                    startAdornment={<InputAdornment position="start">PHP</InputAdornment>}
                                />
                            </FormControl>

                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="update-shop-order-quantity">Quantity</InputLabel>
                                <Input
                                    type="number"
                                    id="update-shop-order-quantity"
                                    name="quantity"
                                    value={orderSupplierModal.shop_order_quantity}
                                    onChange={onChangeInputQuantityModal}
                                />
                            </FormControl>

                            <TextField
                                disabled
                                label="Total Price"
                                variant="filled"
                                name="total_price"
                                value={numberFormat(orderSupplierModal.shop_order_total_price || 0)}
                            />

                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    onClick={updateOrderSupplier}
                                    disabled={submitLoading}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}

export default AddProductCustomerOrderTransaction



