import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Radio,
  Typography,
  Upload,
  DatePicker,
} from 'antd';
import { useState } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import './ProfileStyle.css';
import { UploadChangeParam } from 'antd/es/upload';
import dayjs from 'dayjs';

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | null>(null);
  const fullname = 'Nguyen Le Thanh Truc';
  const birthday = '12/12/2005';
  const phone = '09323948508';
  const gender = 'female';
  const formattedBirthday = dayjs(birthday, 'DD/MM/YYYY');

  const handleImageChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      setImage(info.file.response.url);
    } else if (info.file.status === 'error') {
      console.error('Image upload failed');
    }

    console.log('click button select image avatar');
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      alert('You can only upload image files!');
    }
    // Nếu là ảnh, thì lưu URL của ảnh tạm thời vào state và return false để ngừng upload ngay lập tức
    const url = URL.createObjectURL(file);
    setImage(url);
    return false;
  };
  const handleSave = () => {
    console.log('click button save information');
  };
  return (
    <>
      <div>
        <Card style={{ padding: '20px' }}>
          <Title level={2} style={{ textAlign: 'left', marginLeft: '30px' }}>
            My Profile
          </Title>

          <Form
            form={form}
            layout="inline"
            style={{ width: '100%' }}
            initialValues={{
              fullname: fullname,
              birthday: formattedBirthday,
              phone: phone,
              gender: gender,
              image: image,
            }}
          >
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={16}>
                <Form.Item
                  label="Full name"
                  name="fullname"
                  labelCol={{ flex: '100px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Birthday"
                  name="birthday"
                  labelCol={{ flex: '100px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select Birthday"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  labelCol={{ flex: '100px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the bank account number',
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: 'Phone number must have 10 digits',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  labelCol={{ flex: '100px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                >
                  <Radio.Group className="custom-radio">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  size={150}
                  src={image ? image : null}
                  icon={image ? null : <UserOutlined />}
                  style={{ marginBottom: '10px' }}
                  className="avatar-custom"
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/uploadImage"
                  beforeUpload={beforeUpload}
                  onChange={handleImageChange}
                >
                  <Button
                    icon={<UploadOutlined style={{ color: '#8A2BE2' }} />}
                  >
                    Choose Image
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Form>

          <Col
            span={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              type="primary"
              onClick={handleSave}
              style={{
                marginTop: '30px',
                padding: '20px',
                fontSize: '14px',
              }}
            >
              Save changes
            </Button>
          </Col>
        </Card>
      </div>
    </>
  );
};

export default Profile;
