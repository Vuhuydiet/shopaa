import { Row, Col, Button, message } from 'antd';
import { CheckoutForm } from '../../components/Checkout/FormCheckout';
import { OrderSummary } from '../../components/Checkout/OrderSummary';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../../service/orderService';

const CheckoutPage = () => {
  const formRef = useRef<any>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const location = useLocation();
  const productsData = location.state?.products || [];
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Products in CheckoutPage:', products);
  }, [productsData]);

  const handleShippingFeeChange = (fee: number) => {
    setShippingFee(fee);
  };

  const products = productsData?.map((product: any) => ({
    productId: product.id,
    size: product.size,
    color: product.color,
    price: product.currentPrice,
    quantity: product.quantity,
    name: product.name,
  }));

  const handleSubmit = async () => {
    const formValues = await formRef.current.validateFields();
    console.log('Form Values:', formValues);
    const shippingAddress =
      formValues.houseNumberAndStreet +
      ', ' +
      formValues.ward +
      ', ' +
      formValues.district +
      ', ' +
      formValues.city +
      ', ' +
      formValues.country;
    const filteredProducts = products?.map((product: any) => {
      return Object.fromEntries(
        Object.entries(product).filter(
          ([_, value]) => value !== null && value !== '',
        ),
      );
    });

    const orderData = {
      orderData: {
        phone: formValues.phone,
        shippingAddress: shippingAddress,
        transProvider: formValues.shippingProviderId,
        products: filteredProducts,
      },
    };

    console.log('Order Payload:', orderData);
    try {
      const response = await createOrder(orderData);
      console.log('Response:', response);
      if (response) {
        message.success('Order created successfully');
        navigate('/user/orders');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <CheckoutForm
            ref={formRef}
            onShippingFeeChange={handleShippingFeeChange}
          />
        </Col>
        <Col xs={24} md={10}>
          <div style={{ background: '#fafafa', padding: 20, borderRadius: 8 }}>
            <OrderSummary products={products} shippingFee={shippingFee} />
            <Row justify="center" style={{ marginTop: 30 }}>
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    padding: '20px 0',
                    backgroundColor: 'rgb(47, 67, 246)',
                    borderColor: ' #4c56af',
                    fontSize: '1rem',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'rgb(113, 120, 185)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgb(52, 71, 245)')
                  }
                  onClick={handleSubmit}
                >
                  Proceed to Payment
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
