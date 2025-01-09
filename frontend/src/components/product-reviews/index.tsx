import {
  List,
  Avatar,
  Pagination,
  Rate,
  Card,
  Typography,
  Button,
  Flex,
  Spin,
} from 'antd';
import { useReviews } from '../../service/hooks/useReviews';
import { formatDateString } from '../../utils/formatDateString';
import { IProduct } from '../../interfaces/IProduct';
import { REVIEWS_FILTER } from '../../config/constants';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CommentList = ({ product }: { product: IProduct }) => {
  const {
    averageRate,
    currentPage,
    filter,
    onPageChange,
    handleRateFilterChange,
    query: { data: commentsData, isLoading },
  } = useReviews(product);
  const reviewRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#review-list' && reviewRef.current) {
      reviewRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [location]);

  if (isLoading) {
    return (
      <Spin
        style={{
          margin: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <Card
      title="Review Products"
      style={{ maxWidth: 1200, margin: '20px auto', padding: '1rem' }}
    >
      <Card style={{ backgroundColor: '#FBF8F8', padding: '0.5rem' }}>
        <Flex gap={16}>
          <Flex style={{ flexDirection: 'column' }}>
            <Typography.Title level={3}>
              {averageRate}
              <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>
                out of 5
              </span>
            </Typography.Title>
            <Rate defaultValue={averageRate} disabled allowHalf />
          </Flex>
          <Flex wrap="wrap" gap={12}>
            <Button
              type="primary"
              style={{
                backgroundColor: !filter.rating ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(undefined)}
            >
              All
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: filter.rating === 5 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(5)}
            >
              5
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: filter.rating === 4 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(4)}
            >
              4
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: filter.rating === 3 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(3)}
            >
              3
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: filter.rating === 2 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(2)}
            >
              2
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: filter.rating === 1 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => handleRateFilterChange(1)}
            >
              1
            </Button>
          </Flex>
        </Flex>
      </Card>
      <List
        ref={reviewRef}
        id="review-list"
        itemLayout="vertical"
        dataSource={commentsData?.reviews}
        renderItem={(comment) => (
          <List.Item key={comment.reviewId}>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    <img
                      src={
                        comment.customerAvatar ??
                        'https://res.cloudinary.com/dwkunsgly/image/upload/v1736347325/brzw7ubnc2fnaxwlpas1.jpg'
                      }
                      width={200}
                      height={200}
                      alt={comment.customerName}
                    />
                  }
                />
              }
              title={
                <>
                  {comment.customerName ?? 'Anonymous'}
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '12px',
                      color: '#999',
                    }}
                  >
                    {formatDateString(comment.createdAt)}
                  </span>
                </>
              }
              description={
                <>
                  <Rate disabled defaultValue={comment.rating} />
                  <div>
                    {comment.color && 'Color: '} <b>{comment.color}</b>
                    {comment.size && ' | Size: '}
                    <b>{comment.size}</b>
                  </div>
                </>
              }
            />
            <Typography.Paragraph>{comment.reviewContent}</Typography.Paragraph>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={REVIEWS_FILTER.ITEMS_PER_PAGE}
        total={commentsData?.count}
        onChange={onPageChange}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </Card>
  );
};

export default CommentList;
