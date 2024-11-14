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
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './UpLoadProductFromStyle.css';

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

  const handlePreviewUrl = (file: RcFile) => {
    // Tạo URL xem trước và trả về tệp với thuộc tính preview
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

  //============================================

  const [productData, setProductData] = useState<ProductData>({
    name: '',
    price: 0,
    quantity: 0,
  });

  // const [imageFiles, setImageFiles] = useState<RcFile[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook

  // const handleImageChange = (info: UploadChangeParam) => {
  //   if (info.file.status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully`);
  //   } else if (info.file.status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // };

  const handleSubmit = async () => {
    // const formData = new FormData();
    // formData.append('productData', JSON.stringify(productData));
    // imageFiles.forEach((file) => {
    //   formData.append('images', file);
    // });
    // setLoading(true);
    // try {
    //   const response = await axios.post('YOUR_API_URL_HERE', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   if (response.status === 200) {
    //     message.success('Product uploaded successfully!');
    //     navigate('/your-success-page'); // Use navigate to redirect after success
    //   }
    // } catch (error) {
    //   message.error('Error uploading product');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="upload-product-form">
      <h2 style={{ textAlign: 'center', color: 'black', marginBottom: '30px' }}>
        NEW PRODUCT
      </h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Col span={12}>
            {' '}
            <Form.Item label="Product Name" required>
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
            <Form.Item label="Price ($)" required>
              <InputNumber
                value={productData.price}
                onChange={(value) =>
                  setProductData({ ...productData, price: value! })
                }
                min={0}
                step={0.1}
                placeholder="Enter price"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Quantity" required>
              <InputNumber
                value={productData.quantity}
                onChange={(value) =>
                  setProductData({ ...productData, quantity: value! })
                }
                min={0}
                placeholder="Enter quantity"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Brand">
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
          <Col span={18}>
            {' '}
            <Form.Item label="Categories">
              <Select
                mode="multiple"
                value={productData.categories}
                onChange={(values) =>
                  setProductData({ ...productData, categories: values })
                }
                placeholder="Select categories"
              >
                <Option value={1}>Category 1</Option>
                <Option value={2}>Category 2</Option>
                <Option value={3}>Category 3</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description">
          <Input.TextArea
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
            placeholder="Enter product description"
            rows={4}
          />
        </Form.Item>

        {/* =================================================================== */}
        {/* <Form.Item label="Product Images" required>
          <Upload
            name="images"
            listType="picture-card"
            fileList={imageFiles}
            beforeUpload={(file) => {
              setImageFiles((prevFiles) => [
                ...prevFiles,
                {
                  ...file,
                  preview: URL.createObjectURL(file),
                },
              ]);
              return false; // Ngăn tự động tải lên
            }}
            onChange={handleImageChange}
            multiple
            showUploadList={{ showRemoveIcon: true }}
          >
            {imageFiles.length >= 5 ? null : (
              <div>
                <PlusOutlined /> Upload
              </div>
            )}
          </Upload>
        </Form.Item>
        
        */}

        <Form.Item label="Product Images" required>
          <Upload
            name="images"
            listType="picture-card"
            fileList={imageFiles}
            beforeUpload={(file: RcFile) => {
              const fileWithPreview = handlePreviewUrl(file);
              setImageFiles((prevFiles) => [...prevFiles, fileWithPreview]);
              return false; // Ngăn tự động tải lên
            }}
            onChange={handleImageChange}
            multiple
            showUploadList={{ showRemoveIcon: true }}
          >
            {imageFiles.length >= 5 ? null : (
              <div>
                <PlusOutlined /> Upload
              </div>
            )}
          </Upload>
        </Form.Item>
        {/* ================================== */}

        <Form.Item>
          <Space>
            <Button onClick={() => navigate('/your-cancel-page')}>
              Cancel
            </Button>{' '}
            {/* Use navigate for cancel */}
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? 'Uploading...' : 'Upload Product'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadProductForm;
