import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
    useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
    deleteProductApi,
    getProductsApi,
} from '../api/productApi';

import {
    getImageUrl,
} from '../api/imageApi';

export default function ProductList() {
    const [products, setProducts] =
        useState([]);

    const [search, setSearch] =
        useState('');

    const [loading, setLoading] =
        useState(true);

    const [deletingId, setDeletingId] =
        useState(null);

    const navigate =
        useNavigate();

    const fetchProducts =
        async () => {
            try {
                setLoading(true);

                const response =
                    await getProductsApi();

                setProducts(
                    response.data.data || [],
                );
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        'Failed to load products',
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered =
        useMemo(() => {
            const keyword =
                search.toLowerCase();

            return products.filter(
                (product) => {
                    const name =
                        product.name || '';

                    const shortDescription =
                        product.short_description ||
                        '';

                    const longDescription =
                        product.long_description ||
                        '';

                    return (
                        name
                            .toLowerCase()
                            .includes(keyword) ||
                        shortDescription
                            .toLowerCase()
                            .includes(keyword) ||
                        longDescription
                            .toLowerCase()
                            .includes(keyword)
                    );
                },
            );
        }, [
            products,
            search,
        ]);

    const handleDelete =
        async (
            productId,
        ) => {
            const confirmDelete =
                window.confirm(
                    'Are you sure you want to delete this product?',
                );

            if (!confirmDelete) {
                return;
            }

            try {
                setDeletingId(
                    productId,
                );

                await deleteProductApi(
                    productId,
                );

                toast.success(
                    'Product deleted',
                );

                fetchProducts();
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        'Failed to delete product',
                );
            } finally {
                setDeletingId(null);
            }
        };

    if (loading) {
        return (
            <Box
                minHeight="70vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 5,
            }}
        >
            <Stack
                direction={{
                    xs: 'column',
                    md: 'row',
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: 'stretch',
                    md: 'center',
                }}
                spacing={2}
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Manage Products
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Add, edit and delete drone products.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        navigate(
                            '/products/add-product',
                        )
                    }
                >
                    Add Product
                </Button>
            </Stack>

            <TextField
                label="Search products"
                variant="outlined"
                fullWidth
                sx={{
                    mb: 3,
                }}
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value,
                    )
                }
            />

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Image
                            </TableCell>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Price
                            </TableCell>

                            <TableCell>
                                Stock
                            </TableCell>

                            <TableCell>
                                Featured
                            </TableCell>

                            <TableCell>
                                Created At
                            </TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map(
                            (
                                product,
                            ) => (
                                <TableRow
                                    key={
                                        product.id
                                    }
                                    hover
                                >
                                    <TableCell>
                                        {product.display_image_id ? (
                                            <Box
                                                component="img"
                                                src={getImageUrl(
                                                    product.display_image_id,
                                                )}
                                                alt={
                                                    product.name
                                                }
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    objectFit:
                                                        'contain',
                                                    background:
                                                        '#fff',
                                                    borderRadius:
                                                        1,
                                                }}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {
                                            product.id
                                        }
                                    </TableCell>

                                    <TableCell>
                                        <Typography fontWeight={600}>
                                            {
                                                product.name
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            noWrap
                                            sx={{
                                                maxWidth: 320,
                                            }}
                                        >
                                            {
                                                product.short_description ||
                                                product.long_description ||
                                                '-'
                                            }
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        ₹
                                        {Number(
                                            product.price ||
                                                0,
                                        ).toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={
                                                product.in_stock
                                                    ? 'In Stock'
                                                    : 'Out of Stock'
                                            }
                                            color={
                                                product.in_stock
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {
                                            product.is_featured
                                                ? 'Yes'
                                                : 'No'
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {product.created_at
                                            ? new Date(
                                                  product.created_at,
                                              ).toLocaleString()
                                            : '-'}
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                navigate(
                                                    `/products/edit-product/${product.id}`,
                                                )
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            disabled={
                                                deletingId ===
                                                product.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    product.id,
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ),
                        )}

                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    align="center"
                                >
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}