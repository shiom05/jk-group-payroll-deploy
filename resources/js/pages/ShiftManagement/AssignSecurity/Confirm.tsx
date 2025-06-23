import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';
import { assignSecurityToLocation } from '@/services/securityLocationAllocation.service';
import Location from '@/types/jk/location';
import Security from '@/types/jk/security';
import { Image, Button } from 'antd';
import { useState } from 'react';
import { router } from '@inertiajs/react';
interface ConfirmProps {
    selectedLocation: Location;
    selectedSecurity: Security;
}


const Confirm = ({ selectedLocation, selectedSecurity }: ConfirmProps) => {

     const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

    const handleAllocation = async()=>{ 
        const data = {
            security_id: selectedSecurity.securityId,
            location_id: selectedLocation.locationId 
        }
        setLoading(true);
        try {
        const result = await assignSecurityToLocation(data);
        notifySuccess('SUCCESS', 'Security assigned to location successfully');
        console.log(result);
        setTimeout(() => {
            router.get("/shift-management"); 
        }, 1000);
        } catch (error) { 
             notifyError('ERROR', 'Failed to assign security to location');
        }finally{
            setLoading(false);
        }
    }
 
    
    return (
        <>

        <div className='flex flex-col gap-y-1! p-5 items-center leading-normal'>
               {contextHolder}
      {loading && <Loader/>} 
            {selectedLocation &&  <h1>Locations Name: {selectedLocation.locationName}</h1>}
            {selectedSecurity && <h1>Security Name: {selectedSecurity.securityName}</h1>}

            <Button type="primary" onClick={handleAllocation} disabled={!selectedLocation || !selectedSecurity} htmlType="button">
                Add Allocation
            </Button>
        </div>
      

        </>
    );
};

export default Confirm;
