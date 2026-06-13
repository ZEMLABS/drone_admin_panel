import React, {
    useEffect,
    useState,
} from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import toast from 'react-hot-toast';

import {
    deleteImageApi,
    getAllImagesApi,
    getImageUrl,
    uploadImageApi,
} from '../api/imageApi';

const ManageImages = () => {
    const [images, setImages] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [deleteId, setDeleteId] =
        useState(null);

    const fetchImages =
        async () => {
            try {
                setLoading(true);

                const response =
                    await getAllImagesApi();

                const imageData =
                    response.data
                        ?.unlinked ||
                    response.data
                        ?.data
                        ?.unlinked ||
                    [];

                setImages(
                    imageData,
                );
            } catch (error) {
                toast.error(
                    'Failed to load images',
                );
            } finally {
                setLoading(
                    false,
                );
            }
        };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload =
        async (
            event,
        ) => {
            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            try {
                setUploading(
                    true,
                );

                await uploadImageApi(
                    file,
                );

                toast.success(
                    'Image uploaded successfully',
                );

                fetchImages();
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        'Upload failed',
                );
            } finally {
                setUploading(
                    false,
                );
            }
        };

    const handleDelete =
        async () => {
            try {
                await deleteImageApi(
                    deleteId,
                );

                toast.success(
                    'Image deleted',
                );

                setImages(
                    (
                        prev,
                    ) =>
                        prev.filter(
                            (
                                image,
                            ) =>
                                image.id !==
                                deleteId,
                        ),
                );

                setDeleteId(
                    null,
                );
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        'Delete failed',
                );
            }
        };

    if (loading) {
        return (
            <Box
                minHeight="70vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                mb: 6,
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Manage Images
                    </Typography>

                    <Typography color="text.secondary">
                        Upload and manage product images
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    component="label"
                    startIcon={
                        <CloudUploadIcon />
                    }
                    disabled={
                        uploading
                    }
                >
                    {uploading
                        ? 'Uploading...'
                        : 'Upload Image'}

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={
                            handleUpload
                        }
                    />
                </Button>
            </Stack>

            {images.length ===
                0 && (
                <Typography>
                    No unlinked images found.
                </Typography>
            )}

            <Grid
                container
                spacing={3}
            >
                {images.map(
                    (
                        image,
                    ) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={
                                image.id
                            }
                        >
                            <Card
                                sx={{
                                    position:
                                        'relative',
                                    height:
                                        '100%',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={getImageUrl(
                                        image.id,
                                    )}
                                    alt={
                                        image.filename
                                    }
                                    sx={{
                                        objectFit:
                                            'contain',
                                        background:
                                            '#fff',
                                    }}
                                />

                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        noWrap
                                    >
                                        {
                                            image.filename
                                        }
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        ID:{' '}
                                        {
                                            image.id
                                        }
                                    </Typography>
                                </CardContent>

                                <IconButton
                                    color="error"
                                    sx={{
                                        position:
                                            'absolute',
                                        top: 8,
                                        right: 8,
                                        background:
                                            '#fff',
                                    }}
                                    onClick={() =>
                                        setDeleteId(
                                            image.id,
                                        )
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        </Grid>
                    ),
                )}
            </Grid>

            <Dialog
                open={
                    !!deleteId
                }
                onClose={() =>
                    setDeleteId(
                        null,
                    )
                }
            >
                <DialogTitle>
                    Delete this image?
                </DialogTitle>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setDeleteId(
                                null,
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleDelete
                        }
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageImages;