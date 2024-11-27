import { Button } from 'antd';
import './style.css';
import { ShopTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import RegisterShopForm from './RegisterShopForm';

const RegisterShop: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  return (
    <>
      {isStarted ? (
        <RegisterShopForm />
      ) : (
        <div className="RegisterShop__container">
          <ShopTwoTone style={{ fontSize: '100px' }} />
          <div style={{ color: '#0000CD', fontSize: '24px', margin: '20px' }}>
            Let start your business with Shopaa!
          </div>
          <Button
            className="RegisterShop__button"
            onClick={() => setIsStarted(true)}
          >
            Start
          </Button>
        </div>
      )}
    </>
  );
};

export default RegisterShop;
