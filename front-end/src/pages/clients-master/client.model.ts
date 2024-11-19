// client.model.ts

export interface Contact {
    co_id?: string; // Optional contact ID
    co_name: string; // Contact name (required)
    co_position_hr?: string; // Optional position in HR
    co_email: string; // Contact email (required)
    co_phno: string; // Contact phone number (required)
}

export interface ClientWithContacts {
    cl_id?: string; // Optional client ID
    cl_name: string; // Client name (required)
    cl_email?: string; // Optional client email
    cl_phno?: string; // Optional client phone number
    cl_addr?: string; // Optional client address
    cl_map_url?: string; // Optional URL for the client map
    cl_type?: string; // Optional client type
    cl_notes?: string; // Optional notes about the client
    created_by?: string; // Optional information about who created the client
    contacts: Contact[]; // List of contacts associated with the client (required)
    formType?: 'add' | 'update' | 'view';
}
