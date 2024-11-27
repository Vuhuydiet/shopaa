import { Col, InputNumber, Row, Select, Space, Typography } from 'antd';

export const ProductCardItem = () => {
  return (
    <Row style={{ backgroundColor: 'white', margin: '5px', width: '100%' }}>
      <Col>
        <img
          src="https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp"
          style={{ width: '80px' }}
        />
      </Col>

      <Col
        span={4}
        style={{
          color: 'black',
          wordWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Bộ chuyển đổi Sata sang Usb 3.0 lên tới 6 Gbps cho phụ kiện máy tính
          xách tay 2,5 Inch HDD gắn ngoài Ổ cứng SSD Cáp 22 chân Cáp
        </span>
      </Col>

      <Col>
        <Row>
          <Select
            showSearch
            placeholder="Select size"
            optionFilterProp="label"
            onChange={() => {}}
            onSearch={() => {}}
            options={[
              {
                value: '33',
                label: '33',
              },
              {
                value: '34',
                label: '34',
              },
              {
                value: '35',
                label: '35',
              },
              {
                value: '36',
                label: '36',
              },
            ]}
          />
        </Row>
        <Row>
          <Select
            showSearch
            placeholder="Select color"
            optionFilterProp="label"
            onChange={() => {}}
            onSearch={() => {}}
            options={[
              {
                value: 'red',
                label: 'Red',
              },
              {
                value: 'green',
                label: 'Green',
              },
              {
                value: 'blue',
                label: 'Blue',
              },
              {
                value: 'yellow',
                label: 'Yellow',
              },
            ]}
          />
        </Row>
      </Col>
      <Col>
        <Row>
          <Typography.Text strong italic>
            $109
          </Typography.Text>
        </Row>
        <Row>
          <Typography.Text delete italic>
            $212
          </Typography.Text>
        </Row>
      </Col>
      <Col>
        <InputNumber min={1} defaultValue={1} onChange={() => {}} />
      </Col>
      <Col>
        <Typography.Text strong italic style={{ color: 'red' }}>
          $109
        </Typography.Text>
      </Col>
    </Row>
  );
};
