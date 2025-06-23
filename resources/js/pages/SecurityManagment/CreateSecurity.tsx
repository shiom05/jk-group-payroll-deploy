import Layout from '@/layouts/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';
import { 
  Form, 
  Input, 
  DatePicker, 
  Radio, 
  Checkbox, 
  Select, 
  Upload, 
  Button, 
  Card, 
  Divider,
  Row,
  Col
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const CreateSecurity = () => {
  const [form] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { notifySuccess, notifyError, contextHolder } = useNotification();
  const [fileList, setFileList] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    securityName: '',
    securityId:'',
    securityDob: '',
    securityNicNumber: '',
    securityCurrentAddress: '',
    securityPermanentAddress: '',
    securityPrimaryContact: '',
    securitySecondaryContact: '',
    securityPhoto: null,
    securityNicUploaded: false,
    securityPoliceReportUploaded: false,
    securityBirthCertificateUploaded: false,
    securityGramasewakaLetterUploaded: false,
    securityStatus: 300,
    securityDateOfJoin: '',
    securityType: 'LSO',
    securityGender: 'male',
    securityDistrict: '',
    securityPoliceDivision: '',
    securityGramaNiladariDivision: '',
    securityEducationalInfo: '',
    securityMaritalStatus: false,
    securityPreviousWorkplace: '',
    securityExperience: '',
    securityEmergencyContactName: '',
    securityEmergencyContactAddress: '',
    securityEmergencyContactNumber: '',
    securityAdditionalInfo: '',
  });

  const [bankDetails, setBankDetails] = useState<any>({
    bank_name: '',
    bank_branch: '',
    account_number: '',
    bank_account_holder_name: '',
    is_commercial_bank: false,
  });

  const handleBankDetailChange = (changedValues: any, allValues: any) => {

    setBankDetails(allValues);
  };

  const handleChange = (changedValues: any, allValues: any) => {
    console.log(formData);
    setFormData({...formData, ...allValues});
  };

  const handleFileChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
    if (fileList.length > 0) {
      setFormData({
        ...formData,
        securityPhoto: fileList[0].originFileObj,
      });
    }
  };

  const saveBankDetails = async (id: any) => {
    const data = new FormData();
    for (const key in bankDetails) {
      if (bankDetails[key] !== null) {
        data.append(key, bankDetails[key]);
      }
    }
    data.append('security_id', id);

    try {
      let response = await axios.post('/api/bank-details', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setShowAlert(false);
      notifySuccess('SUCCESS', 'Bank Details Saved Successfully');
      setTimeout(() => {
        router.get("/security-management");
      }, 3000);
    } catch (error) {
      console.error('Error saving bank details:', error);
      setShowAlert(false);
      notifyError('ERROR', 'Something Went Wrong Saving Bank Details, Please Try Again To Save Bank Details!');
    }
  };

  const createLeaveBalanceRecord = async (id: any) => {  
    try {
      await axios.post('/api/security-leave-balances', {security_id: id});
    } catch (error) {
      console.error('Failed to create leave balance:', error);
    }
  };

  const onFinish = async (values: any) => {
    setShowAlert(true);
    const data = new FormData();
    
    for (const key in formData) {
      if (key === 'securityPhoto' && formData[key] && formData[key]['fileList']) {
        data.append(key, formData[key].fileList[0]?.originFileObj);
      } else if (key === 'securityStatus') {
        if (formData['securityNicUploaded'] && formData['securityPoliceReportUploaded'] && 
            formData['securityBirthCertificateUploaded'] && formData['securityGramasewakaLetterUploaded']) {
          data.append(key, '200');
        }
      } else if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      let response = await axios.post('/api/securities', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      notifySuccess('SUCCESS', 'Create Security Completed Successfully');
      saveBankDetails(response.data.securityId);
    //   createLeaveBalanceRecord(response.data.securityId);
    } catch (error) {
      console.error('Error saving security:', error);
      setShowAlert(false);
      notifyError('ERROR', 'Something Went Wrong, Please Try Again');
    }
  };

  return (
    <Layout>
      {contextHolder}
      {showAlert && <Loader/>}
      <div className="pt-20 pb-20 mx-auto max-w-3xl space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg">
        <Card 
          title="Security Personnel Form" 
          className="mx-auto max-w-3xl"
          extra={
            <Button onClick={() => router.get('/security-management')}>
              Cancel
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleChange}
            initialValues={formData}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="SecurityId"
                  name="securityId"
                  rules={[{ required: true, message: 'Please enter security Id' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
               <Col span={12}>
                <Form.Item
                  label="Name"
                  name="securityName"
                  rules={[{ required: true, message: 'Please enter name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Security Type"
                  name="securityType"
                  rules={[{ required: true, message: 'Please select security type' }]}
                >
                  <Select>
                    <Option value="LSO">LSO</Option>
                    <Option value="OIC">OIC</Option>
                    <Option value="JSO">JSO</Option>
                    <Option value="SSO">SSO</Option>
                    <Option value="CSO">CSO</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Date of Birth"
                  name="securityDob"
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="NIC Number"
                  name="securityNicNumber"
                  rules={[{ required: true, message: 'Please enter NIC number' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Current Address"
              name="securityCurrentAddress"
              rules={[{ required: true, message: 'Please enter current address' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Permanent Address"
              name="securityPermanentAddress"
              rules={[{ required: true, message: 'Please enter permanent address' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Primary Contact"
                  name="securityPrimaryContact"
                  rules={[{ required: true, message: 'Please enter primary contact' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Secondary Contact"
                  name="securitySecondaryContact"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Gender"
              name="securityGender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="District"
                  name="securityDistrict"
                  rules={[{ required: true, message: 'Please enter district' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Police Division"
                  name="securityPoliceDivision"
                  rules={[{ required: true, message: 'Please enter police division' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Grama Niladari Division"
                  name="securityGramaNiladariDivision"
                  rules={[{ required: true, message: 'Please enter grama niladari division' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Educational Info"
                  name="securityEducationalInfo"
                  rules={[{ required: true, message: 'Please enter educational info' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="securityMaritalStatus"
              valuePropName="checked"
            >
              <Checkbox>Married</Checkbox>
            </Form.Item>

            <Form.Item
              label="Previous Workplace"
              name="securityPreviousWorkplace"
              rules={[{ required: true, message: 'Please enter previous workplace' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Experience"
              name="securityExperience"
              rules={[{ required: true, message: 'Please enter experience' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Emergency Contact Name"
                  name="securityEmergencyContactName"
                  rules={[{ required: true, message: 'Please enter emergency contact name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Emergency Contact Number"
                  name="securityEmergencyContactNumber"
                  rules={[{ required: true, message: 'Please enter emergency contact number' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Emergency Contact Address"
              name="securityEmergencyContactAddress"
              rules={[{ required: true, message: 'Please enter emergency contact address' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Additional Info"
              name="securityAdditionalInfo"
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Photo"
              name="securityPhoto"
            >
              <Upload
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>

            <Card title="Uploads" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="securityNicUploaded"
                    valuePropName="checked"
                  >
                    <Checkbox>NIC Uploaded</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="securityPoliceReportUploaded"
                    valuePropName="checked"
                  >
                    <Checkbox>Police Report Uploaded</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="securityBirthCertificateUploaded"
                    valuePropName="checked"
                  >
                    <Checkbox>Birth Certificate Uploaded</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="securityGramasewakaLetterUploaded"
                    valuePropName="checked"
                  >
                    <Checkbox>Gramasewaka Letter Uploaded</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Form.Item
              label="Date of Join"
              name="securityDateOfJoin"
              rules={[{ required: true, message: 'Please select date of join' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Divider orientation="left">Security Bank Details Form</Divider>

            <Form
              form={bankForm}
              layout="vertical"
              onValuesChange={handleBankDetailChange}
              initialValues={bankDetails}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Bank Name"
                    name="bank_name"
                    rules={[{ required: true, message: 'Please enter bank name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Bank Branch"
                    name="bank_branch"
                    rules={[{ required: true, message: 'Please enter bank branch' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Account Number"
                    name="account_number"
                    rules={[{ required: true, message: 'Please enter account number' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Account Holder Name"
                    name="bank_account_holder_name"
                    rules={[{ required: true, message: 'Please enter account holder name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="is_commercial_bank"
                valuePropName="checked"
              >
                <Checkbox>Is Commercial Bank</Checkbox>
              </Form.Item>
            </Form>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateSecurity;