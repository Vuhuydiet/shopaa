import { memo, useState } from 'react';
import { IOrderDetail } from '../../interfaces/Order/IOrderDetail';
import { Button, Card, Flex, Rate, Space, Tooltip, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const desc = ['Very bad', 'Bad', 'Normal', 'Good', 'Very good'];

export const FormReview = memo(() => {
  const [value, setValue] = useState(3);

  return (
    <Card
      title="Write Review"
      style={{ padding: '1.5rem', maxWidth: '800px', margin: '20px auto' }}
    >
      <Space direction="vertical">
        <Space direction="vertical">
          <Typography.Text italic>Delivered on 07 Dec 2024</Typography.Text>
          <Typography.Text>Rate and review purchased product:</Typography.Text>
          <Space direction="horizontal" size={16} align="start">
            <Space>
              <img
                src="https://res.cloudinary.com/dwkunsgly/image/upload/v1734425447/ay8aqbecxow8iy7vnuod.webp"
                alt="Product thumbnail"
                width={100}
                height={100}
              />
            </Space>
            <Space direction="vertical">
              <Space direction="vertical" size={0}>
                <Typography.Title level={4} ellipsis={{ rows: 2 }}>
                  Chai nước rửa mặt kinh chuyên dụng - Nước Xịt Rửa Mặt Kinh
                  Chuyên Dụng
                </Typography.Title>
                <Space
                  direction="horizontal"
                  size={16}
                  style={{ marginBottom: '3px' }}
                >
                  <Typography.Text>
                    <span
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        marginRight: '5px',
                      }}
                    >
                      Quantity:
                    </span>
                    10
                  </Typography.Text>
                  <Typography.Text>
                    <span
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        marginRight: '5px',
                      }}
                    >
                      Color:
                    </span>
                    White
                  </Typography.Text>
                  <Typography.Text>
                    <span
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        marginRight: '5px',
                      }}
                    >
                      Size:
                    </span>
                    XXL
                  </Typography.Text>
                </Space>
                <Space direction="horizontal">
                  <Rate
                    allowClear={false}
                    tooltips={desc}
                    onChange={setValue}
                    value={value}
                    style={{ fontSize: '2rem' }}
                  />
                  {value ? <span>{desc[value - 1]}</span> : null}
                </Space>
              </Space>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Tooltip
                  title={
                    <Space
                      direction="vertical"
                      style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'auto',
                      }}
                    >
                      <Typography.Title level={5} style={{ color: 'red' }}>
                        &#8226; Do
                      </Typography.Title>
                      <ul>
                        <li>- Focus only on the product and its features.</li>
                        <li>
                          - Base the review on your own personal experience.
                        </li>
                        <li>
                          - Tell us “why” you feel a certain way about it.
                        </li>
                      </ul>
                      <Typography.Title level={5} style={{ color: 'red' }}>
                        &#8226; Don't
                      </Typography.Title>
                      <ul>
                        <li>- Share anything irrelevant to the product.</li>
                        <li>
                          - Include fraudulent, false, misleading or deceptive
                          information.
                        </li>
                        <li>
                          - Use profane, vulgar, obscene, defamatory,
                          threatening, or discriminatory language.
                        </li>
                        <li>- Share anyone’s personal information.</li>
                        <li>- Include any non-Shopaa URLs.</li>
                        <li>
                          - Include unauthorized trademarked or copyrighted
                          content.
                        </li>
                      </ul>
                    </Space>
                  }
                >
                  <Typography.Text style={{ color: 'blue', cursor: 'pointer' }}>
                    What do you think of this product?
                  </Typography.Text>
                </Tooltip>
                <TextArea rows={5} size="large" />
                <Space
                  direction="horizontal"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  <Button type="primary">Submit</Button>
                </Space>
              </Space>
            </Space>
          </Space>
        </Space>
      </Space>
    </Card>
  );
});
