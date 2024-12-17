import { useState } from 'react';
import {
  List,
  Avatar,
  Pagination,
  Rate,
  Card,
  Typography,
  Button,
  Flex,
} from 'antd';

const commentsData = [
  {
    id: 1,
    username: 'ktov0gjad3',
    date: '2023-01-31 14:13',
    rating: 5,
    color: 'Bạch kim',
    size: 'XL',
    correct: 'Đúng',
    content:
      'Sản phẩm tuyệt vời bóng loáng, giao hàng nhanh, đặt hôm sau giao tới tận tay.',
    images: [
      'http://ts1.mm.bing.net/th?id=OIP.jQvFuRlmVesA7K6ArjfyrAHaH9&pid=15.1', // Replace with actual image URLs
      'http://ts1.mm.bing.net/th?id=OIP.jQvFuRlmVesA7K6ArjfyrAHaH9&pid=15.1',
    ],
  },
  {
    id: 2,
    username: 'user123',
    date: '2023-02-01 10:00',
    rating: 4,
    color: 'Vàng',
    size: 'XL',
    correct: 'Đúng',
    content: 'Hàng đẹp nhưng hơi lớn so với tay mình.',
    images: [
      'http://ts1.mm.bing.net/th?id=OIP.jQvFuRlmVesA7K6ArjfyrAHaH9&pid=15.1',
    ],
  },
];

const PAGE_SIZE = 2;

const CommentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rateFilter, setRateFilter] = useState(0);
  const [starFilters, setStarFilters] = useState([1, 2, 3, 4, 5]);

  const averageRate =
    commentsData.reduce((sum: any, comment: any) => sum + comment.rating, 0) /
    commentsData.length;

  const handleRateFilterChange = (value: any) => {
    setRateFilter(value);
  };

  const handleStarFilterChange = (checkedValues: any) => {
    setStarFilters(checkedValues);
  };

  const filteredComments = commentsData.filter(
    (comment) =>
      comment.rating >= rateFilter && starFilters.includes(comment.rating),
  );

  const paginatedComments = commentsData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const onPageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <Card
      title="Review Products"
      style={{ maxWidth: 800, margin: 'auto', padding: '1rem' }}
    >
      <Card style={{ backgroundColor: '#FBF8F8', padding: '0.5rem' }}>
        <Flex gap={16}>
          <Flex style={{ flexDirection: 'column' }}>
            <Typography.Title level={3} style={{ color: 'blue' }}>
              {averageRate.toFixed(1)}{' '}
              <span style={{ fontSize: '0.8rem' }}>out of 5</span>
            </Typography.Title>
            <Rate
              // value={rateFilter}
              defaultValue={4.5}
              disabled
              allowHalf
              onChange={handleRateFilterChange}
            />
          </Flex>
          <Flex wrap="wrap" gap={12}>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 0 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(0)}
            >
              All
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 5 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(5)}
            >
              5
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 4 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(4)}
            >
              4
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 3 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(3)}
            >
              3
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 2 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(2)}
            >
              2
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: rateFilter === 1 ? 'blue' : '#ACABAB',
                width: '80px',
              }}
              onClick={() => setRateFilter(1)}
            >
              1
            </Button>
          </Flex>
        </Flex>
      </Card>
      <List
        itemLayout="vertical"
        dataSource={paginatedComments}
        renderItem={(comment) => (
          <List.Item key={comment.id}>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    <img
                      src="https://res.cloudinary.com/dwkunsgly/image/upload/v1734454130/wuaksskoistfbukfjap6.png"
                      width={200}
                      height={200}
                      alt="avatar"
                    />
                  }
                />
              }
              title={
                <>
                  {comment.username}
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '12px',
                      color: '#999',
                    }}
                  >
                    {comment.date}
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
            <p>{comment.content}</p>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={PAGE_SIZE}
        total={commentsData.length}
        onChange={onPageChange}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </Card>
  );
};

export default CommentList;
