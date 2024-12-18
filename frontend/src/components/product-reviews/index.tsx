import { useMemo, useState } from 'react';
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
import { useReviews } from '../../service/api/useReviews';
import { formatDateString } from '../../utils/formatDateString';
import { IFilterReview } from '../../interfaces/IFilterReview';
import { IProduct } from '../../interfaces/IProduct';

const PAGE_SIZE = 5;

const CommentList = ({ product }: { product: IProduct }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<IFilterReview>({
    limit: PAGE_SIZE,
    sortBy: 'createdAt',
    order: 'desc',
    productId: product.id,
  });

  const { data: commentsData, isLoading } = useReviews(filter);

  const handleRateFilterChange = (value: number | undefined) => {
    console.log(value);

    setFilter((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const onPageChange = (e: any) => {
    setCurrentPage(e.target.value);
    setFilter((prev) => ({
      ...prev,
      offset: (e.target.value - 1) * PAGE_SIZE,
    }));
  };

  const averageRate = useMemo((): number => {
    return product.numReviews
      ? Number((product.totalRating / product.numReviews).toFixed(1))
      : 0;
  }, [product]);

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
              <span style={{ fontSize: '0.8rem' }}>out of 5</span>
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
        itemLayout="vertical"
        dataSource={commentsData}
        renderItem={(comment) => (
          <List.Item key={comment.reviewId}>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    <img
                      src={
                        comment.customerAvatar ??
                        'https://res.cloudinary.com/dwkunsgly/image/upload/v1734524362/tfnsj3lungllyymy3u0t.jpg'
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
                  {comment.customerName}
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
                    Color: <b>{comment.color}</b> | Size: <b>{comment.size}</b>
                  </div>
                </>
              }
            />
            <p>{comment.reviewContent}</p>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={PAGE_SIZE}
        total={commentsData?.length ?? 10}
        onChange={onPageChange}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </Card>
  );
};

export default CommentList;
