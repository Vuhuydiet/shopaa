import { Carousel, Col, Row } from 'antd';
import { CustomPrevArrow } from './custom-prev-arrow';
import { CustomNextArrow } from './custom-next-arrow';
import { chunkArray } from '../../../utils/chunk-array';
import { useEffect, useState } from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductImage = () => {
  const product = useSelector((state: RootState) => state.product);
  const defaultImage =
    'data:image/jpeg;base64,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';
  const [image, setImage] = useState<string>(defaultImage);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setImage(product?.images[0]?.url);
    }
  }, [product]);

  return (
    <Col xs={24} sm={24} md={8}>
      <div>
        <img
          src={image}
          alt="product image"
          style={{
            width: '100%',
            height: '350px',
            objectFit: 'cover',
          }}
        />
      </div>

      <Carousel
        arrows={true}
        infinite={true}
        prevArrow={product?.images?.length ? <CustomPrevArrow /> : <></>}
        nextArrow={product?.images?.length ? <CustomNextArrow /> : <></>}
      >
        {chunkArray(product?.images, 4).map((chunk: any, index: number) => {
          return (
            <div key={index}>
              <Row gutter={[8, 8]} justify="start">
                {chunk?.map((img: any, ind: number) => {
                  return (
                    <Col key={ind} xs={6}>
                      <img
                        src={img?.url}
                        alt="product image"
                        style={{ width: '100%', objectFit: 'contain' }}
                        onClick={() => setImage(img?.url)}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}
      </Carousel>
    </Col>
  );
};
