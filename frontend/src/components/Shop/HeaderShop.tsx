import { ProductOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import './HeaderShopStyle.css';

interface HeaderShopProps {
  shopInfo: any;
}

const HeaderShop: React.FC<HeaderShopProps> = ({ shopInfo }) => {
  return (
    <>
      <div className="HeaderShop">
        <div className="HeaderShop__info">
          <Avatar
            size={60}
            src="#"
            icon={<UserOutlined />}
            style={{ background: '#ddd', color: '#000' }}
          />
          <div style={{ color: '#fff' }}>{shopInfo.shopName}</div>
        </div>
        <div className="HeaderShop__infoDetail">
          <div className="HeaderShop__item">
            <ProductOutlined style={{ color: '#FF6600', fontSize: '24px' }} />
            <div>Product 244</div>
          </div>
          <div className="HeaderShop__item">
            <StarOutlined style={{ color: '#FFFF00', fontSize: '24px' }} />
            <div>4.8 (72.9k reviews)</div>
          </div>
          <div className="HeaderShop__item">
            <UserOutlined style={{ color: '#0033FF', fontSize: '24px' }} />
            <div>Join 5 years ago</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderShop;
