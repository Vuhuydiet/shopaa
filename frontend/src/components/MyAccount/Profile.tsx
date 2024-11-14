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
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import './ProfileStyle.css';
import dayjs from 'dayjs';
import { useUser } from '../../context/UserContext';
import { updateUserProfile } from '../../service/userService';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Title } = Typography;

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
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
    const isUnder1MB = file.size / 1024 / 1024 <= 1; // 1MB

    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    if (!isUnder1MB) {
      message.error('Image must be smaller than 1MB!');
      return false;
    }

    setImage(file);
    return false;
  };

  const handleSave = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const { fullname, birthday, phone, gender } = values;

    const updatedProfileData = {
      fullname: fullname,
      dateOfBirth: birthday ? dayjs(birthday).utc().toISOString() : null,
      phoneNumber: phone,
      gender: gender,
    };
    const token = localStorage.getItem('token') || '';
    try {
      await updateUserProfile(token, updatedProfileData, image || null);
      message.success('Update profile successfully!');
      refreshUser();
      setLoading(false);
    } catch (error) {
      console.error('', error);
    }
  };

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
                    style={{
                      width: '100%',
                    }}
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
                  src={image ? URL.createObjectURL(image) : `${user?.avatar}`}
                  icon={image ? null : <UserOutlined />}
                  style={{ marginBottom: '10px' }}
                  className="avatar-custom"
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/uploadImage"
                  beforeUpload={beforeUpload}
                  accept="image/*"
                >
                  <Button
                    icon={<UploadOutlined style={{ color: '#8A2BE2' }} />}
                  >
                    Choose Image
                  </Button>
                </Upload>
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '14px',
                    color: '#8A2BE2',
                  }}
                >
                  <small>Only images under 1MB are allowed.</small>
                </div>
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
            <div style={{ marginTop: '30px' }}>
              {loading ? (
                <Spin />
              ) : (
                <Button
                  type="primary"
                  onClick={handleSave}
                  style={{
                    padding: '20px',
                    fontSize: '14px',
                  }}
                >
                  Save changes
                </Button>
              )}
            </div>
          </Col>
        </Card>
      </div>
    </>
  );
};

export default Profile;
