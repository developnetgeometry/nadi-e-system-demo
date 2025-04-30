export interface SiteClosureRequest {
    id: string;
    nd_closure_categories: {
        id: string;
        bm: string;
        eng: string;
    } | null; // Updated to handle object or null
    nd_closure_subcategories: {
        id: string;
        bm: string;
        eng: string;
    } | null; // Updated to handle object or null
    nd_closure_affect_areas: {
        bm: string;
        eng: string;
    } | null; // Updated to handle object or null
    close_start: string;
    close_end: string;
    session: string | null;
    duration: number | null;
    nd_closure_status: {
        id: number;
        name: string;
    }; // Updated to match query structure
    remark: string | null;
    nd_site_profile: {
        id: string;
        sitename: string;
        nd_site: {
            standard_code: string;
        }[];
        organizations: {
            id: string;
            name: string;
            type: string;
            parent_id?: {
                id: string;
                name: string;
            } | null; // Updated to handle object or null
        };
    } | null; // Updated to handle object or null
    created_by: string | null;
}

export interface SiteListClosureRequest {
    id: number;
    nd_closure_categories: {
        bm: string;
        eng: string;
    };  // Not an array
    close_start: string;
    close_end: string;
    duration: number;
    nd_closure_status: {
        name: string;
    };  // Not an array
    nd_site_profile: {
        sitename: string;
        nd_site: {
            standard_code: string;
        }[];
        organizations: {
            name: string;
            type: string;
            parent_id: {
                name: string;
            };
        };
    };  // Not an array
    requester_id: string;
    request_datetime: string;
}

export interface Closure_Status {
    id: number;
    name: string;
}
export interface ClosureCategory {
    id: number;
    bm: string;
    eng: string;
  }
  
  export interface ClosureSubCategory {
    id: number;
    bm: string;
    eng: string;
    nd_closure_categories: {
      id: number;
    }[];
  }
  
  export interface ClosureAffectArea {
    id: number;
    bm: string;
    eng: string;
  }

  export interface ClosureSession {
    id: number;
    bm: string;
    eng: string;
  }