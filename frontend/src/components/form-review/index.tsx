import { memo, useState } from 'react';
import { Button, Card, Rate, Space, Tooltip, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { formatDateString } from '../../utils/formatDateString';
import { IProductOrder } from '../../interfaces/Order/IProductOrder';
import { useFormReview } from '../../service/hooks/useFormReview';

export const FormReview = memo(
  ({
    order,
    setOrderProduct,
  }: {
    order: IProductOrder | null;
    setOrderProduct: (a: IProductOrder | null) => void;
  }) => {
    if (!order) {
      return null;
    }

    const {
      isSubmitting,
      desc,
      star,
      setStar,
      content,
      setContent,
      handleSubmitReview,
    } = useFormReview(order, setOrderProduct);

    const [error, setError] = useState<string>('');

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);
      if (!value) {
        setError('Content cannot be empty');
      } else if (value.length > 1000) {
        setError('Content exceeds the 1000 character limit! Please summarize.');
      } else {
        setError('');
      }
    };

    return (
      <Card
        title="Write Review"
        style={{ padding: '1.5rem', maxWidth: '800px', margin: '20px auto' }}
      >
        <Space direction="vertical">
          <Space direction="vertical">
            <Typography.Text italic>
              {`${capitalizeWords(order?.status)} `} on
              {` ${formatDateString(order?.updatedAt)}`}
            </Typography.Text>
            <Typography.Text>
              Rate and review purchased product:
            </Typography.Text>
            <Space direction="horizontal" size={16} align="start">
              <Space>
                <img
                  src={order?.productImageUrl}
                  alt="Product thumbnail"
                  width={100}
                  height={100}
                />
              </Space>
              <Space direction="vertical">
                <Space direction="vertical" size={0}>
                  <Typography.Title level={4} ellipsis={{ rows: 2 }}>
                    {order?.productName}
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
                      {order?.quantity}
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
                      {order?.color}
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
                      {order?.size}
                    </Typography.Text>
                  </Space>
                  <Space direction="horizontal">
                    <Rate
                      allowClear={false}
                      tooltips={desc}
                      onChange={setStar}
                      value={star}
                      style={{ fontSize: '2rem' }}
                    />
                    {star ? <span>{desc[star - 1]}</span> : null}
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
                    <Typography.Text
                      style={{ color: 'blue', cursor: 'pointer' }}
                    >
                      What do you think of this product?
                    </Typography.Text>
                  </Tooltip>
                  <TextArea
                    rows={5}
                    size="large"
                    value={content}
                    onChange={handleContentChange}
                    style={{
                      borderColor: error ? 'red' : undefined,
                    }}
                  />
                  {error && (
                    <Typography.Text style={{ color: 'red', fontSize: '12px' }}>
                      {error}
                    </Typography.Text>
                  )}
                  <Space
                    direction="horizontal"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '10px',
                    }}
                  >
                    <Button
                      loading={isSubmitting}
                      type="primary"
                      onClick={handleSubmitReview}
                    >
                      Submit
                    </Button>
                  </Space>
                </Space>
              </Space>
            </Space>
          </Space>
        </Space>
      </Card>
    );
  },
);
