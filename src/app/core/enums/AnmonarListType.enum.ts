export enum AnmonarListTypeEnums {
    UnPaid_Pathalogy = 1,
    Paid_Pathalogy = 2,

    UnPaid_PrivateAlmoner = 5,
    Paid_PrivateAlmoner = 6,


    UnPaid_Procedure = 1,
    Paid_Procedure = 2,

    UnPaid_Radiology = 3,
    Paid_Radiology = 4,


    xrayOrUltrasound = 'LTXRAY',
}

export enum AnmonarFilterTypeEnums {
    FilterByCNIC = 1,
    FilterByMobileNo = 2,
    FilterByMrNo = 3,
    FilterByBarcode = 4,
    FilterByBatchNumber = 5, // Using these filters in HCP as well.
}
export enum PathologyFilterTypeEnums {
    FilterByCNIC = 1,
    FilterByMobileNo = 2,
    FilterByMrNo = 3,
    FilterByBarcode = 4,
    FilterByBatchNumber = 5, // Using these filters in HCP as well.
}