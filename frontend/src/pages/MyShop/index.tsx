import RegisterShop from '../../components/RegisterShop';

const MyShop: React.FC = () => {
  const isSeller = false;
  return (
    <>
      <div>{isSeller ? <div>Your SHOP</div> : <RegisterShop />}</div>
    </>
  );
};

export default MyShop;
