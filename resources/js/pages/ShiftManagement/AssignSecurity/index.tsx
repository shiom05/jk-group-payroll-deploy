import { Button, message, Steps, theme, Image, Card, Tag, Row, Col, Typography, Collapse, Statistic } from 'antd';
import React, { useState } from 'react';
import SelectLocation from './SelectLocation';
import SelectSecurity from './SelectSecurity';
import Confirm from './Confirm';
import Security from '@/types/jk/security';
import Location from '@/types/jk/location';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface AsignSecuirtyProps {
  securities: Security[],
  locations: Location[]
}

const AsignSecuirty = ({ securities, locations }: AsignSecuirtyProps) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedSecurity, setSelectedSecurity] = useState<any>(null);

  const handleSelectLocation = (loc: any) => {
    console.log(loc)
    setSelectedLocation(loc)
  }

  const handleSelectSecuirty = (sec: any) => {
    console.log(sec)
    setSelectedSecurity(sec);
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Select Location',
      content: <SelectLocation onSelected={handleSelectLocation} locations={locations} selectedLocation={selectedLocation} />,
    },
    {
      title: 'Select Security',
      content: <SelectSecurity selectedSecurity={selectedSecurity} securityList={securities} onSelected={handleSelectSecuirty} />,
    },
    {
      title: 'Complete Assign',
      content: <Confirm selectedLocation={selectedLocation} selectedSecurity={selectedSecurity} />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const renderRateCard = (title: string, value: number, color: string) => (

    // <Statistic
    //   title={title}
    //   value={value}
    //   valueStyle={{ 
    //     fontSize: 14,
    //     color: '#fff',
    //     fontWeight: 'bold'
    //   }}
    //   prefix="LKR"
    // />
  <Tag color={"blue"} style={{
    width: '100%',
  }}>
      <Statistic  title={title} value={value} valueStyle = {{ fontSize: 14, fontWeight: 'bold' }} />
 </Tag>
  );

  return (
      <div style={{ padding: 20 }}>
          <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={12}>
                  {selectedLocation && (
                      <Card
                          title={
                              <div className="p-5">
                                  <Title level={5} style={{ color: '#389e0d', marginBottom: 0 }}>
                                      {selectedLocation.locationName}
                                  </Title>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, rowGap: 8 }}>
                                      <Text type="secondary">{selectedLocation.locationType}</Text>
                                      {selectedLocation.isJkPropLocation && <Tag color="green">JK Property</Tag>}
                                  </div>
                                  <Text style={{ display: 'block', marginBottom: 16 }}>{selectedLocation.address}</Text>
                              </div>
                          }
                          key="1"
                      >
                          <Card>
                              <Text strong>Billing Rates (LKR)</Text>
                              <Row gutter={[8, 8]} style={{ marginBottom: 16,  marginTop: 16 }}>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('OIC', selectedLocation.billing_OIC_HourlyRate, '#1890ff')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('JSO', selectedLocation.billing_JSO_HourlyRate, '#52c41a')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('CSO', selectedLocation.billing_CSO_HourlyRate, '#722ed1')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('SSO', selectedLocation.billing_SSO_HourlyRate, '#722ed1')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">{renderRateCard('LSO', selectedLocation.billing_LSO_HourlyRate, '#faad14')}</Col>
                              </Row>

                              <Text strong>Paying Rates (LKR)</Text>
                              <Row gutter={[8, 8]} style={{ marginBottom: 16,  marginTop: 16 }}>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('OIC', selectedLocation.paying_OIC_HourlyRate, '#1890ff')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('JSO', selectedLocation.paying_JSO_HourlyRate, '#52c41a')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('CSO', selectedLocation.paying_CSO_HourlyRate, '#722ed1')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">
                                      <div style={{ paddingRight: 4 }}>
                                          {renderRateCard('SSO', selectedLocation.paying_SSO_HourlyRate, '#722ed1')}
                                      </div>
                                  </Col>
                                  <Col flex="20%">{renderRateCard('LSO', selectedLocation.paying_LSO_HourlyRate, '#faad14')}</Col>
                              </Row>
                          </Card>
                      </Card>
                  )}
              </Col>

              <Col span={12}>
                  {selectedSecurity && (
                      <Card
                          title={
                              <div className='p-5'>
                                  {/* <Title level={4} style={{ color: '#389e0d', marginBottom: 0 }}>
                                      SELECTED SECURITY
                                  </Title> */}
                                  <Image
                                      src={`/storage/${selectedSecurity.securityPhoto}`}
                                      alt="Security Photo"
                                      width={50}
                                      height={50}
                                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                                      preview={false}
                                  />
                                  <Text type="secondary">{selectedSecurity.securityId}</Text>
                              </div>
                          }
                      >
                          <Text strong>Details</Text>
                          <Text style={{ display: 'block' }}>{selectedSecurity.securityName}</Text>
                      </Card>
                  )}
              </Col>
          </Row>

          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
              {current < steps.length - 1 && (
                  <Button
                      disabled={(selectedLocation === null && current === 0) || (selectedSecurity === null && current === 1)}
                      type="primary"
                      onClick={() => next()}
                  >
                      Next
                  </Button>
              )}
              {current === steps.length - 1 && (
                  <Button disabled={selectedSecurity === null} type="primary" onClick={() => message.success('Processing complete!')}>
                      Done
                  </Button>
              )}
              {current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                      Previous
                  </Button>
              )}
          </div>
      </div>
  );
};

export default AsignSecuirty;