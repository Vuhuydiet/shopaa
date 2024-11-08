import React from 'react';
import { Layout, Menu, Input, Badge, Dropdown, Avatar, Row, Col } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
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

  return (
    <Header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to="/" className="header__icon">
            <img src={logo} alt="logo shop" />
            {/* <span>Shopaa</span> */}
          </Link>
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
                <Col>
                  <div
                    style={{
                      marginRight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Badge count={unreadNotifications}>
                      <BellOutlined
                        style={{ fontSize: '28px' }}
                        className="header__icon"
                      />
                    </Badge>
                  </div>
                </Col>

                <Col>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>
                          <Link to="/profile">
                            <UserOutlined style={{ marginRight: '10px' }} />
                            Profile
                          </Link>
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
                  <Link to="/login" className="header__link">
                    Login
                  </Link>
                  <Link to="/register" className="header__link">
                    Signup
                  </Link>
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
                <Link to="/cart">
                  <ShoppingCartOutlined
                    style={{ fontSize: '42px', color: '#0033FF' }}
                    className="header__icon"
                  />
                </Link>
              </Badge>
            </Col>
          </Row>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
