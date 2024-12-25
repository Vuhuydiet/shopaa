import { ProductOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import './HeaderShopStyle.css';

interface HeaderShopProps {
  shopInfo: any;
  shopManagerInfo: any;
}

const HeaderShop: React.FC<HeaderShopProps> = ({
  shopInfo,
  shopManagerInfo,
}) => {
  return (
    <>
      <div className="HeaderShop">
        <div className="HeaderShop__info">
          <Avatar
            src={
              shopManagerInfo && shopManagerInfo?.avatarImage?.url
                ? shopManagerInfo?.avatarImage?.url
                : '#'
            }
            icon={shopManagerInfo?.avatarImage?.url ? null : <UserOutlined />}
            style={{ background: '#ddd', color: '#000' }}
            className="logo-shop"
          />
          <div style={{ color: '#fff' }}>{shopInfo.shopName}</div>
        </div>
        <div className="HeaderShop__infoDetail">
          <div className="HeaderShop__item">
            <ProductOutlined
              style={{ color: '#FF6600', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>Product {shopInfo?.numProducts}</div>
          </div>
          <div className="HeaderShop__item">
            <StarOutlined
              style={{ color: '#FFFF00', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>
              {shopInfo?.numReviews
                ? Number(shopInfo?.totalRating / shopInfo?.numReviews).toFixed(
                    1,
                  )
                : 0}
              ({shopInfo?.numReviews} reviews)
            </div>
          </div>
          <div className="HeaderShop__item">
            <ProductOutlined
              style={{ color: '#0033FF', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>{shopInfo?.numSoldOrders}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderShop;
