import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ListProductShop: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="primary"
        onClick={() => navigate('/manager-shop/add-product')}
      >
        {' '}
        Add Product
      </Button>
    </>
  );
};

export default ListProductShop;
