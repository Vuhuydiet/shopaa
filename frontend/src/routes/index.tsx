import { Navigate } from 'react-router-dom';
import PrivateRoutes from '../components/PrivateRoute';
import LayoutBasic from '../layout/LayoutBasic';
import { LogIn } from '../pages/login/login';
import RegisterPage from '../pages/RegisterPage';
import { ResetPassword } from '../pages/reset-password/reset-password';
import UserAccountPage from '../pages/UserAccountPage';
import Profile from '../components/MyAccount/Profile';
import MyShop from '../pages/MyShop';
import Account from '../components/MyAccount/Account';
import ShopPage from '../pages/Shop';
import Category from '../pages/Category';
import ManagerShop from '../pages/ManagerShop';
import { Home } from '../pages/Home/Home';
import UploadProductForm from '../components/UpLoadProduct/UpLoadProductFrom';
import ListProductShop from '../components/ListProductShop';
import { ProductDetail } from '../pages/product-detail';
import UpdateProductForm from '../components/UpLoadProduct/UpdateProductForm';
import OrderShop from '../components/OrdersShop';
import OrderShopDetail from '../components/OrdersShop/orderDetails';
import { ReportPage } from '../pages/admin/report';
import { AdminRoute } from '../components/admin-route';
import { LayoutAdmin } from '../layout/admin';
import { ProductCart } from '../pages/product-cart';
import OrderUser from '../components/OrderUser';
import OrderUserDetail from '../components/OrderUser/orderDetails';
import CheckoutPage from '../pages/Checkout';
import { FormReview } from '../components/form-review';
import { OrderStatus } from '../interfaces/Order/OrderEnums';

const form = {
  id: 106,
  sellerId: 20,
  name: 'Áo phông nữ tay lỡ unisex FAFIC, Áo thun nam nữ form rộng mặc cặp, nhóm phong cách ulzzang',
  brand: 'FAFIC',
  currentPrice: 1000000,
  originalPrice: 1000000,
  description: `
  THÔNG TIN SẢN PHẨM: 

- Tên sản phẩm: Áo thun Unisex form rộng tay lỡ nam nữ

- Xuất sứ: Việt Nam 

- Chất liệu: 35% Cotton, 60% Polyester, 5% Spandex

- Vải thun co giãn, hình in sắc nét, chất vải thoáng mát, không xù, không nhăn, không hút bụi bẩn



BẢNG SIZE:

SIZE      Cân Nặng          Chiều Cao     Chiều Dài - Rộng áo                   

  S          29 - 35kg         1m31 - 1m41   Dài 63cm rộng 48cm

  M         36 - 44kg         1m42 - 1m52   Dài 66cm rộng 50cm          

   L         45 - 52kg         1m53 - 1m59   Dài 68cm rộng 53cm   

  XL        53 - 63kg         1m60 - 1m69   Dài 70cm rộng 55cm  

 XXL      Trên 63kg           Trên 1m70     Dài 73cm rộng 57cm



Ngày nay, áo thun tay lỡ Unisex form rộng đang ngày càng trở nên phổ biến và đa dạng với các mẫu thiết kế độc đáo bắt mắt, thậm chí còn bắt kịp nhiều trào lưu xu hướng đặc biệt là phong cách Hàn Quốc. 

Do đó, việc tìm hiểu tất tần tật về áo thun tay lỡ nam/nữ là cần thiết giúp bạn luôn cập nhật những mẫu thiết kế mới nhất. Điều này sẽ giúp bạn có nhiều sự lựa chọn mới mẻ và đa dạng phong cách thời trang của bạn.



Vậy áo thun tay lỡ là gì?

- Là loại áo phông có chiều dài tay áo dài hơn so với áo thun nam ngắn tay, thường là dài đến khuỷu tay hoặc qua khuỷu tay. 

- Kiểu áo phông tay lỡ này thường xuất hiện ở những thiết kế áo thun unisex oversize rộng rãi, thoáng mát. 

- Loại áo này “khó tính” hơn áo thun nam nữ ngắn tay, nếu biết cách mix đồ, bạn sẽ trở nên thật cá tính với phong cách thời trang đậm chất Hàn Quốc, nhưng nếu phối đồ không tốt trông bạn như đang “lọt thỏm” trong chiếc áo thun tay lỡ.



Đặc điểm nổi bật của áo thun tay lỡ Unisex form rộng:

- Là item không thể thiếu trong tủ đồ vì sự thoải mái, dễ chịu, lại rất dễ phối đồ.

- Áo thun unisex thích hợp với cả nam và nữ. Mặc làm áo thun cặp, áo nhóm rất phù hợp.

- Áo thun form rộng dễ dàng phối đồ, thời trang phong cách Hàn Quốc.



HƯỚNG DẪN GIẶT/ỦI ÁO THUN TAY LỠ

- Không sử dụng hóa chất, tẩy trực tiếp lên sản phẩm, không ngâm quá lâu trong dung dịch tẩy. 

- Không sử dụng bàn chải khi giặt

- Giặt mặt trái, nhẹ tay, giặt xong phơi ngay, không ngâm trong nước quá lâu.

- Áo trắng - áo màu nên chia ra giặt riêng, không giặt chung.



Khách hàng có thể an tâm khi mua hàng tại Luxa - Thời trang Unisex:

+ Cam kết về chất lượng sản phẩm, Shop cam kết cả về CHẤT LIỆU cũng như HÌNH ẢNH (đúng với những gì được nêu bật trong phần mô tả sản phẩm).

+ Giá thành thấp nhất thị trường và được bảo hành theo quy định với từng sản phẩm, được đổi trả hàng lỗi trong vòng 7 ngày kể từ khi mua hàng.`,
  soldCount: 0,
  numReviews: 0,
  totalRating: 0,
  quantity: 4,
  material: 'Áo phông',
  origin: 'Việt Nam',
  colors: ['White', 'Black', 'Red', 'Blue', 'Yellow'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  publishedAt: '2021-10-10',
  categories: [
    {
      id: 1,
      name: 'Áo phông',
      description: 'Mặc thoáng mát, khỏi phải lo nắng nóng',
    },
  ],
  images: [
    {
      id: 2,
      publicId: 'fdslfjdsjhf',
      url: 'https://res.cloudinary.com/dwkunsgly/image/upload/v1734972331/xwfvhsjum6incie4geel.webp',
      createdAt: '2021-10-10',
    },
  ],
};

const product = {
  orderId: 12,
  orderDetailNumber: 0,
  productId: 106,
  productName:
    'Áo phông nữ tay lỡ unisex FAFIC, Áo thun nam nữ form rộng mặc cặp, nhóm phong cách ulzzang',
  color: 'White',
  size: 'XL',
  quantity: 3,
  price: 1000000,
  productImageUrl:
    'https://res.cloudinary.com/dwkunsgly/image/upload/v1734972331/xwfvhsjum6incie4geel.webp',
  status: OrderStatus.PENDING,
  updatedAt: '2021-10-10',
};

export const routes = [
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            // element:
          },
          {
            path: 'report',
            element: <ReportPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <LayoutBasic />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: 'user',
            element: <UserAccountPage />,
            children: [
              {
                index: true,
                element: <Navigate to="/user/account/profile" replace />,
              },
              {
                path: 'account/profile',
                element: <Profile />,
              },
              {
                path: 'account/address',
                // element: <Address />, // Component Address
              },
              {
                path: 'account/setting',
                element: <Account />,
              },
              {
                path: 'orders',
                element: <OrderUser />,
              },
              {
                path: '/user/orders/:orderId',
                element: <OrderUserDetail />,
              },
              {
                path: 'myshop',
                element: <MyShop />,
              },
            ],
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'notifications',
          },
          {
            path: 'cart',
            element: <ProductCart />,
          },
          {
            path: '/manager-shop',
            element: <ManagerShop />,
            children: [
              {
                index: true,
                element: <Navigate to="/manager-shop/list-product" replace />,
              },
              {
                path: 'list-product',
                element: <ListProductShop />,
              },
              {
                path: 'add-product',
                element: <UploadProductForm />,
              },
              {
                path: 'update-product/:productId',
                element: <UpdateProductForm />,
              },
              {
                path: 'shop-info',
                // element: <Profile />, information of shop
              },
              {
                path: 'list-order',
                element: <OrderShop />,
              },
              {
                path: 'list-order/:orderId',
                element: <OrderShopDetail />,
              },
            ],
          },
        ],
      },
      {
        path: '/shop/:shopId',
        element: <ShopPage />,
      },
      {
        path: '/category',
        element: <Category />,
      },
      {
        path: '/product-detail/:id',
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
