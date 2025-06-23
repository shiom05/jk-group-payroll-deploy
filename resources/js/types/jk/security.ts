export default interface Security {
    securityId: string;
    securityName: string;
    securityDob: string | Date; // Can be either string or Date object
    securityNicNumber: string;
    securityPrimaryContact: string;
    securitySecondaryContact?: string; // Optional secondary contact
    securityPhoto?: string; // URL, base64 string, or file path
    securityNicUploaded: boolean;
    securityPoliceReportUploaded: boolean;
    securityBirthCertificateUploaded: boolean;
    securityGramasewakaLetterUploaded: boolean;
    securityStatus:number// Union type
    securityDateOfJoin: string | Date; // Can be either string or Date object

    securityPermanentAddress: string;
    securityCurrentAddress: string;
    securityGender: 'male' | 'female';
    securityDistrict: string;
    securityPoliceDivision: string;
    securityGramaNiladariDivision: string;
    securityEducationalInfo: string;
    securityMaritalStatus: boolean;
    securityPreviousWorkplace: string;
    securityExperience: string;
    securityEmergencyContactName: string;
    securityEmergencyContactAddress: string;
    securityEmergencyContactNumber: string;
    securityAdditionalInfo?: string;
    securityType: 'LSO' | 'OIC' | 'JSO' | 'SSO' | 'CSO';
    securityEpfNumber?: string;
    bank_details: any;

    resignationEffectiveDate?: string | Date;
    resignationReason?: string;
    resignationAdditionalInfo?: string;
    securityIsResigned?: boolean;
    hasReturnedAllAssets?: boolean;
    
    
  }