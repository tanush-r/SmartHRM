// requirement.model.ts

export interface Requirement {
        rq_id: string;               // Unique identifier for the requirement
        cl_id: string;               // Unique identifier for the associated client
        rq_name: string;             // Requirement name
        rq_loc: string;              // Location of the requirement
        rq_no_pos: number;           // Number of positions available
        rq_qual?: string;            // Qualifications (optional)
        rq_skills: string;           // Skills required
        rq_exp: number;              // Experience required (in years)
        rq_budget?: number;          // Budget for the requirement (optional)
        rq_work_mode?: string;       // Work mode (optional)
        rq_start_date?: string;      // Start date (optional)
        rq_no_of_days?: string;      // Number of days (optional)
        rq_notes?: string;           // Additional notes (optional)
        created_by?: string;         // Creator of the requirement (optional)
        rq_map_url?: string;         // Link to the map (optional) <-- Added this line   
    }
    
  
// Define the Client interface
export interface Client {
    cl_id: string;   // Unique identifier for the client
    cl_name: string; // Name of the client
}
