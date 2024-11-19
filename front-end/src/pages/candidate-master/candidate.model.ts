export interface Candidate {
  cd_id: string; // Candidate ID
  cd_first_name: string; // Candidate's first name
  cd_last_name?: string; // Candidate's last name (optional)
  cd_email: string; // Candidate's email
  cd_phno: string; // Candidate's phone number
  cd_qual: string; // Candidate's qualification
  cd_total_exp: number; // Total experience in years
  cd_related_exp?: number; // Related experience in years (optional)
  cd_loc: string;
  cd_skills:string;
  cd_cur_ctc: number; // Current CTC (Cost to Company)
  cd_exp_ctc: number; // Expected CTC
  cd_notice: string; // Notice period
  cd_work_mode: string; // Work mode (e.g., remote, on-site, hybrid)
  cd_valid_passport?: boolean; // Valid passport status (optional)
  created_by?: string; // Creator's identifier (optional)
  created_at?: Date; // Creation date (optional)
  cl_id?: string; 
  rq_id?: string; // Requirement ID (added this property)
}
export interface Client {
  cl_id: string; // Client ID
  cl_name: string; // Client name
}

export interface Requirement {
  rq_id: string; // Requirement ID
  rq_name: string; // Requirement name
}
