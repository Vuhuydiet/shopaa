import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  InputNumber,
  Select,
  Space,
  Row,
  Col,
  Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useLocation, useNavigate } from 'react-router-dom';
import './UpLoadProductFromStyle.css';
import { useCategories } from '../../service/api/useCategories';
import { ICategory } from '../../interfaces/ICategory';
import axios from 'axios';
import { PRODUCT_API_ENDPOINTS } from '../../config/API_config';

const { Option } = Select;

const UpdateProductForm: React.FC = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [initialCategories, setInitialCategories] = useState<number[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [originalImages, setOriginalImages] = useState<UploadFile[]>([]);
  const [newImages, setNewImages] = useState<UploadFile[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Use useNavigate hook
  const [form] = Form.useForm();
  const { data: categories } = useCategories();
  const curCategories = categories;

  useEffect(() => {
    if (product) {
      const initialImages = product.images.map((item: any) => ({
        uid: item.id.toString(),
        name: item.publicId,
        status: 'done',
        url: item.url,
      }));
      setImageFiles(initialImages);
      setOriginalImages(initialImages);
      form.setFieldsValue({
        name: product.name,
        price: product.currentPrice,
        quantity: product.quantity,
        brand: product.brand,
        size: product.sizes.join(', '),
        color: product.colors.join(', '),
        material: product.material,
        origin: product.origin,
        description: product.description,
        categories: product.categories.map((cat: ICategory) => cat.id),
        productImages: imageFiles,
      });
      setInitialCategories(product.categories.map((cat: ICategory) => cat.id));
    }
  }, [product]);
  console.log('PRODUCT DETAIL UPDATEPRODUCTFORM: ', product);

  const handlePreviewUrl = (file: RcFile) => {
    return {
      ...file,
      preview: URL.createObjectURL(file),
    };
  };

  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setImageFiles(fileList);

    const newlyUploadedFiles = fileList.filter((file) => !!file.originFileObj);

    // Thêm preview URL cho các file mới
    const newImageFiles = newlyUploadedFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file.originFileObj as RcFile),
    }));

    setNewImages(newImageFiles);
  };

  const handleRemoveImage = (file: UploadFile) => {
    setImageFiles((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const handleSubmit = async () => {
    console.log('HandleSubmit');
    setLoading(true);
    const formValues = form.getFieldsValue();

    const currentCategories = formValues.categories || [];

    const addCategories = currentCategories.filter(
      (catId: number) => !initialCategories.includes(catId),
    );
    const removeCategories = initialCategories.filter(
      (catId: number) => !currentCategories.includes(catId),
    );
    const removedImageIds = originalImages
      .filter(
        (original) => !imageFiles.some((file) => file.uid === original.uid),
      )
      .map((file) => parseInt(file.uid));
    const productData = {
      name: formValues.name,
      price: formValues.price,
      quantity: formValues.quantity,
      brand: formValues.brand || '',
      description: formValues.description || '',
      material: formValues.material || '',
      origin: formValues.origin || '',
      colors: formValues.color?.split(',').map((color: string) => color.trim()),
      sizes: formValues.size?.split(',').map((size: string) => size.trim()),
      categories: {
        add: addCategories,
        remove: removeCategories,
      },
      images: {
        remove: removedImageIds,
      },
    };

    const formData = new FormData();
    formData.append('productData', JSON.stringify(productData));
    newImages.forEach((file) => {
      formData.append('images', file.originFileObj as Blob);
    });

    console.log('Images: ', newImages);
    console.log('Form Data: ', formData);
    console.log('ProductData: ', productData);
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setLoading(false);
      message.error('error token');
      return;
    }
    try {
      const response = await axios.patch(
        `${PRODUCT_API_ENDPOINTS.PRODUCTS}/${product.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        message.success('Product updated successfully!');
        navigate('/manager-shop/list-product');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios error: ',
          error.response ? error.response.data : error.message,
        );
        message.error(
          `Error updating product: ${error.response ? error.response.data.message : error.message}`,
        );
      } else {
        console.error('Unexpected error: ', error);
        message.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    form.setFieldsValue({
      name: product.name,
      price: product.currentPrice,
      quantity: product.quantity,
      brand: product.brand,
      size: product.sizes.join(', '),
      color: product.colors.join(', '),
      material: product.material,
      origin: product.origin,
      description: product.description,
      categories: product.categories.map((cat: ICategory) => cat.id),
    });
    setImageFiles(originalImages);
  };

  return (
    <>
      <Spin spinning={loading} tip="Updating product...">
        <div className="upload-product-form">
          <h2
            style={{
              textAlign: 'center',
              color: 'black',
              marginBottom: '30px',
            }}
          >
            Product details
          </h2>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={16}>
                {' '}
                <Form.Item
                  label="Product Name"
                  name="name"
                  required
                  rules={[
                    { required: true, message: 'Product name is required!' },
                  ]}
                >
                  <Input
                    placeholder="Enter product name"
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={6}>
                {' '}
                <Form.Item
                  label="Price ($)"
                  name="price"
                  required
                  rules={[
                    { required: true, message: 'Price is required!' },
                    {
                      validator: (_, value) =>
                        value > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error('Price must be greater than 0!'),
                            ),
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="0.0"
                    min={0.0}
                    step={0.1}
                    style={{ width: '100%' }}
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  required
                  rules={[
                    { required: true, message: 'Quantity is required!' },
                    {
                      validator: (_, value) =>
                        value > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error('Quantity must be greater than 0!'),
                            ),
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Brand" name="brand">
                  <Input placeholder="Enter brand" disabled={!isEditMode} />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={9}>
                {' '}
                <Form.Item label="Size" name="size">
                  <Input
                    placeholder="Enter product size (ex: X, M, L, ..)"
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={13}>
                <Form.Item label="Color" name="color">
                  <Input
                    placeholder="Enter product color  (ex: red, blue, ...)"
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={11}>
                {' '}
                <Form.Item label="Material" name="material">
                  <Input
                    placeholder="Enter product material"
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="Origin" name="origin">
                  <Input
                    placeholder="Enter product origin"
                    disabled={!isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {' '}
                <Form.Item
                  label="Categories"
                  name="categories"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please select at least one category!',
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select categories"
                    disabled={!isEditMode}
                    showSearch
                    filterOption={(input, option) => {
                      const label = option?.label;
                      if (typeof label === 'string') {
                        return label
                          .toLowerCase()
                          .includes(input.toLowerCase());
                      }
                      return false;
                    }}
                  >
                    {curCategories?.map((category: ICategory) => {
                      return (
                        <Option
                          key={category.id}
                          value={category.id}
                          label={category.name}
                        >
                          {category.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                placeholder="Enter product description"
                rows={4}
              />
            </Form.Item>

            <Form.Item
              label="Product Images"
              name="productImages"
              required
              rules={[
                {
                  required: true,
                  validator: () =>
                    imageFiles.length > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('At least one image is required!'),
                        ),
                },
              ]}
            >
              <Upload
                name="images"
                listType="picture-card"
                fileList={imageFiles}
                onRemove={handleRemoveImage}
                beforeUpload={(file: RcFile) => {
                  const fileWithPreview = handlePreviewUrl(file);
                  setImageFiles((prevFiles) => [...prevFiles, fileWithPreview]);
                  return false;
                }}
                onChange={handleImageChange}
                multiple
                showUploadList={{ showRemoveIcon: true }}
                accept="image/*"
                disabled={!isEditMode}
              >
                {imageFiles.length >= 5 ? null : (
                  <div>
                    <PlusOutlined /> Upload
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item>
              {isEditMode ? (
                <>
                  {loading ? (
                    <Spin />
                  ) : (
                    <>
                      <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Update Product
                        </Button>
                      </Space>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </Form.Item>
          </Form>
          {!isEditMode ? (
            <>
              <Space>
                <Button onClick={() => navigate('/manager-shop/list-product')}>
                  Back
                </Button>
                <Button type="primary" onClick={() => setIsEditMode(true)}>
                  Edit
                </Button>
              </Space>
            </>
          ) : (
            <></>
          )}
        </div>
      </Spin>
    </>
  );
};

export default UpdateProductForm;
