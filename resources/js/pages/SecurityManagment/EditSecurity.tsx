import Layout from '@/layouts/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import Security from '@/types/jk/security';
import { getBankDetails } from '@/services/security-managment.service';
import { formatDateForInput } from '@/utils/security';
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
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';

const { TextArea } = Input;
const { Option } = Select;

interface editProps {
    securityData: Security,
    back: () => void;
}

const EditSecurity = ({ securityData, back }: editProps) => {
    const [form] = Form.useForm();
    const [bankForm] = Form.useForm();
    const { securityId } = securityData;
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

     const { notifySuccess, notifyError, contextHolder } = useNotification();

    const [formData, setFormData] = useState<any>({
        securityName: '',
        securityDob: '',
        securityNicNumber: '',
        securityPrimaryContact: '',
        securitySecondaryContact: '',
        securityPhoto: null,
        securityNicUploaded: false,
        securityPoliceReportUploaded: false,
        securityBirthCertificateUploaded: false,
        securityGramasewakaLetterUploaded: false,
        securityStatus: 300,
        securityDateOfJoin: '',
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
        securityEpfNumber: '',
        securityCurrentAddress: '',
        securityPermanentAddress: '',
        securityType: 'LSO',
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
        // Update security status if all documents are uploaded
        if (changedValues.securityNicUploaded !== undefined || 
            changedValues.securityPoliceReportUploaded !== undefined ||
            changedValues.securityBirthCertificateUploaded !== undefined ||
            changedValues.securityGramasewakaLetterUploaded !== undefined) {
            
            const allDocumentsUploaded = 
                (changedValues.securityNicUploaded ?? formData.securityNicUploaded) && 
                (changedValues.securityPoliceReportUploaded ?? formData.securityPoliceReportUploaded) && 
                (changedValues.securityBirthCertificateUploaded ?? formData.securityBirthCertificateUploaded) && 
                (changedValues.securityGramasewakaLetterUploaded ?? formData.securityGramasewakaLetterUploaded);
            
            if (allDocumentsUploaded) {
                allValues.securityStatus = 200;
            } else {
                allValues.securityStatus = 300;
            }
        }
        
        setFormData(allValues);
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

    const saveBankDetails = async () => {
        try {
            await axios.put(`/api/bank-details/${securityId}`, {...bankDetails, security_id: securityId});
            notifySuccess('SUCCESS', 'Bank details updated successfully');
            setTimeout(() => {
                router.get('/security-management');
            }, 2000);
        } catch (error) {
            console.error('Error saving bank details:', error);
            notifyError('ERROR', 'Something Went Wrong Updating Bank Details, Please Try Again To Save Bank Details!');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);        
        try {
            // Update security status based on document uploads
            if (formData.securityNicUploaded && formData.securityPoliceReportUploaded && 
                formData.securityBirthCertificateUploaded && formData.securityGramasewakaLetterUploaded) {
                values.securityStatus = 200;
            } else {
                values.securityStatus = 300;
            }

            if (values['securityPhoto']['fileList'] && values['securityPhoto']['fileList'].length>0) {
               values.securityPhoto = values['securityPhoto'].fileList[0]?.originFileObj ;
            }

            if( values['securityPhoto']['file'] &&  (values['securityPhoto']['fileList'] && values['securityPhoto']['fileList'].length === 0)){
                setLoading(false);
                return;
                // throw new Error("SecurityPhoto Removed or Not Uploaded")
            }

            values['securityId'] = securityId;
            await axios.put(`/api/securities/${securityId}`, values);
            await saveBankDetails();
            console.log("Security: ",values);
            console.log("Bank Details: ",{...bankDetails, security_id: securityId});
            notifySuccess('SUCCESS', 'Security personnel updated successfully');
        } catch (error) {
             notifyError('ERROR', 'Something Went Wrong, Failed to update security personnel, Please Try Again');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                const initialFormData = {
                    securityName: securityData.securityName,
                    securityDob: dayjs(securityData.securityDob),
                    securityNicNumber: securityData.securityNicNumber,
                    securityPrimaryContact: securityData.securityPrimaryContact,
                    securitySecondaryContact: securityData.securitySecondaryContact,
                    securityPhoto: securityData.securityPhoto,
                    securityNicUploaded: securityData.securityNicUploaded,
                    securityPoliceReportUploaded: securityData.securityPoliceReportUploaded,
                    securityBirthCertificateUploaded: securityData.securityBirthCertificateUploaded,
                    securityGramasewakaLetterUploaded: securityData.securityGramasewakaLetterUploaded,
                    securityStatus: securityData.securityStatus,
                    securityDateOfJoin: dayjs(securityData.securityDateOfJoin),
                    securityCurrentAddress: securityData.securityCurrentAddress,
                    securityPermanentAddress: securityData.securityPermanentAddress,
                    securityType: securityData.securityType,
                    securityGender: securityData.securityGender || 'male',
                    securityDistrict: securityData.securityDistrict || '',
                    securityPoliceDivision: securityData.securityPoliceDivision || '',
                    securityGramaNiladariDivision: securityData.securityGramaNiladariDivision || '',
                    securityEducationalInfo: securityData.securityEducationalInfo || '',
                    securityMaritalStatus: securityData.securityMaritalStatus || false,
                    securityPreviousWorkplace: securityData.securityPreviousWorkplace || '',
                    securityExperience: securityData.securityExperience || '',
                    securityEmergencyContactName: securityData.securityEmergencyContactName || '',
                    securityEmergencyContactAddress: securityData.securityEmergencyContactAddress || '',
                    securityEmergencyContactNumber: securityData.securityEmergencyContactNumber || '',
                    securityAdditionalInfo: securityData.securityAdditionalInfo || '',
                    securityEpfNumber: securityData.securityEpfNumber || '',
                };

                setFormData(initialFormData);
                form.setFieldsValue(initialFormData);

                const bankRes = await getBankDetails(securityId);
                const bankData = bankRes.data;

                const initialBankData = {
                    bank_name: bankData.bank_name || '',
                    bank_branch: bankData.bank_branch || '',
                    account_number: bankData.account_number || '',
                    bank_account_holder_name: bankData.bank_account_holder_name || '',
                    is_commercial_bank: bankData.is_commercial_bank || false,
                };

                setBankDetails(initialBankData);
                bankForm.setFieldsValue(initialBankData);

                if (securityData.securityPhoto) {
                    setFileList([{
                        uid: '-1',
                        name: `Click to View Me`,
                        status: 'done',
                        url: `storage/${securityData.securityPhoto}`,
                    }]);
                }
            } catch (error) {
                console.error('Error fetching security data:', error);
            }
        };

        fetchSecurityData();
    }, [securityId]);

    return (
        
        <div className='pt-20 pb-20 mx-auto max-w-3xl space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg'>
            {contextHolder}
            {loading && <Loader/>}
            <Card 
                title="Edit Security Personnel" 
                className="mx-auto max-w-3xl"
                extra={
                    <Button onClick={back}>
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
                                <DatePicker className="w-full" format="YYYY-MM-DD" />
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
                        label="EPF Number"
                        name="securityEpfNumber"
                    >
                        <Input />
                    </Form.Item>

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
                        // rules={ securityData.securityPhoto?[{ required: true, message: 'Please Upload Photo' }]: []}
                        rules={ [{ required: true, message: 'Please Upload Photo' }]}
                  
                    >
                        <Upload
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            maxCount={1}
                            listType="picture"
                            
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
                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                    </Form.Item>

                    <Divider orientation="left">Bank Details</Divider>

                    <Form
                        form={bankForm}
                        layout="vertical"
                        onValuesChange={handleBankDetailChange}
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
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditSecurity;