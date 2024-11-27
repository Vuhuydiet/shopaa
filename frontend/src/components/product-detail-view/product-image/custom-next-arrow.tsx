import { RightOutlined } from '@ant-design/icons';

export const CustomNextArrow = (props: any) => (
  <div
    className="custom-arrow next"
    onClick={props.onClick}
    style={{
      position: 'absolute',
      right: '-15px',
      top: '54%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      cursor: 'pointer',
    }}
  >
    <RightOutlined className="arrow-next" />
  </div>
);
