import { LeftOutlined } from '@ant-design/icons';

export const CustomPrevArrow = (props: any) => (
  <div
    className="custom-arrow prev"
    onClick={props.onClick}
    style={{
      position: 'absolute',
      left: '-15px',
      top: '54%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      cursor: 'pointer',
    }}
  >
    <LeftOutlined
      className="arrow-prev"
      style={{ fontSize: '1rem', color: '#000' }}
    />
  </div>
);
