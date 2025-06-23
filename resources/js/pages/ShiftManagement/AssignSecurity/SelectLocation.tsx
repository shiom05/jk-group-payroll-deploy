

import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getLocation } from '@/services/location.service';

interface Locations {
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

interface SelectLocationProps {
    onSelected: (location: Locations) => void;
    selectedLocation: Locations;
    locations: Locations[]
}

const SelectLocation = ({onSelected, selectedLocation, locations}: SelectLocationProps) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [locations, setLocations] = useState<Locations[]>([]);
  

  //    const fetchLocations = async()=>{
  //           const result = await getLocation();
  //           setLocations(result.data);
  //       }
    
        useEffect(()=>{
            // fetchLocations();
            setSelectedRowKeys([selectedLocation?.locationId])
        },[])
    
  
    const columns: ColumnsType<Locations> = [
      {
        title: 'Location Name',
        dataIndex: 'locationName',
        key: 'locationName',
        render: (text, record) => (
          <a onClick={() => onSelected(record)}>{text}</a>
        )
      },
      {
        title: 'Type',
        dataIndex: 'locationType',
        key: 'locationType',
        render: (type) => {
          let color = '';
          switch (type.toLowerCase()) {
            case 'office':
              color = 'blue';
              break;
            case 'warehouse':
              color = 'orange';
              break;
            case 'retail':
              color = 'green';
              break;
            default:
              color = 'gray';
          }
          return <Tag color={color}>{type.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true
      }
    ];
  
    const onSelectChange = (rowId: any, location: Locations[]) => {
     
      console.log(rowId)
      console.log(location)
      setSelectedRowKeys(rowId);
      const selected =  location.filter((row:Locations) => row.locationId === rowId[0] );
      console.log(selected)
      onSelected(selected[0]);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ],
    };
  
    return (
      <div>
        <Table
          rowKey="locationId"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={locations}
          pagination={{ pageSize: 5 }}
          onRow={(record: Locations) => ({
            onClick: () => {
              console.log(record)
              onSelected(record);
              setSelectedRowKeys([record.locationId]);
              
            },
          })}
        />
      </div>
    );
    

}

export default SelectLocation;