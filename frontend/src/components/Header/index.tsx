import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Dropdown, Avatar, Row, Col } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import './HeaderStyle.css';
import logo from '../../images/logo.png';

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent: React.FC = () => {
  const isLoginedIn = true;
  const userName = 'Thanh Trúc';
  const unreadNotifications = 5;
  const cartItemCount = 3;

  const handleLogout = () => {
    console.log('Logged out');
  };

  const location = useLocation();

  return (
    <Header className="header">
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
            {isLoginedIn ? (
              <>
                <Col
                  style={{
                    marginRight: '20px',
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <NavLink
                    to="/notifications"
                    className={
                      location.pathname === '/notifications'
                        ? 'active-link'
                        : ''
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Badge count={unreadNotifications}>
                      <BellOutlined
                        style={{ fontSize: '30px' }}
                        className="header__icon"
                      />
                    </Badge>
                  </NavLink>
                </Col>

                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>
                          <NavLink
                            to="/profile"
                            className={
                              location.pathname === '/profile'
                                ? 'active-link'
                                : ''
                            }
                          >
                            <UserOutlined style={{ marginRight: '10px' }} />
                            Profile
                          </NavLink>
                        </Menu.Item>
                        <Menu.Item onClick={handleLogout}>
                          <LogoutOutlined
                            style={{ marginRight: '10px', color: '#9999FF' }}
                          />{' '}
                          Logout
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center' }}
                      className="header__icon"
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ marginRight: '10px', fontSize: '25px' }}
                      />
                      <div>{userName}</div>
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
                      location.pathname === '/login' ? 'active-link' : ''
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={
                      location.pathname === '/register' ? 'active-link' : ''
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
            <Col xs={24} sm={16} md={16} lg={18}>
              <Search
                placeholder="Search"
                style={{ width: '100%' }}
                enterButton={<SearchOutlined style={{ fontSize: '30px' }} />}
              />
            </Col>

            <Col xs={24} sm={6} md={6} lg={3}>
              <Badge count={cartItemCount} offset={[3, 0]}>
                <NavLink
                  to="/cart"
                  className={location.pathname === '/cart' ? 'active-link' : ''}
                >
                  <ShoppingCartOutlined
                    style={{ fontSize: '42px', color: '#0033FF' }}
                    className="header__icon"
                  />
                </NavLink>
              </Badge>
            </Col>
          </Row>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
