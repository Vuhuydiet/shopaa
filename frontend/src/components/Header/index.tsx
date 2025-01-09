import React, { useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Badge, Dropdown, Avatar, Row, Col, MenuProps } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShopOutlined,
  IdcardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './HeaderStyle.css';
import logo from '../../assets/images/logo.png';
import { useAuthContext } from '../../context/AuthContext';
import { useCart } from '../../service/hooks/useCart';
import NotificationPopover from '../notification/notification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../service/state/store';
import { filterAsync } from '../../service/state/actions/filter-action';
import { PRODUCTS_FILTER } from '../../config/constants';
import { NotificationProvider } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';

const { Search } = Input;

const HeaderComponent: React.FC = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const { user, refreshUser, resetUser } = useUser();

  const {
    cart: { data: cartItems },
  } = user?.role === 'USER' ? useCart({ limit: 1, offset: 0 }) : { cart: {} };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    resetUser();
    logout();
  };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSearchKeyword = useCallback((value: string) => {
    dispatch(
      filterAsync({
        shopId: undefined,
        category: undefined,
        brand: undefined,
        postedAfter: undefined,
        postedBefore: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minQuantity: undefined,
        maxQuantity: undefined,
        sortBy: 'publishedAt',
        order: 'desc',
        keyword: value,
        offset: 0,
        limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
      }),
    );

    if (location.pathname !== '/home') {
      navigate('/home');
    }
  }, []);

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <NavLink to="/user">
          <UserOutlined style={{ marginRight: '10px', color: '#0000CD' }} />
          My account
        </NavLink>
      ),
    },
    ...(user?.role === 'SHOP_MANAGER'
      ? [
          {
            key: '2',
            label: (
              <NavLink to="/manager-shop">
                <ShopOutlined
                  style={{ marginRight: '10px', color: '#FF6600' }}
                />
                My shop
              </NavLink>
            ),
          },
        ]
      : []),
    user?.role && user?.role === 'ADMIN'
      ? {
          key: '3',
          label: (
            <NavLink to="/admin">
              <IdcardOutlined
                style={{ marginRight: '10px', color: '#0000CD' }}
              />
              Admin
            </NavLink>
          ),
        }
      : null,
    user?.role && user?.role === 'USER'
      ? {
          key: '/user/orders',
          icon: <FileTextOutlined style={{ color: '#FFD700' }} />,
          label: <NavLink to="/user/orders">Order</NavLink>,
        }
      : null,
    {
      key: 'logout',
      label: (
        <div onClick={handleLogout}>
          <LogoutOutlined style={{ marginRight: '10px', color: '#B8860B' }} />{' '}
          Logout
        </div>
      ),
    },
  ];

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__logo">
          <NavLink to="/" className="header__icon">
            <img src={logo} alt="logo shop" />
          </NavLink>
        </div>
        <div className="header__component">
          <Row
            justify="end"
            align="middle"
            gutter={[16, 16]}
            className="header__component-top"
          >
            {isAuthenticated ? (
              <>
                {user?.role !== 'ADMIN' && (
                  <Col
                    style={{
                      marginRight: '20px',
                      display: 'flex',
                      alignItems: 'flex-end',
                    }}
                  >
                    <NotificationProvider>
                      <NotificationPopover />
                    </NotificationProvider>
                  </Col>
                )}

                <Col
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 'auto',
                  }}
                >
                  <Dropdown menu={{ items: menuItems }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 'auto',
                      }}
                      className="header__icon"
                    >
                      <Avatar
                        src={user?.avatar || undefined}
                        icon={user?.avatar ? null : <UserOutlined />}
                        style={{
                          marginRight: '10px',
                          fontSize: '25px',
                        }}
                      />
                      <div className="user-name" style={{ color: 'black' }}>
                        {user?.fullname || 'User'}
                      </div>
                    </div>
                  </Dropdown>
                </Col>
              </>
            ) : (
              <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NavLink
                    to="/login"
                    className={
                      location.pathname === '/login'
                        ? 'header__link active-link'
                        : 'header__link'
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={
                      location.pathname === '/register'
                        ? 'header__link active-link'
                        : 'header__link'
                    }
                  >
                    Signup
                  </NavLink>
                </div>
              </Col>
            )}
          </Row>

          <Row
            justify="space-between"
            align="middle"
            className="header__component-bottom"
          >
            <Col xs={16} sm={12} md={16} lg={18}>
              <Search
                placeholder="Search"
                style={{ width: '100%' }}
                enterButton={
                  <SearchOutlined
                    style={{ fontSize: '28px' }}
                    className="icon-search"
                  />
                }
                onSearch={handleSearchKeyword}
              />
            </Col>

            {user?.role === 'USER' && (
              <Col xs={5} sm={6} md={6} lg={3}>
                <Badge count={cartItems?.count} offset={[3, 0]}>
                  <NavLink
                    to="/cart"
                    className={
                      location.pathname === '/cart' ? 'active-link' : ''
                    }
                  >
                    <ShoppingCartOutlined
                      style={{ fontSize: '40px', color: '#0033FF' }}
                      className="header__icon"
                    />
                  </NavLink>
                </Badge>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
