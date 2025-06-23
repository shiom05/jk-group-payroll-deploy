export default interface Location {
    locationId: any,
    locationName: string;
    locationType: string;
    address: string;
    isJkPropLocation: boolean;
  
    billing_OIC_HourlyRate: number;
    billing_JSO_HourlyRate: number;
    billing_CSO_HourlyRate: number;
    billing_LSO_HourlyRate: number;
    billing_SSO_HourlyRate: number;
  
    paying_OIC_HourlyRate: number;
    paying_JSO_HourlyRate: number;
    paying_CSO_HourlyRate: number;
    paying_LSO_HourlyRate: number;
    paying_SSO_HourlyRate: number;
  }