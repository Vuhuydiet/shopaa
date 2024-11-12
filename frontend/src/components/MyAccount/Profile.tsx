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
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import './ProfileStyle.css';
//import { UploadChangeParam } from 'antd/es/upload';
import dayjs from 'dayjs';
import { useUser } from '../../context/UserContext';
import { updateUserProfile } from '../../service/userService';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null);

  const { user, refreshUser } = useUser();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullname: user.fullname || '',
        birthday: user.dateOfBirth ? dayjs(user.dateOfBirth).utc() : null,
        phone: user.phoneNumber || '',
        gender: user.gender || '',
      });
      if (user.avatar) {
        setImage(null);
      }
    }
  }, [user, form]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      alert('You can only upload image files!');
    }
    // Nếu là ảnh, thì lưu URL của ảnh tạm thời vào state và return false để ngừng upload ngay lập tức
    // const url = URL.createObjectURL(file);
    setImage(file);
    return false;
  };

  const handleSave = async () => {
    console.log('click button save information');
    const values = await form.validateFields();
    const { fullname, birthday, phone, gender } = values;

    const updatedProfileData = {
      fullname: fullname,
      dateOfBirth: null,
      // dateOfBirth: birthday ? dayjs(birthday).utc().toISOString() : null,
      phoneNumber: phone,
      gender: gender,
    };
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    console.log(updatedProfileData);

    try {
      if (image) {
        await updateUserProfile(token, updatedProfileData, image);
      } else {
        await updateUserProfile(token, updatedProfileData, null);
      }
      message.success('Update profile successfully!');
      refreshUser();
    } catch (error) {
      console.error('', error);
    }
  };

  console.log(user);
  return (
    <>
      <div>
        <Card style={{ padding: '20px' }}>
          <Title level={2} style={{ textAlign: 'left', marginLeft: '30px' }}>
            My Profile
          </Title>

          <Form form={form} layout="inline" style={{ width: '100%' }}>
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={16}>
                <Form.Item
                  label="Full name"
                  name="fullname"
                  labelCol={{ flex: '100px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your full name',
                    },
                  ]}
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
                  rules={[
                    {
                      required: true,
                      message: 'Please select your birthday',
                    },
                    {
                      validator: (_, value) => {
                        if (value && dayjs().diff(value, 'years') < 18) {
                          return Promise.reject('You must be over 18.');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select Birthday"
                    format="DD/MM/YYYY"
                    showTime={false}
                    picker="date"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf('day')
                    }
                    onOpenChange={(open) => {
                      if (open) {
                        document
                          .querySelector('.ant-picker-year-panel')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
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
                      message: 'Please enter the phone number',
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
                  src={image ? URL.createObjectURL(image) : user?.avatar}
                  icon={image ? null : <UserOutlined />}
                  style={{ marginBottom: '10px' }}
                  className="avatar-custom"
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/uploadImage"
                  beforeUpload={beforeUpload}
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
