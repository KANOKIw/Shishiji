export interface OrgAuthDataRecord extends DBColumn {
    org_name: string;
    pass_word: string;
    cloud_size: number;
    confidence: string;
}

export interface OrgAuthSessionRecord extends DBColumn {
    sessionid: string;
    corresponder: string;
}

export interface OrgAdmissionData{
    entered_total: number;
    entered_groups: number;
    entered_data: string;
    duped_entered_total: number;
    duped_entered_groups: number;
    duped_entered_data: string;
}

export interface OrgDataRecord{
    org_name: string;
    /** includes `duped_entered` */
    entered_total: number;
    entered_groups: number;
    entered_data: string;
    duped_entered_total: number;
    duped_entered_groups: number;
    duped_entered_data: string;
    fame: number;
    visitpt: number;
}


export { }
