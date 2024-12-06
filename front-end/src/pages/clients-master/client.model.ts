// client.model.ts
export interface Contacts {
    co_name: string;
    co_position_hr: string;
    co_phno: string;
    co_email: string;
  }
  
  export interface ClientWithContacts {
    cl_id?: string;
    cl_name: string;
    cl_type: string;
    cl_email: string;
    cl_co_per_name: string;
    cl_addr: string;
    cl_map_url: string;
    cl_phno: string;
    cl_si_ag: boolean;
    cl_notes: string;
    contacts: Contacts[];
  }