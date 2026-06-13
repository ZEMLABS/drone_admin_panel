import React, {
  useEffect,
  useState,
} from 'react';

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  createProductApi,
  getCategoriesApi,
  getProductByIdApi,
  updateProductApi,
} from '../api/productApi';

import {
  getImageUrl,
  uploadImageApi,
} from '../api/imageApi';

import DeleteIcon from '@mui/icons-material/Delete';

export default function AddEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [displayImageFile, setDisplayImageFile] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState('');

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    discountedPrice: '',
    categoryId: '',
    displayImageId: '',
    imageIds: [],
    features: [
      {
        icon: '',
        title: '',
        desc: '',
      },
    ],
    isFeatured: false,
    inStock: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi();

        setCategories(
          response.data.data ||
          response.data ||
          [],
        );
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductByIdApi(id);
        const product = response.data.data || response.data;

        setForm({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          longDescription: product.longDescription || '',
          price: product.price || '',
          discountedPrice: product.discountedPrice || '',
          categoryId: product.categoryId || '',
          displayImageId: product.displayImageId || '',
          imageIds: product.imageIds || [],
          features: product.features?.length
            ? product.features
            : [
                {
                  icon: '',
                  title: '',
                  desc: '',
                },
              ],
          isFeatured: Boolean(product.isFeatured),
          inStock: product.inStock ?? true,
        });

        if (product.displayImageId) {
          setDisplayImagePreview(
            getImageUrl(product.displayImageId),
          );
        }

        if (product.imageIds?.length) {
          setGalleryPreviews(
            product.imageIds.map((imageId) =>
              getImageUrl(imageId),
            ),
          );
        }
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleDisplayImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setDisplayImageFile(file);
    setDisplayImagePreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      displayImageId: '',
    }));
  };

  const handleGalleryImagesSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setGalleryFiles((prev) => [...prev, ...files]);

    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    setErrors((prev) => ({
      ...prev,
      imageIds: '',
    }));
  };

  const removeGalleryImage = (index) => {
    const existingImagesCount = form.imageIds.length;

    if (index < existingImagesCount) {
      setForm((prev) => ({
        ...prev,
        imageIds: prev.imageIds.filter((_, i) => i !== index),
      }));
    } else {
      const fileIndex = index - existingImagesCount;

      setGalleryFiles((prev) =>
        prev.filter((_, i) => i !== fileIndex),
      );
    }

    setGalleryPreviews((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleCheckboxChange = (event) => {
    const {
      name,
      checked,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFeatureChange = (index, key, value) => {
    const updatedFeatures = [...form.features];

    updatedFeatures[index][key] = value;

    setForm((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: '',
          title: '',
          desc: '',
        },
      ],
    }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!form.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (!form.longDescription.trim()) {
      newErrors.longDescription = 'Long description is required';
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!form.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!displayImageFile && !form.displayImageId) {
      newErrors.displayImageId = 'Display image is required';
    }

    if (!galleryFiles.length && !form.imageIds.length) {
      newErrors.imageIds = 'At least one product image is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      toast.error('Please fix highlighted fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading || uploading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setUploading(true);

      let displayImageId = form.displayImageId;

      if (displayImageFile) {
        const displayResponse = await uploadImageApi(displayImageFile);

        displayImageId =
          displayResponse.data.imageId ||
          displayResponse.data.id ||
          displayResponse.data.data?.id;
      }

      const uploadedGalleryImageIds = [];

      for (const file of galleryFiles) {
        const response = await uploadImageApi(file);

        const imageId =
          response.data.imageId ||
          response.data.id ||
          response.data.data?.id;

        uploadedGalleryImageIds.push(imageId);
      }

      const finalImageIds = [
        ...form.imageIds,
        ...uploadedGalleryImageIds,
      ];

      const payload = {
        name: form.name,
        short_description: form.shortDescription,
        long_description: form.longDescription,
        price: Number(form.price),
        discounted_price: form.discountedPrice
          ? Number(form.discountedPrice)
          : null,
        category_id: Number(form.categoryId),
        display_image_id: Number(displayImageId),
        image_ids: finalImageIds.map(String),
        features: form.features.filter(
          (feature) => feature.title || feature.desc,
        ),
        is_featured: form.isFeatured,
        in_stock: form.inStock,
      };

      if (isEditMode) {
        await updateProductApi(id, payload);
        toast.success('Product updated successfully');
      } else {
        await createProductApi(payload);
        toast.success('Product added successfully');
      }

      navigate('/products');
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (isEditMode
            ? 'Failed to update product'
            : 'Failed to add product'),
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        mb: 6,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </Typography>

          <Typography color="text.secondary">
            {isEditMode
              ? 'Update drone product'
              : 'Create a new drone product'}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
        >
          Back
        </Button>
      </Stack>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Discounted Price"
              name="discountedPrice"
              type="number"
              value={form.discountedPrice}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              error={!!errors.categoryId}
              helperText={errors.categoryId}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              error={!!errors.shortDescription}
              helperText={errors.shortDescription}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Long Description"
              name="longDescription"
              value={form.longDescription}
              onChange={handleChange}
              error={!!errors.longDescription}
              helperText={errors.longDescription}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Display Image
            </Typography>

            <Button
              variant="outlined"
              component="label"
              disabled={uploading}
            >
              {isEditMode ? 'Change Display Image' : 'Upload Display Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleDisplayImageSelect}
              />
            </Button>

            {errors.displayImageId && (
              <Typography color="error" mt={1}>
                {errors.displayImageId}
              </Typography>
            )}

            {displayImagePreview && (
              <Box
                component="img"
                src={displayImagePreview}
                sx={{
                  display: 'block',
                  mt: 2,
                  width: 140,
                  height: 140,
                  objectFit: 'contain',
                  background: '#fff',
                  borderRadius: 2,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Gallery Images
            </Typography>

            <Button
              variant="outlined"
              component="label"
              disabled={uploading}
            >
              Upload Gallery Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleGalleryImagesSelect}
              />
            </Button>

            {errors.imageIds && (
              <Typography color="error" mt={1}>
                {errors.imageIds}
              </Typography>
            )}

            <Stack
              direction="row"
              gap={2}
              flexWrap="wrap"
              mt={2}
            >
              {galleryPreviews.map((preview, index) => (
                <Box
                  key={`${preview}-${index}`}
                  sx={{
                    position: 'relative',
                    width: 110,
                    height: 110,
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <Box
                    component="img"
                    src={preview}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeGalleryImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: '#fff',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mb={2}>
              Features
            </Typography>

            <Stack spacing={2}>
              {form.features.map((feature, index) => (
                <Stack
                  key={index}
                  direction={{
                    xs: 'column',
                    md: 'row',
                  }}
                  spacing={2}
                >
                  <TextField
                    label="Icon"
                    value={feature.icon}
                    onChange={(event) =>
                      handleFeatureChange(
                        index,
                        'icon',
                        event.target.value,
                      )
                    }
                  />

                  <TextField
                    label="Title"
                    value={feature.title}
                    onChange={(event) =>
                      handleFeatureChange(
                        index,
                        'title',
                        event.target.value,
                      )
                    }
                  />

                  <TextField
                    label="Description"
                    fullWidth
                    value={feature.desc}
                    onChange={(event) =>
                      handleFeatureChange(
                        index,
                        'desc',
                        event.target.value,
                      )
                    }
                  />

                  {form.features.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              ))}
            </Stack>

            <Button
              sx={{
                mt: 2,
              }}
              onClick={addFeature}
            >
              Add Feature
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleCheckboxChange}
                />
              }
              label="Featured"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleCheckboxChange}
                />
              }
              label="In Stock"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              disabled={loading || uploading}
              onClick={handleSubmit}
            >
              {loading || uploading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                'Update Product'
              ) : (
                'Submit Product'
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}