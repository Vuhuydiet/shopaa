import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './UpLoadProductFromStyle.css';
import { useCategories } from '../../service/api/useCategories';
import { ICategory } from '../../interfaces/ICategory';
import axios from 'axios';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';

const { Option } = Select;

interface ProductData {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  brand?: string;
  categories?: number[];
}

const UploadProductForm: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    price: 0,
    quantity: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Use useNavigate hook

  const { data: categories } = useCategories();
  const curCategories = categories;

  const handlePreviewUrl = (file: RcFile) => {
    return {
      ...file,
      preview: URL.createObjectURL(file),
    };
  };

  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setImageFiles(
      fileList.map((file) =>
        file.originFileObj
          ? {
              ...file,
              preview: URL.createObjectURL(file.originFileObj as RcFile),
            }
          : file,
      ),
    );
  };

  const handleSubmit = async () => {
    console.log('HandleSubmit');
    const formData = new FormData();
    const updatedProductData = {
      ...productData,
      categories: {
        add: productData.categories,
      },
    };
    console.log('Updated productData with categories:', updatedProductData);

    formData.append('productData', JSON.stringify(updatedProductData));
    imageFiles.forEach((file) => {
      formData.append('images', file.originFileObj as Blob);
    });
    console.log('Form data: ', formData);
    console.log('formData:', productData);
    console.log('Categories in formData:', productData.categories);
    setLoading(true);
    try {
      const response = await axios.post(AUTH_API_ENDPOINTS.PRODUCTS, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        message.success('Product uploaded successfully!');
        navigate('/manager-shop/list-product'); // Use navigate to redirect after success
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios error: ',
          error.response ? error.response.data : error.message,
        );
        message.error(
          `Error uploading product: ${error.response ? error.response.data.message : error.message}`,
        );
      } else {
        console.error('Unexpected error: ', error);
        message.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-product-form">
      <h2 style={{ textAlign: 'center', color: 'black', marginBottom: '30px' }}>
        NEW PRODUCT
      </h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Col span={16}>
            {' '}
            <Form.Item
              label="Product Name"
              name="name"
              required
              rules={[{ required: true, message: 'Product name is required!' }]}
            >
              <Input
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
                placeholder="Enter product name"
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
                    typeof value === 'number'
                      ? Promise.resolve()
                      : Promise.reject(new Error('Price must be a number!')),
                },
              ]}
            >
              <InputNumber
                value={productData.price}
                onChange={(value) =>
                  setProductData({ ...productData, price: value! })
                }
                placeholder="0.1"
                min={0.1}
                step={0.1}
                style={{ width: '100%' }}
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
                    typeof value === 'number'
                      ? Promise.resolve()
                      : Promise.reject(new Error('Quantity must be a number!')),
                },
              ]}
            >
              <InputNumber
                value={productData.quantity}
                onChange={(value) =>
                  setProductData({ ...productData, quantity: value! })
                }
                placeholder="0"
                min={1}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Brand" name="brand">
              <Input
                value={productData.brand}
                onChange={(e) =>
                  setProductData({ ...productData, brand: e.target.value })
                }
                placeholder="Enter brand"
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
                value={productData.categories}
                onChange={(values) =>
                  setProductData({ ...productData, categories: values })
                }
                placeholder="Select categories"
                showSearch
                filterOption={(input, option) => {
                  const label = option?.label;
                  if (typeof label === 'string') {
                    return label.toLowerCase().includes(input.toLowerCase());
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

        <Form.Item label="Description" name="descripton">
          <Input.TextArea
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
            placeholder="Enter product description"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Product Images"
          name="productImages"
          required
          rules={[
            { required: true, message: 'At least one image is required!' },
          ]}
        >
          <Upload
            name="images"
            listType="picture-card"
            fileList={imageFiles}
            beforeUpload={(file: RcFile) => {
              const fileWithPreview = handlePreviewUrl(file);
              setImageFiles((prevFiles) => [...prevFiles, fileWithPreview]);
              return false;
            }}
            onChange={handleImageChange}
            multiple
            showUploadList={{ showRemoveIcon: true }}
            accept="image/*"
          >
            {imageFiles.length >= 5 ? null : (
              <div>
                <PlusOutlined /> Upload
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="button">
          {loading ? (
            <Spin />
          ) : (
            <>
              <Space>
                <Button onClick={() => navigate('/manager-shop/list-product')}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Upload Product
                </Button>
              </Space>
            </>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadProductForm;
