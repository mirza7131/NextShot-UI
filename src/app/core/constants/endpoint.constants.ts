
export class EndPointConstant {

    //#region Menu
    static Menu: any =
        {
            Controller: '/Menu/',
            GetAll: () => this.Menu.Controller + 'GetAll',
            GetAllModules: () => this.Menu.Controller + 'GetAllModules',
            GetAllMenuAccessByUserRole: () => this.Menu.Controller + 'GetAllMenuAccessByUserRole',
            GetModuleListByRoleId: () => this.Menu.Controller + 'GetModulesListByRoleId?RoleId=',
            GetCompleteModuleListByRoleId: () => this.Menu.Controller + 'GetCompleteModuleListByRoleId?RoleId=',
            GetAllUserPermissions: () => this.Menu.Controller + 'GetAllUserPermissions'

        }

    //#endregion

    //#region ProfileType
    static ProfileType: any =
        {
            Controller: '/ProfileType/',
            GetAll: () => this.ProfileType.Controller + 'GetAll',
            GetAllWithPagination: () => this.ProfileType.Controller + 'GetAllWithPagination?',

        }

    //#endregion

    //#region Profile
    static Profile: any =
        {
            Controller: '/Profile/',
            GetAllWithProfileType: () => this.Profile.Controller + 'GetAllWithProfileType',
            GetProfileByProfileType: () => this.Profile.Controller + 'GetProfileByProfileType?ProfileType=',
            GetDataByProfile: () => this.Profile.Controller + 'GetDataByProfile?ProfileType=',
            IndicatorDetailData: ()=>this.Profile.Controller + 'IndicatorDetailData'

        }
    //#endregion

    //#region Role
    static Role: any =
        {
            Controller: '/Role/',
            GetRoleMenuAccess: () => this.Role.Controller + 'GetRoleMenuAccess',
            GetRoleMenuAccessByRoleId: () => this.Role.Controller + 'GetRoleMenuAccess?RoleId=',
            GetAllWithPagination: () => this.Role.Controller + 'GetAllWithPagination?',
        }
    //#endregion

    //#region RoleMenu
    static RoleMenu: any =
        {
            Controller: '/RoleMenu/',
            GetRoleMenuAccess: () => this.RoleMenu.Controller + 'GetRoleMenuAccess',
            GetRoleMenuAccessByRoleId: () => this.RoleMenu.Controller + 'GetRoleMenuAccess?RoleId=',

        }
    //#endregion

    //#region User
    static User: any =
        {
            Controller: '/User/',
            GetUserRolesByUserId: () => this.User.Controller + 'GetUserRolesByUserId?Id=',
            GetUserAssignableRolesById: () => this.User.Controller + 'GetUserAssignableRoles?input=',
            GetHrUserByCnic: () => this.User.Controller + 'GetHrUserByCnic?Cnic=',
            GetByCnic: () => this.User.Controller + 'GetByCnic?Cnic=',
            GetAllWithPagination: () => this.User.Controller + 'GetAllWithPagination?',
            GetAll: () => this.User.Controller + 'GetAll',
            GetAllByUserLevelwise: () => this.User.Controller + 'GetAllByUserLevelwise?',
            // GetAllByUserLevelwise: () => this.User.Controller + 'GetAllByUserLevelwise'


        }
    //#endregion


    //#region DataSyncToOffline
    static DataSyncToOffline: any =
        {
            Controller: '/DataSyncToOffline/',
            SyncData: () => this.DataSyncToOffline.Controller + 'SyncData',
            GetAllByUserLevelwise: () => this.DataSyncToOffline.Controller + 'GetAllByUserLevelwise?',
            // GetAllByUserLevelwise: () => this.User.Controller + 'GetAllByUserLevelwise'


        }
    //#endregion

    //#region LabTest
    static HfLabTestConfig: any =
        {
            Controller: '/HfLabTestConfig/',
            GetHfLabTestConfigByHealthFacilityId: () => this.HfLabTestConfig.Controller + 'GetHfLabTestConfigByHealthFacilityId?HealthFacilityId=',
            GetAllConfigHealthFacilitiesByFilters: () => this.HfLabTestConfig.Controller + 'GetAllConfigHealthFacilitiesByFilters?',
            CreateOrEdit: () => this.HfLabTestConfig.Controller + 'CreateOrEdit',
            // GetAllByDepartmentId: () => this.HfLabTestConfig.Controller + 'GetAllByDepartmentId?DepartmentProfileId=',
            // GetAllWithPagination: () => this.HfLabTestConfig.Controller + 'GetAllWithPagination?',
        }
    //#endregion

    //#region LabTest
    static LabTest: any =
        {
            Controller: '/LabTest/',
            GetAll: () => this.LabTest.Controller + 'GetAll',
            GetAllWithHealthFacilityId: () => this.LabTest.Controller + 'GetAllWithHealthFacilityId',
            GetAllCacheLabTest: () => this.LabTest.Controller + 'GetAllCacheLabTest',
            GetAllByDepartmentId: () => this.LabTest.Controller + 'GetAllByDepartmentId?DepartmentProfileId=',
            GetAllWithPagination: () => this.LabTest.Controller + 'GetAllWithPagination?',
        }
    //#endregion

    //#region LabTestDetail
    static LabTestDetail: any =
        {
            Controller: '/LabTestDetail/',
        }
    //#endregion

    //#region MedicineDispatch
    static MedicineDispatch: any =
        {
            Controller: '/MedicineDispatch/',
            CreatePatientDispatch: () => this.MedicineDispatch.Controller + 'CreatePatientDispatch',
            GetAllQue: () => this.MedicineDispatch.Controller + 'GetAllQue?HealthFacilityId=',
            GetAllIpdQue: () => this.MedicineDispatch.Controller + 'GetAllIpdQue?HealthFacilityId=',
            GetPharmacySlipByVisitId: () => this.MedicineDispatch.Controller + 'GetPharmacySlipByVisitId?VisitId=',
            GetAllPharmacyList: () => this.MedicineDispatch.Controller + 'GetAllPharmacyList',

        }
    //#endregion

    //#region DepartmentLookup
    static DepartmentLookup: any =
        {
            Controller: '/DepartmentLookup/',
            GetAllWithPagination: () => this.DepartmentLookup.Controller + 'GetAllWithPagination?',

        }
    //#endregion


    //#region SectionLookup
    static SectionLookup: any =
        {
            Controller: '/SectionLookup/',
            GetAllWithDepartment: () => this.SectionLookup.Controller + 'GetAllWithDepartment',
            GetByDepartmentId: () => this.SectionLookup.Controller + 'GetByDepartmentId',
        }
    //#endregion

    //#region HealthFacilityDepartment
    static HealthFacilityDepartment: any =
        {
            Controller: '/HfDepartment/',
            GetAllWithDepartment: () => this.HealthFacilityDepartment.Controller + 'GetAllWithDepartment?',
            // GetHfDepartmentsByHealthFacilityId :  () => this.HealthFacilityDepartment.Controller + 'GetHfDepartmentsByHealthFacilityId?HfId=',
            GetHfDepartmentsByHealthFacility: () => this.HealthFacilityDepartment.Controller + 'GetHfDepartmentsByHealthFacility?HealthFacilityId=',
            GetDepartmentAndSectionByHealthFacility: () => this.HealthFacilityDepartment.Controller + 'GetDepartmentAndSectionByHealthFacility?HealthFacilityId=',

        }
    //#endregion

    //#region PatientAdmissionDetails
    static PatientAdmissionDetail: any =
        {
            Controller: '/PatientAdmissionDetail/',

            CreateOrEdit: () => this.PatientAdmissionDetail.Controller + 'CreateOrEdit',
            GetAdmissionDetailByVisitId: () => this.PatientAdmissionDetail.Controller + 'GetAdmissionDetailByVisitId?VisitId=',
            // GetAllWithDepartment :  () => this.PatientAdmissionDetail.Controller + 'GetAllWithDepartment?',
            // GetHfDepartmentsByHealthFacilityId :  () => this.HealthFacilityDepartment.Controller + 'GetHfDepartmentsByHealthFacilityId?HfId=',
            // GetHfDepartmentsByHealthFacility: () => this.PatientAdmissionDetail.Controller + 'GetHfDepartmentsByHealthFacility?HealthFacilityId=',
        }
    //#endregion

    //#region HealthFacilityStation
    static HealthFacilityStation: any =
        {
            Controller: '/HealthFacilityStation/',
            getAllStationWithDetails: () => this.HealthFacilityStation.Controller + 'GetAllWithDetails?',

            GetAllWithDepartment: () => this.HealthFacilityStation.Controller + 'GetAllWithDepartment',
            // GetHfDepartmentsByHealthFacilityId :  () => this.HealthFacilityDepartment.Controller + 'GetHfDepartmentsByHealthFacilityId?HfId=',
            GetHfDepartmentsByHealthFacility: () => this.HealthFacilityStation.Controller + 'GetHfDepartmentsByHealthFacility',
        }
    //#endregion

    //#region HealthFacility
    static HealthFacility: any =
        {
            Controller: '/HealthFacility/',
            GetAllHealthFacility: () => this.HealthFacility.Controller + 'GetAllHealthFacility?',
            GetAllWithPagination: () => this.HealthFacility.Controller + 'GetAllWithPagination?',
            GetAllForConsignment: () => this.HealthFacility.Controller + 'GetAllForConsignment',
        }
    //#endregion

    //#region HealthFacilityDepartmentSection
    static HealthFacilityDepartmentSection: any =
        {
            Controller: '/HfDepartmentSection/',
            GetAllWithDepartmentSection: () => this.HealthFacilityDepartmentSection.Controller + 'GetAllWithDepartmentSection',
            GetHfDepartmentSectionsByHfDepartmentId: () => this.HealthFacilityDepartmentSection.Controller + 'GetHfDepartmentSectionsByHfDepartmentId?HfDepartmentId=',
            DeleteByHfDepartmentId: () => this.HealthFacilityDepartmentSection.Controller + 'DeleteByHfDepartmentId?HfDepartmentId=',
            GetBedsBySectionId: () => this.HealthFacilityDepartmentSection.Controller + 'GetBedsBySectionId?',
            BulkCreateOrEdit: () => this.HealthFacilityDepartmentSection.Controller + 'BulkCreateOrEdit',

        }
    //#endregion

    //#region Patient
    static Patient: any =
        {
            Controller: '/Patient/',
            GetByKeys: () => this.Patient.Controller + 'GetByKeys?SearchKey=',
            GetByMrNo: () => this.Patient.Controller + 'GetByMrNo?MrNo=',
            CreateOrEditWithVisit: () => this.Patient.Controller + 'CreateOrEditWithVisit',
            CreateUnknownPatient: () => this.Patient.Controller + 'CreateUnknownPatient',
            CreatePmis: () => this.Patient.Controller + 'CreatePmis',
            CreatePatientHistory: () => this.Patient.Controller + 'CreatePatientHistory',
            SaveFeePayment: () => this.Patient.Controller + 'SaveFeePayment',
            RefundFee: () => this.Patient.Controller + 'RefundFee',
            GetById: () => this.Patient.Controller + 'GetById?Id=',
            GetByIdWithDetails: () => this.Patient.Controller + 'GetByIdWithDetails?Id=',
            PatientVisitHistory: () => this.Patient.Controller + 'PatientVisitHistory?PatientId=',
            PatientVisitDetailById: () => this.Patient.Controller + 'PatientVisitDetailById?VisitId=',
            GetPatientVisitForVitalById: () => this.Patient.Controller + 'PatientVisitDetailsForVitalById?VisitId=',
            GetPatientVisitForDoctorById: () => this.Patient.Controller + 'GetPatientVisitForDoctorById?VisitId=',
            GetPatientVisitForMlcDoctorById: () => this.Patient.Controller + 'GetPatientVisitForMlcDoctorById?VisitId=',
            GetPatientVisitForPharmacyById: () => this.Patient.Controller + 'PatientVisitDetailsForPharmacyById?VisitId=',
            GetPatientDiagnoseRecordByVisitId: () => this.Patient.Controller + 'GetPatientDiagnoseRecordByVisitId?VisitId=',
            GetAllQueForIpd: () => this.Patient.Controller + 'GetAllQueForIpd?HealthFacilityId=',
            GetTbPatientsList: () => this.Patient.Controller + 'GetTbPatientsList',
            GetUnknownPatientsList: () => this.Patient.Controller + 'GetUnknownPatientsList',
            GetMortauryPatientsList: () => this.Patient.Controller + 'GetMortauryPatientsList',
            GetTbPatientContactListByPatientId: () => this.Patient.Controller + 'GetTbPatientContactListByPatientId',
            UpdateSputumById: () => this.Patient.Controller + 'UpdateSputumById?ContactId=',
            GetPatientDischargeReceiptForIpdById: () => this.Patient.Controller + 'PatientDischargeReceiptForIpdById?VisitId=',
            IsPatientAdviseMedicineInLastVisit: () => this.Patient.Controller + 'IsPatientAdviseMedicineInLastVisit?Cnic=',
            CreatePatientContactDetails: () => this.Patient.Controller + 'CreatePatientContactDetails',
            AddNewAdditionalPatientInfo: () => this.Patient.Controller + 'AddNewAdditionalPatientInfo',
            VerifyWithNADRA: () => this.Patient.Controller + 'VerifyWithNADRA',
            GetVerifiedPatientDataFromNADRA: () => this.Patient.Controller + 'GetVerifiedPatientDataFromNADRA?PatientId=',
            GetVerifiedPatientDataFromNADRAForDeadBody: () => this.Patient.Controller + 'GetVerifiedPatientDataFromNADRAForDeadBody?PatientId=',
            GetEyeBlindnessPatientList: () => this.Patient.Controller + 'GetEyeBlindnessPatientList',
            GetPatientAdditionalInfoByPatientId: () => this.Patient.Controller + 'GetPatientAdditionalInfoByPatientId?PatientId=',
            GetPatientAdditionalInfoByPatientIdPme: () => this.Patient.Controller + 'GetPatientAdditionalInfoByPatientIdPme?PatientId=',
            GetExcelExportEyeBlindnessPatientList: () => this.Patient.Controller + 'GetExcelExportEyeBlindnessPatientList',
            GetPatientVisitForEmergencyDoctorById: () => this.Patient.Controller + 'GetPatientVisitForEmergencyDoctorById?VisitId=',
            GetLostOfFollowupPatients: () => this.Patient.Controller + 'GetLostOfFollowupPatients',
            GetSvrPcrPendingPatients: () => this.Patient.Controller + 'GetSvrPcrPendingPatients',
            CheckRoomNoForSpeciality: () => this.Patient.Controller + 'CheckRoomNoForSpeciality?healthFacilityId=',
            GetFeePaymments: () => this.Patient.Controller + 'GetFeePaymments',
            UpdatePrintStatusPatientDiagnose: () => this.Patient.Controller + 'UpdatePrintStatusPatientDiagnose?PatientDiagnoseId=',
            CheckIfPatientVisitExist: () => this.Patient.Controller + 'CheckIfPatientVisitExist?PatientId=',
            GetAlmonerSpecialityFeeStat: () => this.Patient.Controller + 'GetAlmonerSpecialityFeeStat?',
            GetAlmonerDentalProcedureStat: () => this.Patient.Controller + 'GetAlmonerDentalProcedureStat?',
            GetAlmonerDentalProcedureListWithPagination: () => this.Patient.Controller + 'GetAlmonerDentalProcedureListWithPagination?',
            GetAnmonalSpecilityFeeListWithPagination: () => this.Patient.Controller + 'GetAnmonalSpecilityFeeListWithPagination?',
            // api/Patient/PatientDischargeReceiptForIpdById
        }
    //#endregion

    //#region PatientOpenVisit
    static PatientOpenVisit: any =
        {
            Controller: '/PatientOpenVisit/',
            GetTodayVisits: () => this.PatientOpenVisit.Controller + 'GetTodayVisits',
            UpdateSscStatusAndDocumentDto: () => this.PatientOpenVisit.Controller + 'UpdateSscStatusAndDocumentDto',
            GetOldVisits: () => this.PatientOpenVisit.Controller + 'GetOldVisits',
            GetPatientVisitsListWithDetail: () => this.PatientOpenVisit.Controller + 'GetPatientVisitsListWithDetail',
            GetIPDPatientVisitsListWithDetail: () => this.PatientOpenVisit.Controller + 'GetIPDPatientVisitsListWithDetail',
            GetAllQue: () => this.PatientOpenVisit.Controller + 'GetAllQue?SearchValue=',
            ReleaseOccupiedPatientVisit: () => this.PatientOpenVisit.Controller + 'ReleaseOccupiedPatientVisit?VisitId=',
            GetDischargedPatientVisitsListWithDetail: () => this.PatientOpenVisit.Controller + 'GetDischargedPatientVisitsListWithDetail',
            UpdatePatientVisitForSscClaimed: () => this.PatientOpenVisit.Controller + 'UpdatePatientVisitForSscClaimed',
            GetDischargedButNotSscClaimedPatientVisitsListWithDetail: () => this.PatientOpenVisit.Controller + 'GetDischargedButNotSscClaimedPatientVisitsListWithDetail',
            GetSscClaimConfirmPatientVisitsListWithDetail: () => this.PatientOpenVisit.Controller + 'GetSscClaimConfirmPatientVisitsListWithDetail',
            UpdatePatientEligibleForSSC: () => this.PatientOpenVisit.Controller + 'UpdatePatientEligibleForSSC',


        }

    //#endregion

    static PatientDischargeDetail: any = {

        Controller: '/PatientDischargeDetail/',
        DischargePatientVisit: () => this.PatientDischargeDetail.Controller + 'DischargePatientVisit',
        GetDischargeDetailByVisitId: () => this.PatientDischargeDetail.Controller + 'GetDischargeDetailByVisitId?VisitId=',

    }
    //#region PatientOpenVisit
    static PatientDocument: any =
        {
            Controller: '/PatientDocument/',
            // GetAllQue: () => this.PatientDocument.Controller + 'GetAllQue?HealthFacilityId=',
            CreateOrEditPatientDocument: () => this.PatientDocument.Controller + 'CreateOrEditPatientDocument',
            GetByVisitId: () => this.PatientDocument.Controller + 'GetByVisitId?VisitId=',
            GetById: () => this.PatientDocument.Controller + 'GetByVisitId?Id=',
            GetAll: () => this.PatientDocument.Controller + 'GetAll',
        }
    //#endregion

    //#region PatientVital

    static PatientVital: any =
        {
            Controller: '/PatientVital/',
            GetAllQue: () => this.PatientVital.Controller + 'GetAllQue?HealthFacilityId=',
            CreateOrEditPatientVitals: () => this.PatientVital.Controller + 'CreateOrEditPatientVitals',
            GetByVisitId: () => this.PatientVital.Controller + 'GetByVisitId?VisitId=',
            GetAllPatientVitalsList: () => this.PatientVital.Controller + 'GetAllPatientVitalsList',
            GetRefferedPatientVitalsList: () => this.PatientVital.Controller + 'GetRefferedPatientVitalsList',
        }
    //#endregion

    //#region PatientDiagnose
    static PatientDiagnose: any =
        {
            Controller: '/PatientDiagnose/',
            GetAllQue: () => this.PatientDiagnose.Controller + 'GetAllQue?HealthFacilityId=',
            GetAllQueMlc: () => this.PatientDiagnose.Controller + 'GetAllQueMlc?HealthFacilityId=',
            GetAllIpdQue: () => this.PatientDiagnose.Controller + 'GetAllIpdQue?HealthFacilityId=',
            GetByIdWithPrescription: () => this.PatientDiagnose.Controller + 'GetByIdWithPrescription?Id=',
            GetDoctorNotesByVisit: () => this.PatientDiagnose.Controller + 'GetDoctorNotesByVisit?PatientVisitId=',
            CreateOrEditPatientDiagnoseWithPrescription: () => this.PatientDiagnose.Controller + 'CreateOrEditPatientDiagnoseWithPrescription',
            CreateOrEditPatientDiagnoseWithPrescriptionForIpd: () => this.PatientDiagnose.Controller + 'CreateOrEditPatientDiagnoseWithPrescriptionForIpd',
            CreateDoctorNotes: () => this.PatientDiagnose.Controller + 'CreateDoctorNotes',
            CreateOrEditPhysiotherapyForm: () => this.PatientDiagnose.Controller + 'CreateOrEditPhysiotherapyForm',
            CreatePatientLabTest: () => this.PatientDiagnose.Controller + 'CreatePatientLabTest',
            GetLabTestbyVisitId: () => this.PatientDiagnose.Controller + 'GetLabTestbyVisitId?VisitId=',
            GetLabTestbyDiagnoseId: () => this.PatientDiagnose.Controller + 'GetLabTestbyDiagnoseId?DiagnoseId=',
            GetAllWithPagination: () => this.PatientDiagnose.Controller + 'GetAllWithPagination',
            GetAllWithPaginationWithDetail: () => this.PatientDiagnose.Controller + 'GetAllWithPaginationWithDetail',
            GetFilteredDentalProcedureList: () => this.PatientDiagnose.Controller + 'GetFilteredDentalProcedureList',
            UpdateProcedureData: () => this.PatientDiagnose.Controller + 'UpdateProcedureData'
        }

    //#endregion

    //#region PatientPrescription
    static PatientPrescription: any =
        {
            Controller: '/PatientPrescription/',
            Delete: () => this.PatientPrescription.Controller + 'Delete?Id=',
            CheckIfMedicineDispensed: () => this.PatientPrescription.Controller + 'CheckIfDispensed?Id=',
            CheckIfCanDeleteLab: () => this.PatientPrescription.Controller + 'CheckIfCanDeleteLab?Id=',
        }
    //#endregion

    //#region PatientDiagnoseTemplate
    static PatientDiagnoseTemplate: any =
        {
            Controller: '/PatientDiagnoseTemplate/',
            CreateOrEdit: () => this.PatientDiagnoseTemplate.Controller + 'CreateOrEdit',
            GetByUserId: () => this.PatientDiagnoseTemplate.Controller + 'GetByUserId?UserId=',
            Delete: () => this.PatientDiagnoseTemplate.Controller + 'Delete?Id=',
        }
    //#endregion

    //#region SectionProcedure
    static SectionProcedure: any =
        {
            Controller: '/SectionProcedure/',
            GetBySectionLookupId: () => this.SectionProcedure.Controller + 'GetBySectionLookupId?SectionLookupId=',
        }
    //#endregion

    // #region PatientPharmacy
    // static PatientPharmacy: any =
    // {
    //     Controller : '/PatientPharmacy/',
    //     GetAllQue : () => this.PatientPharmacy.Controller + 'GetAllQue?HealthFacilityId=',
    //     // CreateOrEditPatientDiagnoseWithPrescription: () => this.PatientDiagnose.Controller + 'CreateOrEditPatientDiagnoseWithPrescription'
    // }
    //#endregion

    // #region MedicineLookup
    static MedicineLookup: any =
        {
            Controller: '/MedicineLookup/',
            GetAll: () => this.MedicineLookup.Controller + 'GetAll?=',
            GetAvailableMedicine: () => this.MedicineLookup.Controller + 'GetAvailableMedicine'
            // CreateOrEditPatientDiagnoseWithPrescription: () => this.PatientDiagnose.Controller + 'CreateOrEditPatientDiagnoseWithPrescription'
        }
    //#endregion

    //#region PatientDashboard
    static PatientDashboard: any =
        {
            Controller: '/PatientDashboard/',
            GetDashboardCounts: () => this.PatientDashboard.Controller + 'GetDashboardCounts',
            GetPatientVisitCountByGenderByMonth: () => this.PatientDashboard.Controller + 'GetPatientVisitCountByGenderByMonth',
            // GetTodayPatientVisitCountByDeptBySec:  () => this.PatientDashboard.Controller + 'GetTodayPatientVisitCountByDeptBySec',
            // GetPatientOpenVisitCountByDeptBySecByMonth:  () => this.PatientDashboard.Controller + 'GetPatientOpenVisitCountByDeptBySecByMonth',

        }
    //#endregion

    //#region Patient Registration Dashboard

    static PatientRegistrationDashboard: any =
        {
            Controller: '/Dashboard/',
            getRegistrationDashboardLoginUserAllCounts: () => this.PatientRegistrationDashboard.Controller + 'getRegistrationDashboardLoginUserAllCounts',
            getRegistrationDashboardAllCounts: () => this.PatientRegistrationDashboard.Controller + 'getRegistrationDashboardAllCounts',
            getRegistrationDashboardAllList: () => this.PatientRegistrationDashboard.Controller + 'getRegistrationDashboardAllList',
            getRegDashboardOPDSectionWiseTokenCount: () => this.PatientRegistrationDashboard.Controller + 'getRegDashboardOPDSectionWiseTokenCount',
            getPatientDetail: () => this.PatientRegistrationDashboard.Controller + 'getPatientDetail?PatientVisitId=',
            GetPatientVisitCountByHealthFacilityByPMIS: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByHealthFacilityByPMIS',
            GetPatientVisitCountByHealthFacility: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByHealthFacility',
            GetPatientVisitCountByUser: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByUser',
            GetPatientVisitCountByProvince: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByProvince',
            GetPatientRegisteredCountByProvince: () => this.PatientRegistrationDashboard.Controller + 'GetPatientRegisteredCountByProvince',
            GetPatientVisitCountByProvinceByGender: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByProvinceByGender',
            GetPatientVisitCountSelfVsOthers: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountSelfVsOthers',
            GetPatientNewRegisteredVsRevisit: () => this.PatientRegistrationDashboard.Controller + 'GetPatientNewRegisteredVsRevisit',
            GetPatientVisitCountByGenderBySelfVsOthers: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByGenderBySelfVsOthers',
            GetPatientVisitCountByAgeRangeByGender: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByAgeRangeByGender',
            GetPatientVisitCountByDeptBySecByMonth: () => this.PatientRegistrationDashboard.Controller + 'GetPatientVisitCountByDeptBySecByMonth',
            GetTodayPatientVisitCountByDeptBySec: () => this.PatientRegistrationDashboard.Controller + 'GetTodayPatientVisitCountByDeptBySec',
            GetRegistrationDashboardCardCount: () => this.PatientRegistrationDashboard.Controller + 'GetRegistrationDashboardCardCount'
        }

    //#endregion

    //#region Dental Sterilization

    static Dental: any =
        {
            Controller: '/Dental/',
            GetAllWithPagination: () => this.Dental.Controller + 'GetAllWithPagination?',
        }

    //#endregion

    //#region Doctor Dashboard

    static DoctorDashboard: any =
        {
            Controller: '/Dashboard/',
            getDoctorDashboardLoginUserAllCounts: () => this.DoctorDashboard.Controller + 'getDoctorDashboardLoginUserAllCounts',
            getDoctorDashboardPatientAllCounts: () => this.DoctorDashboard.Controller + 'getDoctorDashboardPatientAllCounts',
            getDoctorDashboardHFPatientAllCounts: () => this.DoctorDashboard.Controller + 'getDoctorDashboardHFPatientAllCounts',
            getDoctorDashboardPatientAllList: () => this.DoctorDashboard.Controller + 'getDoctorDashboardPatientAllList',
            getDoctorDashboardHFPatientAllList: () => this.DoctorDashboard.Controller + 'getDoctorDashboardHFPatientAllList',
            GetPatientVisitDoctorCountByUser: () => this.DoctorDashboard.Controller + 'GetPatientVisitDoctorCountByUser',
            GetPatientVisitDoctorCountByProvince: () => this.DoctorDashboard.Controller + 'GetPatientVisitDoctorCountByProvince',
            GetPatientVisitDoctorCountByGender: () => this.DoctorDashboard.Controller + 'GetPatientVisitDoctorCountByGender',
            GetPatientVisitDoctorCountByDisease: () => this.DoctorDashboard.Controller + 'GetPatientVisitDoctorCountByDisease',
            GetDoctorPrescribedMedicineAccumulateQuantity: () => this.DoctorDashboard.Controller + 'GetDoctorPrescribedMedicineAccumulateQuantity',
            getPatientCountWithInterExternalMedicines: () => this.DoctorDashboard.Controller + 'getPatientCountWithInterExternalMedicines',
            getPatientCountWithInterExternalMedicineDoctor: () => this.DoctorDashboard.Controller + 'getPatientCountWithInterExternalMedicineDoctor',
            getInternalAndExternalLabCounts: () => this.DoctorDashboard.Controller + 'getInternalAndExternalLabCounts',
            GetDoctorRecommendedLabCount: () => this.DoctorDashboard.Controller + 'GetDoctorRecommendedLabCount',
            GetDoctorDashboardCardCount: () => this.DoctorDashboard.Controller + 'GetDoctorDashboardCardCount',
            //// Over all Perscribed

            getDoctorpatientInQueue: () => this.DoctorDashboard.Controller + 'GetAllQueList',
            GetPatientPrescriptionIssued: () => this.DoctorDashboard.Controller + 'GetPatientPrescriptionIssued',
            GetPatientInternalPharmacy: () => this.DoctorDashboard.Controller + 'GetPatientInternalPharmacy',
            GetPatientExternalPharmacy: () => this.DoctorDashboard.Controller + 'GetPatientExternalPharmacy',
            GetPatientInternalExternalPharmacy: () => this.DoctorDashboard.Controller + 'GetPatientInternalExternalPharmacy',
            // Doctor Perscribed

            GetPatientPrescriptionIssuedDoctor: () => this.DoctorDashboard.Controller + 'GetPatientPrescriptionIssuedDoctor',
            GetPatientInternalPharmacyDoctor: () => this.DoctorDashboard.Controller + 'GetPatientInternalPharmacyDoctor',
            GetPatientExternalPharmacyDoctor: () => this.DoctorDashboard.Controller + 'GetPatientExternalPharmacyDoctor',
            GetPatientInternalExternalPharmacyDoctor: () => this.DoctorDashboard.Controller + 'GetPatientInternalExternalPharmacyDoctor',
            //Lab
            GetPatientTotalLabs: () => this.DoctorDashboard.Controller + 'GetPatientTotalLabs',
            GetPatientInternalLab: () => this.DoctorDashboard.Controller + 'GetPatientInternalLab',
            GetPatientExternalLab: () => this.DoctorDashboard.Controller + 'GetPatientExternalLab',
            GetPatientInternalExternalLab: () => this.DoctorDashboard.Controller + 'GetPatientInternalExternalLab',
            GetPatientServedByDoctor: () => this.DoctorDashboard.Controller + 'GetPatientServedByDoctor',

            /// lab Doc
            GetPatientTotalLabDoctor: () => this.DoctorDashboard.Controller + 'GetPatientTotalLabDoctor',
            GetPatientExternalLabDoctor: () => this.DoctorDashboard.Controller + 'GetPatientExternalLabDoctor',
            GetPatientInternalLabDoctor: () => this.DoctorDashboard.Controller + 'GetPatientInternalLabDoctor',
            GetPatientInternalExternalLabDoctor: () => this.DoctorDashboard.Controller + 'GetPatientInternalExternalLabDoctor',
            getDoctorDashboardHfPatientCount: () => this.DoctorDashboard.Controller + 'getDoctorDashboardHfPatientCount',
            getDocHFInQueuelist: () => this.DoctorDashboard.Controller + 'getDocHFInQueuelist',
        }

    //#endregion
    //#region CrystalReports
    static CrystalReports: any =
        {
            Controller: '/Dashboard/',
            getDoctorDashboardPatientAllReport: () => this.CrystalReports.Controller + 'getDoctorDashboardPatientAllReport',
            getDoctorDashboardHFPatientAllReport: () => this.CrystalReports.Controller + 'getDoctorDashboardHFPatientAllReport',
            getLabDashboardTestAllReport: () => this.CrystalReports.Controller + 'getLabDashboardTestAllReport',
            getLabDashboardTestTimeFromStartTillNowAllReport: () => this.CrystalReports.Controller + 'getLabDashboardTestTimeFromStartTillNowAllReport',
            getPharmacyDashboardAllReport: () => this.CrystalReports.Controller + 'getPharmacyDashboardAllReport',
            getRegistrationDashboardAllReport: () => this.CrystalReports.Controller + 'getRegistrationDashboardAllReport',
            getVitalDashboardAllReport: () => this.CrystalReports.Controller + 'getVitalDashboardAllReport',
            getSehatSahulatCardDashboardAllReport: () => this.CrystalReports.Controller + 'getSehatSahulatCardDashboardAllReport',
            getPharmacyDashboardMedcineIssuedPatientDetailReport: () => this.CrystalReports.Controller + 'getPharmacyDashboardMedcineIssuedPatientDetailReport',
            GetPatientCrystalReport: () => this.CrystalReports.Controller + 'GetPatientCrystalReport',
            GetPatientLabsCrystalReport: () => this.CrystalReports.Controller + 'GetPatientLabsCrystalReport',
            GetMedicineIssuedCrystalReportMedicineWise: () => this.CrystalReports.Controller + 'GetMedicineIssuedCrystalReportMedicineWise',
            getReportDrugAddictsDashboardListings: () => this.CrystalReports.Controller + 'getReportDrugAddictsDashboardListings',
            getReportDrugAddictsDiseasesListings: () => this.CrystalReports.Controller + 'getReportDrugAddictsDiseasesListings',
            getReportDrugAddictsSocialWelfareListings: () => this.CrystalReports.Controller + 'getReportDrugAddictsSocialWelfareListings',
            getHCPDashboardAllReport: () => this.CrystalReports.Controller + 'getHCPDashboardAllReport',
            getParaplegicDashboardAllReport: () => this.CrystalReports.Controller + 'getParaplegicDashboardAllReport',
            DownloadOpdReport: () => this.CrystalReports.Controller + 'DownloadOpdReport',
            OPDMedicineDispenseReport: () => this.CrystalReports.Controller + 'OPDMedicineDispenseReport',
            getDentalDashboardAllReport: () => this.CrystalReports.Controller + 'getDentalDashboardAllReport',
            getDentalDashboardAllReportProcedures: () => this.CrystalReports.Controller + 'getDentalDashboardAllReportProcedures',
            getPhysioTherapyDashboardAllReport: () => this.CrystalReports.Controller + 'getPhysioTherapyDashboardAllReport',

            getIndivisualOpdDashboardAllReport: () => this.CrystalReports.Controller + 'getIndivisualOpdDashboardAllReport',
            getSpeechTherapyDashboardAllReport: () => this.CrystalReports.Controller + 'getSpeechTherapyDashboardAllReport',
            getNutritionDashboardAllReport: () => this.CrystalReports.Controller + 'getNutritionDashboardAllReport',
            getPsychologyDashboardAllReport: () => this.CrystalReports.Controller + 'getPsychologyDashboardAllReport',

            //#region Tb
            GetTbPatientsRegistered: () => this.CrystalReports.Controller + 'GetTbPatientsRegistered',
            GetTbPatientsData: () => this.CrystalReports.Controller + 'GetTbPatientsData',
            GetTbAdvisedTest: () => this.CrystalReports.Controller + 'GetTbAdvisedTest',
            GetTbTestResults: () => this.CrystalReports.Controller + 'GetTbTestResults',
            GetTbIssuedMedicine: () => this.CrystalReports.Controller + 'GetTbIssuedMedicine',
            //#endregion
        }
    static CrystalReportsEmc: any =
        {
            Controller: '/Emc/',
            // #region EMC
            GetMleSinglePatientReport: () => this.CrystalReportsEmc.Controller + 'GetMleSinglePatientReport',
            GetMleSvSinglePatientReport: () => this.CrystalReportsEmc.Controller + 'GetMleSvSinglePatientReport',
            GetPostMortemSinglePatientReport: () => this.CrystalReportsEmc.Controller + 'GetPostMortemSinglePatientReport',
            GetBirthCertificate: () => this.CrystalReportsEmc.Controller + 'GetBirthCertificate?patientVisitId=',
            GetDeathCertificate: () => this.CrystalReportsEmc.Controller + 'GetDeathCertificate?patientVisitId=',
            GetFitnessCertificate: () => this.CrystalReportsEmc.Controller + 'GetFitnessCertificate?patientVisitId=',
            GetFitnessCertificateForAslah: () => this.CrystalReportsEmc.Controller + 'GetFitnessCertificateForAslah?patientVisitId=',
            GetIcvCertificate: () => this.CrystalReportsEmc.Controller + 'GetIcvCertificate?patientVisitId=',

            // #endregion
        }

    static IPDCrystalReports: any =
        {
            Controller: '/Dashboard/',
            getIPDAdmissionDashboardAllReport: () => this.CrystalReports.Controller + 'getIPDAdmissionDashboardAllReport',
            getIPDVitalDashboardAllReport: () => this.CrystalReports.Controller + 'getIPDVitalDashboardAllReport',
            getIPDDoctorDashboardPatientAllReport: () => this.CrystalReports.Controller + 'getIPDDoctorDashboardPatientAllReport',
            getIPDDoctorHFDashboardPatientAllReport: () => this.CrystalReports.Controller + 'getIPDDoctorHFDashboardPatientAllReport',
            getIPDPharmacyDashboardAllReport: () => this.CrystalReports.Controller + 'getIPDPharmacyDashboardAllReport',
            getIPDLabDashboardTestAllReport: () => this.CrystalReports.Controller + 'getIPDLabDashboardTestAllReport',
            getIPDLabDashboardTestTimeFromStartTillNowAllReport: () => this.CrystalReports.Controller + 'getIPDLabDashboardTestTimeFromStartTillNowAllReport'
        }
    static ParaplegicCrystalReports: any =
        {
            Controller: '/Dashboard/',
            getParaplegicDoctorDashboardPatientAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicDoctorDashboardPatientAllReport',
            getParaplegicDoctorDashboardHFPatientAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicDoctorDashboardHFPatientAllReport',
            getParaplegicLabDashboardTestAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicLabDashboardTestAllReport',
            getParaplegicLabDashboardTestTimeFromStartTillNowAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicLabDashboardTestTimeFromStartTillNowAllReport',
            getParaplegicPharmacyDashboardAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicPharmacyDashboardAllReport',
            getParaplegicRegistrationDashboardAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicRegistrationDashboardAllReport',
            getParaplegicVitalDashboardAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicVitalDashboardAllReport',
            getParaplegicDashboardAllReport: () => this.ParaplegicCrystalReports.Controller + 'getParaplegicDashboardAllReport',
            ParaplegicDownloadOpdReport: () => this.ParaplegicCrystalReports.Controller + 'ParaplegicDownloadOpdReport',
            ParaplegicOPDMedicineDispenseReport: () => this.ParaplegicCrystalReports.Controller + 'ParaplegicOPDMedicineDispenseReport',
        }
    //#region Vital Dashboard

    static VitalDashboard: any =
        {
            Controller: '/Dashboard/',
            getVitalDashboardAllCounts: () => this.VitalDashboard.Controller + 'getVitalDashboardAllCounts',
            getVitalDashboardLoginUserAllCounts: () => this.VitalDashboard.Controller + 'getVitalDashboardLoginUserAllCounts',
            getVitalDashboardAllList: () => this.VitalDashboard.Controller + 'getVitalDashboardAllList',

            GetVitalDashboardCardCount: () => this.VitalDashboard.Controller + 'GetVitalDashboardCardCount',
            GetPatientVisitVitalCountByUser: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByUser',
            GetPatientVisitVitalCountByProvince: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByProvince',
            GetPatientVisitVitalCountByGender: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByGender',
            GetPatientVisitVitalCountByWeightRange: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByWeightRange',
            GetPatientVisitVitalCountByRespiratoryRateRange: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByRespiratoryRateRange',
            GetPatientVisitVitalCountByTemperatureRange: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByTemperatureRange',
            GetPatientVisitVitalCountByPulseRateRange: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByPulseRateRange',
            GetPatientVisitVitalCountByBloodPressureRange: () => this.VitalDashboard.Controller + 'GetPatientVisitVitalCountByBloodPressureRange',

        }

    //#endregion


    //#region Pharmacy Dashboard

    static PharmacyDashboard: any =
        {
            Controller: '/Dashboard/',
            getPharmacyDashboardLoginUserAllCounts: () => this.PharmacyDashboard.Controller + 'getPharmacyDashboardLoginUserAllCounts',
            getPharmacyDashboardAllCounts: () => this.PharmacyDashboard.Controller + 'getPharmacyDashboardAllCounts',
            getPharmacyDashboardAllList: () => this.PharmacyDashboard.Controller + 'getPharmacyDashboardAllList',
            GetPatientVisitPharmacyCountByUser: () => this.PharmacyDashboard.Controller + 'GetPatientVisitPharmacyCountByUser',
            GetPharmacyInternalExternalMedicineAccumulateQuantity: () => this.PharmacyDashboard.Controller + 'GetPharmacyInternalExternalMedicineAccumulateQuantity',
            GetPharmacyDashboardMedcineIssuedReport: () => this.PharmacyDashboard.Controller + 'GetPharmacyDashboardMedcineIssuedReport',
            getPharmacyDashboardMedcineIssuedPatientDetailList: () => this.PharmacyDashboard.Controller + 'getPharmacyDashboardMedcineIssuedPatientDetailList',
            GetPharmacyDashboardCardCount: () => this.PharmacyDashboard.Controller + 'GetPharmacyDashboardCardCount',
            GetPharmacyDashboardInternalExternalStats: () => this.PharmacyDashboard.Controller + 'GetPharmacyDashboardInternalExternalStats',
            GetMedicineIssueListPharmacy: () => this.PharmacyDashboard.Controller + 'GetMedicineIssueListPharmacy',
            GetInQueueListPharmacy: () => this.PharmacyDashboard.Controller + 'GetInQueueListPharmacy',
            getPharmacyInternalExternalAccumulateQuantityPatientWiseReport: () => this.PharmacyDashboard.Controller + 'getPharmacyInternalExternalAccumulateQuantityPatientWiseReport',
            getPharmacyDashboardOflineMedicineStock: () => this.PharmacyDashboard.Controller + 'getPharmacyDashboardOflineMedicineStock',
        }

    ////#endregion

    //#region Pathology Dashboard

    static PathologyDashboard: any =
        {
            Controller: '/Dashboard/',
            getLabDashboardLoginUserTestAllCounts: () => this.PathologyDashboard.Controller + 'getLabDashboardLoginUserTestAllCounts',
            getLabDashboardTestAllCounts: () => this.PathologyDashboard.Controller + 'getLabDashboardTestAllCounts',
            getLabDashboardTestAllList: () => this.PathologyDashboard.Controller + 'getLabDashboardTestAllList',
            getLabDashboardTestTimeFromStartTillNowAllCounts: () => this.PathologyDashboard.Controller + 'getLabDashboardTestTimeFromStartTillNowAllCounts',
            getLabDashboardTestTimeFromStartTillNowAllList: () => this.PathologyDashboard.Controller + 'getLabDashboardTestTimeFromStartTillNowAllList',
            GetPatientVisitPathologySampleCollectedCountByUser: () => this.PathologyDashboard.Controller + 'GetPatientVisitPathologySampleCollectedCountByUser',
            GetPatientVisitLabTestReportGeneratedCountByUser: () => this.PathologyDashboard.Controller + 'GetPatientVisitLabTestReportGeneratedCountByUser',
            GetPatientVisitPathologyCountByGender: () => this.VitalDashboard.Controller + 'GetPatientVisitPathologyCountByGender',
            GetPathologyDashboardStats: () => this.PathologyDashboard.Controller + 'GetPathologyDashboardStats',
            getLabDashboardTop20LabTestRecommended: () => this.PathologyDashboard.Controller + 'getLabDashboardTop20LabTestRecommended',
            GetPatientVisitPathologyCountByLabTest: () => this.PathologyDashboard.Controller + 'GetPatientVisitPathologyCountByLabTest',
            GetPatientVisitPathologyCountByDepartment: () => this.PathologyDashboard.Controller + 'GetPatientVisitPathologyCountByDepartment',
            GetPathologyCountByStatus: () => this.PathologyDashboard.Controller + 'GetPathologyCountByStatus',
            getPathologyDashboardCardCount: () => this.PathologyDashboard.Controller + 'getPathologyDashboardCardCount',
            GetInQueuelistLab: () => this.PathologyDashboard.Controller + 'GetInQueuelistLab',
            GetInternalLabVisitList: () => this.PathologyDashboard.Controller + 'GetInternalLabVisitList',
            GetSampleCollectedListLab: () => this.PathologyDashboard.Controller + 'GetSampleCollectedListLab',
            GetReportGernatedListLab: () => this.PathologyDashboard.Controller + 'GetReportGernatedListLab',
            GetPendingReportListLab: () => this.PathologyDashboard.Controller + 'GetPendingReportListLab',
        }

    ////#endregion
    //#region SehatSahulat Card Dashboard

    static SSCDashboard: any =
        {
            Controller: '/Dashboard/',
            getSehatSahulatCardDashboardCount: () => this.SSCDashboard.Controller + 'getSehatSahulatCardDashboardCount',
            getSehatSahulatCardDashboardList: () => this.SSCDashboard.Controller + 'getSehatSahulatCardDashboardList',
        }

    ////#endregion
    //#region Secretary Dashboard

    static SecretaryDashboard: any =
        {
            Controller: '/Dashboard/',
            GetSecretaryDashboardCardCount: () => this.SecretaryDashboard.Controller + 'GetSecretaryDashboardCardCount',
            GetHeatlCertificateCountByHealthFacilityCode: () => this.SecretaryDashboard.Controller + 'GetHeatlCertificateCountByHealthFacilityCode',
            GetMedicoLegalCountForHMISByHealthFacilityCode: () => this.SecretaryDashboard.Controller + 'GetMedicoLegalCountForHMISByHealthFacilityCode',
            GetHealthCouncilCountForHMISByHealthFacilityCode: () => this.SecretaryDashboard.Controller + 'GetHealthCouncilCountForHMISByHealthFacilityCode',
            GetMIMSCountForHMISByHealthFacilityCode: () => this.SecretaryDashboard.Controller + 'GetMIMSCountForHMISByHealthFacilityCode',
            GetLastUpdatedDateOfMIMS: () => this.SecretaryDashboard.Controller + 'GetLastUpdatedDateOfMIMS',
            GetAidsCountForHMISByDateRange: () => this.SecretaryDashboard.Controller + 'GetAidsCountForHMISByDateRange',
            GetTBScreeningCountForHMISByHealthFacilityCode: () => this.SecretaryDashboard.Controller + 'GetTBScreeningCountForHMISByHealthFacilityCode',

        }

    static TbDashboard: any = {
        Controller: '/Dashboard/',
        GetTbDashboardCardCount: () => this.TbDashboard.Controller + 'GetTbDashboardCardCount',
        GetTbPatientsData: () => this.TbDashboard.Controller + 'GetTbPatientsData',
        GetTbRegisteredPatientsData: () => this.TbDashboard.Controller + 'GetTbRegisteredPatientsData',
        GetTbAdvisedTest: () => this.TbDashboard.Controller + 'GetTbAdvisedTest',
        GetTbTestResults: () => this.TbDashboard.Controller + 'GetTbTestResults',
        GetTbIssuedMedicine: () => this.TbDashboard.Controller + 'GetTbIssuedMedicine',
    }
    static EyeInfectionDashboard: any = {
        Controller: '/Dashboard/',
        GetEyeInfectionDashboardCardCount: () => this.TbDashboard.Controller + 'GetEyeInfectionDashboardCardCount',
    }

    //#endregion

    //#region Old Tb Dashboard

    static OldTbDashboard: any = {
        Controller: '/Dashboard/',
        GetOldTbDashboardCardCount: () => this.TbDashboard.Controller + 'GetOldTbDashboardCardCount',
        GetPatientListOldTb: () => this.TbDashboard.Controller + 'GetPatientListOldTb',
    }

    static SyncUtilityDashboard: any = {
        Controller: '/Dashboard/',
        GetDataSyncUtilityLog: () => this.SyncUtilityDashboard.Controller + 'getDataSyncUtilityLog'
    }

    //#endregion

    //#region Province
    static Province: any = {
        Controller: '/Province/',
        GetAllLocations: () => this.Province.Controller + 'GetAllLocations',
        GetAllLocationsFilters: () => this.Province.Controller + 'GetAllLocationsFilters',
    }
    //#endregion

    // #region Pathology
    static PatientLabTest: any =
        {
            Controller: '/PatientLabTest/',
            GetAllPatientLabTestByFilters: () => this.PatientLabTest.Controller + 'GetAllPatientLabTestByFilters?',
            getAllPatientTestListForBatch: () => this.PatientLabTest.Controller + 'getAllPatientTestListForBatch?',
            getCollectedSamplespatientTestList: () => this.PatientLabTest.Controller + 'getCollectedSamplespatientTestList?',
            GetRecentBatchName: () => this.PatientLabTest.Controller + 'GetRecentBatchName',
            GetAllPatientLabTestByVisit: () => this.PatientLabTest.Controller + 'GetAllPatientLabTestByVisit?',
            MarkAsArchived: () => this.PatientLabTest.Controller + 'MarkAsArchived?PatientLabTestId=',
            UpdateSampleCollectionStatus: () => this.PatientLabTest.Controller + 'UpdateSampleCollectionStatus',
            UpdateSampleRejectedStatus: () => this.PatientLabTest.Controller + 'UpdateSampleRejectedStatus?',
            GetByPatientLabTestIdForRegistrationSlip: () => this.PatientLabTest.Controller + 'GetByPatientLabTestIdForRegistrationSlip?PatientLabTestId=',
            GetAllPatientLabTestDetailByPatientLabTestId: () => this.PatientLabTest.Controller + 'GetAllPatientLabTestDetailByPatientLabTestId?PatientLabTestId=',
            UploadResultImage: () => this.PatientLabTest.Controller + 'UploadResultImage',
            UpdateLabTestResult: () => this.PatientLabTest.Controller + 'UpdateLabTestResult',
            UpdateLabTestResultBulk: () => this.PatientLabTest.Controller + 'UpdateLabTestResultBulk',
            GetAlmonerStat: () => this.PatientLabTest.Controller + 'GetAlmonerStat?',
            GetFilteredAnmonalListWithPagination: () => this.PatientLabTest.Controller + 'GetFilteredAnmonalListWithPagination?',
            GetFilteredAnmonalProcedureListWithPagination: () => this.PatientLabTest.Controller + 'GetFilteredAnmonalProcedureListWithPagination?',
            GetFilteredViewAnmonalProcedurePaymentList: () => this.PatientLabTest.Controller + 'GetFilteredViewAnmonalProcedurePaymentList?',
            GeAnmonalDashboardListWithPagination: () => this.PatientLabTest.Controller + 'GeAnmonalDashboardListWithPagination?',
            GetFilteredAnmonalLabTestDetailByVisitId: () => this.PatientLabTest.Controller + 'GetFilteredAnmonalLabTestDetailByVisitId?PatientVisitId=',
            GetFilteredAnmonalPaidLabTestDetailByVisitId: () => this.PatientLabTest.Controller + 'GetFilteredAnmonalPaidLabTestDetailByVisitId?PatientVisitId=',
            GetAllTestListByVisitId: () => this.PatientLabTest.Controller + 'GetAllTestListByVisitId?PatientVisitId=',
            GetTbPatientLabTestByPatientId: () => this.PatientLabTest.Controller + 'GetTbPatientLabTestByPatientId?PatientId=',
            GetRecommendedLabTestToPatient: () => this.PatientLabTest.Controller + 'GetRecommendedLabTestToPatient?PatientId=',
            UpdateRider: () => this.PatientLabTest.Controller + 'UpdateRider',
            UpdateAnmonalLabTestPayementStatus: () => this.PatientLabTest.Controller + 'UpdateAnmonalLabTestPayementStatus',
            UpdateAnmonalDentalProcedurePayementStatus: () => this.PatientLabTest.Controller + 'UpdateAnmonalDentalProcedurePayementStatus',
            UpdateStatusOfReportOfConsignmentLabTest: () => this.PatientLabTest.Controller + 'UpdateStatusOfReportOfConsignmentLabTest',
            GetRecommendedLabTestsList: () => this.PatientLabTest.Controller + 'GetRecommendedLabTestsList',
            getAllRadiologyTestList: () => this.PatientLabTest.Controller + 'GetAllRadiologyTestList?',
        }

    static SampleConsignment: any =
        {
            Controller: '/SampleConsignment/',
            CreateOrEdit: () => this.SampleConsignment.Controller + 'CreateOrEdit',
            CreateOrEditBatch: () => this.SampleConsignment.Controller + 'CreateOrEditBatch',
            Delete: () => this.SampleConsignment.Controller + 'Delete?Id=',
            GetAllWithPagination: () => this.SampleConsignment.Controller + 'GetAllWithPagination?',
            GetAllWithPaginationForBatchList: () => this.SampleConsignment.Controller + 'GetAllWithPaginationForBatchList?',
            GetAllWithPaginationForCompletedBatchList: () => this.SampleConsignment.Controller + 'GetAllWithPaginationForCompletedBatchList?',
            GetAllSampleCollectedConsignmentList: () => this.SampleConsignment.Controller + 'GetAllSampleCollectedConsignmentList?',
            GetReceiveReceivedCollectedSampleList: () => this.SampleConsignment.Controller + 'GetReceiveReceivedCollectedSampleList?',
            GetSampleCollectedConsignmentList: () => this.SampleConsignment.Controller + 'GetSampleCollectedConsignmentList?',
            GetHCPAllSampleCollectedConsignmentList: () => this.SampleConsignment.Controller + 'GetHCPAllSampleCollectedConsignmentList?',
            GetConsignmentWithConsignmentDetailByConsignmentId: () => this.SampleConsignment.Controller + 'GetConsignmentWithConsignmentDetailByConsignmentId?SampleConsignmentId=',
            UpdateConsignmentDetailStatus: () => this.SampleConsignment.Controller + 'UpdateConsignmentDetailStatus',


        }
    //#endregion

    //#region HCP
    static HCPAssessment: any =
        {
            Controller: '/PatientAssessment/',
            CreateOrEdit: () => this.HCPAssessment.Controller + 'CreateOrEdit',
            GetPatientPreviousAssessment: () => this.HCPAssessment.Controller + 'GetPatientPreviousAssessment?PatientId=',
            GetPatientLastFollowupDate: () => this.HCPAssessment.Controller + 'GetPatientLastFollowupDate?PatientId=',
            GetPatientPreviousDiagnose: () => this.HCPAssessment.Controller + 'GetPatientPreviousDiagnose?PatientId=',
            GetPatientPreviousDiagnoseByScreeningDate: () => this.HCPAssessment.Controller + 'GetPatientPreviousDiagnoseByScreeningDate',

        }
    static HCPScreening: any =
        {
            Controller: '/PatientScreening/',
            CreateOrEdit: () => this.HCPScreening.Controller + 'CreateOrEdit',
            GetPatientPreviousScreening: () => this.HCPScreening.Controller + 'GetPatientPreviousScreening?PatientId=',
            CreateOrEditCallDetail: () => this.HCPScreening.Controller + 'CreateOrEditCallDetail',
            GetSinglePatientCallDetailRecord: () => this.HCPScreening.Controller + 'GetSinglePatientCallDetailRecord',
            SpGetSinglePatientCallDetail: () => this.HCPScreening.Controller + 'SpGetSinglePatientCallDetail',
        }
    static HCPVaccination: any =
        {
            Controller: '/PatientVaccination/',
            GetPatientPreviousVaccinations: () => this.HCPVaccination.Controller + 'GetPatientPreviousVaccinations?PatientId=',
        }
    static OldHcpEmr: any =
        {
            Controller: '/OldHcpEmr/',
            GetTotalSamples: () => this.OldHcpEmr.Controller + 'GetTotalSamples?PatientCnic=',
            GetTotalSamplesWithCnic: () => this.OldHcpEmr.Controller + 'GetTotalSamplesWithCnic?PatientCnic=',
        }
    static PhcpDashboard: any =
        {
            Controller: '/PhcpDashboard/',
            // GetTotalPatientCount: () => this.PhcpDashboard.Controller + 'GetTotalPatientCount',
            GetPatientRegistrationCount: () => this.PhcpDashboard.Controller + 'GetPatientRegistrationCount',
            GetVaccinationAdministeredCount: () => this.PhcpDashboard.Controller + 'GetVaccinationAdministeredCount',
            GetSampleReceivedCount: () => this.PhcpDashboard.Controller + 'GetSampleReceivedCount',
            GetSampleReceivedInProcessCount: () => this.PhcpDashboard.Controller + 'GetSampleReceivedInProcessCount',
            GetHCVSampleProcessDetectnNotDetect: () => this.PhcpDashboard.Controller + 'GetHCVSampleProcessDetectnNotDetect',
            GetHCVSampleProcessNotDetected: () => this.PhcpDashboard.Controller + 'GetHCVSampleProcessNotDetected',
            GetHBVSampleProcessed: () => this.PhcpDashboard.Controller + 'GetHBVSampleProcessed',
            GetHCVEnrolledInTreatment: () => this.PhcpDashboard.Controller + 'GetHCVEnrolledInTreatment',
            // GetHCVEnrolledInTreatment_SR: () => this.PhcpDashboard.Controller + 'GetHCVEnrolledInTreatment_SR',
            GetRelapsednCuredCounts: () => this.PhcpDashboard.Controller + 'GetRelapsednCuredCounts',
            GetEligibleForSVRCount: () => this.PhcpDashboard.Controller + 'GetEligibleForSVRCount',
            GetSampleCollectedSVRCount: () => this.PhcpDashboard.Controller + 'GetSampleCollectedSVRCount',
            GetSampleProcessedSVRCount: () => this.PhcpDashboard.Controller + 'GetSampleProcessedSVRCount',
            GetHBVTelbuvidineTreatmentCount: () => this.PhcpDashboard.Controller + 'GetHBVTelbuvidineTreatmentCount',
            GetHBVTenofovirTreatmentCount: () => this.PhcpDashboard.Controller + 'GetHBVTenofovirTreatmentCount',
            GetHBVEntecavirTreatmentCount: () => this.PhcpDashboard.Controller + 'GetHBVEntecavirTreatmentCount',
            // For Lists
            GetPatientsListCountHFWise: () => this.PhcpDashboard.Controller + 'GetPatientsListCountHFWise',
            GetScreeningPatientsListCountHFWise: () => this.PhcpDashboard.Controller + 'GetScreeningPatientsListCountHFWise',
            GetVaccinatedPatientsListCountHFWise: () => this.PhcpDashboard.Controller + 'GetVaccinatedPatientsListCountHFWise',
            GetSampleReceivedACCnREJListCountHFWise: () => this.PhcpDashboard.Controller + 'GetSampleReceivedACCnREJListCountHFWise',
            GetHCVSampleProcessedListCountHFWise: () => this.PhcpDashboard.Controller + 'GetHCVSampleProcessedListCountHFWise',
            GetHBVSampleProcessedListCountHFWise: () => this.PhcpDashboard.Controller + 'GetHBVSampleProcessedListCountHFWise',
            GetSVRSampleCollectedListCountHFWise: () => this.PhcpDashboard.Controller + 'GetSVRSampleCollectedListCountHFWise',
            GetSVRSampleProcessedListCountHFWise: () => this.PhcpDashboard.Controller + 'GetSVRSampleProcessedListCountHFWise',
            GetCurednRelapseListCountHFWise: () => this.PhcpDashboard.Controller + 'GetCurednRelapseListCountHFWise',
            GetEligibleForSVRListCountHFWise: () => this.PhcpDashboard.Controller + 'GetEligibleForSVRListCountHFWise',
            // For Line List
            GetRegPatientsWithPatientTypeLL: () => this.PhcpDashboard.Controller + 'GetRegPatientsWithPatientTypeLL',
            GetHCVEnrolledInTreatmentHfWiseCount: () => this.PhcpDashboard.Controller + 'GetHCVEnrolledInTreatmentHfWiseCount',
            GetHBVEnrolledInTreatmentHfWiseCount: () => this.PhcpDashboard.Controller + 'GetHBVEnrolledInTreatmentHfWiseCount',


            // For Patients Line List
            GetPrediagnosePatientDetail: () => this.PhcpDashboard.Controller + 'GetPrediagnosePatientDetail',
            GetScreenedPatientsLL: () => this.PhcpDashboard.Controller + 'GetScreenedPatientsLL',
            GetVaccinatedPatientsLL: () => this.PhcpDashboard.Controller + 'GetVaccinatedPatientsLL',
            GetTotalSampleReceivedLL: () => this.PhcpDashboard.Controller + 'GetTotalSampleReceivedLL',
            GetHCVSampleProcessedLL: () => this.PhcpDashboard.Controller + 'GetHCVSampleProcessedLL',
            GetHBVSampleProcessedLL: () => this.PhcpDashboard.Controller + 'GetHBVSampleProcessedLL',
            GetSVRSampleLL: () => this.PhcpDashboard.Controller + 'GetSVRSampleLL',

            // Patient Details For PDf
            GetPatientHistory: () => this.PhcpDashboard.Controller + 'GetPatientHistory?PatientId=',
            GetPatientVitals: () => this.PhcpDashboard.Controller + 'GetPatientVitals?PatientId=',
            GetPatientAssessment: () => this.PhcpDashboard.Controller + 'GetPatientAssessment?PatientId=',
            GetScreeningCountOfDistrict: () => this.PhcpDashboard.Controller + 'GetScreeningCountOfDistrict?DistrictId=',
        }
    //#endregion

    //#region CDC

    static CDC: any =
        {
            Controller: '/Cdc/',
            GetAllWithPagination: () => this.CDC.Controller + 'GetAllWithPagination?',
        }

    //#endregion

    //#region Drug Addict
    static DrugAddict: any =
        {
            Controller: '/dashboard/',
            getDrugAddcictsDashboardCounts: () => this.DrugAddict.Controller + 'getDrugAddcictsDashboardCounts',
            getDrugAddcictsDashboardDieasesCounts: () => this.DrugAddict.Controller + 'getDrugAddcictsDashboardDieasesCounts',
            getDrugAddcictsToSocialWelfareCounts: () => this.DrugAddict.Controller + 'getDrugAddcictsToSocialWelfareCounts',
            getDrugAddcictsDashboardListings: () => this.DrugAddict.Controller + 'getDrugAddcictsDashboardListings',
            getDrugAddcictsDashboardDieasesListings: () => this.DrugAddict.Controller + 'getDrugAddcictsDashboardDieasesListings',
            getDrugAddcictsToSocialWelfareListings: () => this.DrugAddict.Controller + 'getDrugAddcictsToSocialWelfareListings'
        }
    //#endregion


    // #region CommonUrls
    static Common: any =
        {
            GetAllLocations: () => this.Province.Controller + 'GetAllLocations',
        }
    //#endregion

    // #region Error Log
    static ErrorLog: any =
        {
            Controller: '/ErrorLog/',
            GetAllWithPagination: () => this.ErrorLog.Controller + 'GetAllWithPagination?',

        }
    //#region SocialWelfareForm
    static SocialWelfareForm: any =
        {
            Controller: '/SocialWelfareForm/',
            CreateOrEdit: () => this.SocialWelfareForm.Controller + 'CreateOrEdit',
            SocialWellfareList: () => this.SocialWelfareForm.Controller + 'GetAllWithPagination',
            SocialWelfareSingleRecord: () => this.SocialWelfareForm.Controller + 'GetById',
            GetPatientsByPatientVisitId: () => this.SocialWelfareForm.Controller + 'GetPatientByPatientVisitId',
            GetPatientVisitClose: () => this.SocialWelfareForm.Controller + 'GetPatientVisitClose',
            GetPatientsByTheirDistrict: () => this.SocialWelfareForm.Controller + 'GetPatientsByTheirDistrict',
            GetDrugAddictDoctorsByTheirDistrict: () => this.SocialWelfareForm.Controller + 'GetDrugAddictDoctorsByTheirDistrict',
            GetUnassignPatientsByTheirDistrict: () => this.SocialWelfareForm.Controller + 'GetUnassignPatientsByTheirDistrict',
            GetAssignDoctorToDrugAddictPatient: () => this.SocialWelfareForm.Controller + 'AssignDoctorToDrugAddictPatient',
            PatientIsDrugAddictOrNot: () => this.SocialWelfareForm.Controller + 'PatientIsDrugAddictOrNot',
            GetAllPatientsCount: () => this.SocialWelfareForm.Controller + 'GetAllPatientsCount',
            GetAllPatientsByDistrictName: () => this.SocialWelfareForm.Controller + 'GetAllPatientsByDistrictName',
            GetAllPatientsCountCd: () => this.SocialWelfareForm.Controller + 'GetAllPatientsCountCd',
            GetAllPatientsByDistrictNameCDSec: () => this.SocialWelfareForm.Controller + 'GetAllPatientsByDistrictNameCDSec',
            GetAllPatientsCountRehabilitationCd: () => this.SocialWelfareForm.Controller + 'GetAllPatientsCountRehabilitationCd',
            GetAllPatientsCountRelapseCd: () => this.SocialWelfareForm.Controller + 'GetAllPatientsCountRelapseCd',
            GetAllPatientsCountExpireCd: () => this.SocialWelfareForm.Controller + 'GetAllPatientsCountExpireCd',
            GetAllPatientRehablitation: () => this.SocialWelfareForm.Controller + 'GetAllPatientRehablitation',
            GetAllPatientsRelapse: () => this.SocialWelfareForm.Controller + 'GetAllPatientsRelapse',
            GetAllPatientsExpire: () => this.SocialWelfareForm.Controller + 'GetAllPatientsExpire',
            GetSinglePatientsVisitCD: () => this.SocialWelfareForm.Controller + 'GetSinglePatientsVisitCD',
            GetPatientDiagnoseRecordByVisitId: () => this.SocialWelfareForm.Controller + 'GetPatientDiagnoseRecordByVisitId',
            CheckPatientIsInTheDiaganoseORNot: () => this.SocialWelfareForm.Controller + 'CheckPatientIsInTheDiaganoseORNot'
        }

    //#region OfflineVersionLog

    static OfflineVersionLog: any =
        {
            Controller: '/OfflineVersionLog/',
            GetAll: () => this.OfflineVersionLog.Controller + 'GetAll',
            GetAllWithPagination: () => this.OfflineVersionLog.Controller + 'GetAllWithPagination?',
            CreateOrEdit: () => this.OfflineVersionLog.Controller + 'CreateOrEdit',
            GetByHfId: () => this.OfflineVersionLog.Controller + 'GetByHfId?HealthFacilityId=',
        }

    //#endregion OfflineVersionLog

    //#endregion

    //#region Features
    static Features: any =
        {
            Controller: '/Feature/',
            GetAll: () => this.Features.Controller + 'GetAll',
            GetAllWithPagination: () => this.Features.Controller + 'GetAllWithPagination?',
            CreateOrEdit: () => this.Features.Controller + 'CreateOrEdit'
        }
    static Attachment: any =
        {
            Controller: '/Attachment/',
            GetAll: () => this.Attachment.Controller + 'GetAll',
            CreateOrEdit: () => this.Attachment.Controller + 'CreateOrEdit',
            GetByParentId: () => this.Attachment.Controller + 'GetByParentId?ParentId='
        }

    //#endregion
    //#region BAS
    static BAS: any =
        {
            Controller: '/dashboard/',
            getBasDashboardAllCounts: () => this.BAS.Controller + 'getBasDashboardAllCounts',
            getBasDashboardAllemployeeList: () => this.BAS.Controller + 'getBasDashboardAllemployeeList',
            getBasDashboardAllSyncDevicesList: () => this.BAS.Controller + 'getBasDashboardAllSyncDevicesList',
            getBasDashboardAllDevicesList: () => this.BAS.Controller + 'getBasDashboardAllDevicesList',
            getBasDashboardAllOnlineOfflineDevicesList: () => this.BAS.Controller + 'getBasDashboardAllOnlineOfflineDevicesList',
            getBasDashboardAllRostersList: () => this.BAS.Controller + 'getBasDashboardAllRostersList',
            getBasDashboardAllAttendenceReportCounts: () => this.BAS.Controller + 'getBasDashboardAllAttendenceReportCounts',
            getBasDashboardAllNotInRosterCount: () => this.BAS.Controller + 'getBasDashboardAllNotInRosterCount',
            getBasDashboardAllAttendenceReportList: () => this.BAS.Controller + 'getBasDashboardAllAttendenceReportList',
            getBasDashboardAllAttendenceDateWiseList: () => this.BAS.Controller + 'getBasDashboardAllAttendenceDateWiseList',
            getBasDashboardAllAttendenceDateWiseListDownload: () => this.BAS.Controller + 'getBasDashboardAllAttendenceDateWiseListDownload',
        }
    static BASCrystalReports: any =
        {
            Controller: '/Dashboard/',
            getBasDashboardAllemployeeReport: () => this.BASCrystalReports.Controller + 'getBasDashboardAllemployeeReport',
        }
    //#region IPD Dashboard

    static IPDDashboard: any =
        {
            Controller: '/IPDDashboard/',
            getIPDAdmissionDashboardAllCounts: () => this.IPDDashboard.Controller + 'getIPDAdmissionDashboardAllCounts',
            getIPDAdmissionDashboardIPDWardWiseCount: () => this.IPDDashboard.Controller + 'getIPDAdmissionDashboardIPDWardWiseCount',
            getIPDVitalDashboardAllCounts: () => this.IPDDashboard.Controller + 'getIPDVitalDashboardAllCounts',
            getIPDVitalDashboardWardWiseCount: () => this.IPDDashboard.Controller + 'getIPDVitalDashboardWardWiseCount',
            getIPDDoctorDashboardPatientAllCounts: () => this.IPDDashboard.Controller + 'getIPDDoctorDashboardPatientAllCounts',
            getIPDDoctorHFDashboardPatientAllCounts: () => this.IPDDashboard.Controller + 'getIPDDoctorHFDashboardPatientAllCounts',
            getIPDPharmacyDashboardAllCounts: () => this.IPDDashboard.Controller + 'getIPDPharmacyDashboardAllCounts',
            getIPDLabDashboardTestAllCounts: () => this.IPDDashboard.Controller + 'getIPDLabDashboardTestAllCounts',
            getIPDLabDashboardTestTimeFromStartTillNowAllCounts: () => this.IPDDashboard.Controller + 'getIPDLabDashboardTestTimeFromStartTillNowAllCounts',
            //Listing
            getIPDAdmissionDashboardAllList: () => this.IPDDashboard.Controller + 'getIPDAdmissionDashboardAllList',
            getIPDVitalDashboardAllList: () => this.IPDDashboard.Controller + 'getIPDVitalDashboardAllList',
            getIPDDoctorDashboardPatientAllList: () => this.IPDDashboard.Controller + 'getIPDDoctorDashboardPatientAllList',
            getIPDDoctorHFDashboardPatientAllList: () => this.IPDDashboard.Controller + 'getIPDDoctorHFDashboardPatientAllList',
            getIPDPharmacyDashboardAllList: () => this.IPDDashboard.Controller + 'getIPDPharmacyDashboardAllList',
            getIPDLabDashboardTestAllList: () => this.IPDDashboard.Controller + 'getIPDLabDashboardTestAllList',
            getIPDLabDashboardTop20LabTestRecommended: () => this.IPDDashboard.Controller + 'getIPDLabDashboardTop20LabTestRecommended',
            getIPDLabDashboardTestTimeFromStartTillNowAllList: () => this.IPDDashboard.Controller + 'getIPDLabDashboardTestTimeFromStartTillNowAllList',
        }

    //#endregion

    //#region HCP Dashboard

    static HCPDashboard: any =
        {
            Controller: '/Dashboard/',
            getHCPDashboardAllCounts: () => this.HCPDashboard.Controller + 'getHCPDashboardAllCounts',
            getHCPDashboardAllCountsUpdated: () => this.HCPDashboard.Controller + 'getHCPDashboardAllCountsUpdated',
            getHCPDashboardAllList: () => this.HCPDashboard.Controller + 'getHCPDashboardAllList',
            getHCPDashboardAllListUpdated: () => this.HCPDashboard.Controller + 'getHCPDashboardAllListUpdated',
            GetHCPpreviousDashboardIndicatorsCounts: () => this.HCPDashboard.Controller + 'GetHCPpreviousDashboardIndicatorsCounts',
        }
    //#endregion


    //#region Paraplrgic Dashboard

    static DentalDashboard: any =
        {
            Controller: '/Dashboard/',
            getDentalDashboardAllCounts: () => this.DentalDashboard.Controller + 'getDentalDashboardAllCounts',
            getDentalDashboardAllList: () => this.DentalDashboard.Controller + 'getDentalDashboardAllList',
            getDentalDashboardAllListProcedures: () => this.DentalDashboard.Controller + 'getDentalDashboardAllListProcedures',
        }
    //#endregion

    //#region Paraplrgic Dashboard

    static PhysioTherapyDashboard: any =
        {
            Controller: '/Dashboard/',
            getPhysioTherapyDashboardAllCounts: () => this.PhysioTherapyDashboard.Controller + 'getPhysioTherapyDashboardAllCounts',
            getPhysioTherapyDashboardAllList: () => this.PhysioTherapyDashboard.Controller + 'getPhysioTherapyDashboardAllList',
            getPhysioTherapyDashboardAllReport: () => this.PhysioTherapyDashboard.Controller + 'getPhysioTherapyDashboardAllReport',
        }
    //#endregion

    //#region IcvCertificate
    static IcvCertificate: any =
        {
            Controller: '/IcvCertificate/',
            CreateOrEditIcvCertificate: () => this.IcvCertificate.Controller + 'CreateOrEdit',
            GetIcvPatientsList: () => this.IcvCertificate.Controller + 'GetIcvPatientsList',
            GetSingleIcvPatientByPatientId: () => this.IcvCertificate.Controller + 'GetSingleIcvPatientByPatientId',
        }
    //#endregion

    //#region BirthCertificate
    static BirthCertificate: any = {
        Controller: '/BirthCertificate/',
        CreateOrEditBirthCertificate: () => this.BirthCertificate.Controller + 'CreateOrEdit',
        GetAllBirthCertificateRecord: () => this.BirthCertificate.Controller + 'GetAllBirthCertificateRecord',
        GetSingleBirthCertificateRecord: () => this.BirthCertificate.Controller + 'GetSingleBirthCertificateRecord'
    }
    //#endregion

    //#region Death Certificate
    static DeathCertificate: any = {
        Controller: '/DeathCertificateForm/',
        CreateOrEdit: () => this.DeathCertificate.Controller + 'CreateOrEdit',
        GetDeathCertificatePatientsList: () => this.DeathCertificate.Controller + 'GetDeathCertificatePatientsList',
        GetSingleDeathCertificatePatients: () => this.DeathCertificate.Controller + 'GetSingleDeathCertificatePatients'
    }
    //#endregion

    //#region  Fitness Certificate
    static FitnessCertificate: any = {
        Controller: '/FitnessCertificate/',
        CreateOrEditFitnessCertificate: () => this.FitnessCertificate.Controller + 'CreateOrEditFitnessCertificate',
        GetAllFitnessCertificatePatients: () => this.FitnessCertificate.Controller + 'GetAllFitnessCertificatePatients',
        GetSingleFitnessCertificatePatients: () => this.FitnessCertificate.Controller + 'GetSingleFitnessCertificatePatients',
        GetTenPsychologicalAssessmentQuestions: () => this.FitnessCertificate.Controller + 'GetTenPsychologicalAssessmentQuestions'
    }
    //#endregion

    //#region PostMortem
    static PostMortem: any = {
        Controller: '/PostMortem/',
        CreateOrEditGeneralForm: () => this.PostMortem.Controller + 'CreateOrEditGeneralForm',
        CreateOrEditExternalForm: () => this.PostMortem.Controller + 'CreateOrEditExternalForm',
        CreateOrEditInternalForm: () => this.PostMortem.Controller + 'CreateOrEditInternalForm',
        CreateOrEditReportForm: () => this.PostMortem.Controller + 'CreateOrEditReportForm',
        GetAllPostMortemPatientsList: () => this.PostMortem.Controller + 'GetAllPostMortemPatientsList',
        GetSinglePostMortemFormByPatientId: () => this.PostMortem.Controller + 'GetSinglePostMortemFormByPatientId'
    }
    //#endregion

    //#region  MLE
    static MLE: any = {
        Controller: '/MLE/',
        CreateOrEditBasicInfo: () => this.MLE.Controller + 'CreateOrEditBasicInfo',
        CreateOrEditExamination: () => this.MLE.Controller + 'CreateOrEditExamination',
        CreateOrEditReport: () => this.MLE.Controller + 'CreateOrEditReport',
        UpdateAssignDoctor: () => this.MLE.Controller + 'UpdateAssignDoctor',
        GetAllMlePatients: () => this.MLE.Controller + 'GetAllMlePatients',
        GetSinglePatientBasicInfo: () => this.MLE.Controller + 'GetSinglePatientBasicInfo',
        GetSinglePatientMleInfo: () => this.MLE.Controller + 'GetSinglePatientMleInfo',
        GetAllMlcDoctors: () => this.MLE.Controller + 'GetAllMlcDoctors',
        GetAllMLCPatientsThatAreNotCheckedYet: () => this.MLE.Controller + 'GetAllMLCPatientsThatAreNotCheckedYet',
        GetAllMLCsByHealthFacilityId: () => this.MLE.Controller + 'GetAllMLCsByHealthFacilityId',
        GetSingleMLCPatientsThatAreNotCheckedYet: () => this.MLE.Controller + 'GetSingleMLCPatientsThatAreNotCheckedYet'
    }
    //#endregion

    //#region MLCSV
    static MLCSV: any = {
        Controller: '/MlcSv/',
        CreateOrEditMlcSvInitialInfo: () => this.MLCSV.Controller + 'CreateOrEditMlcSvInitialInfo',
        CreateOrEditMlcSvExamination: () => this.MLCSV.Controller + 'CreateOrEditMlcSvExamination',
        CreateOrEditMlcSvEvidenceCollected: () => this.MLCSV.Controller + 'CreateOrEditMlcSvEvidenceCollected',
        CreateOrEditMlcSvReport: () => this.MLCSV.Controller + 'CreateOrEditMlcSvReport',
        GetSingleMlcSvRecordByPatientId: () => this.MLCSV.Controller + 'GetSingleMlcSvRecordByPatientId',
        GetAllMlcSvRecord: () => this.MLCSV.Controller + 'GetAllMlcSvRecord',
    }
    //#endregion

    static ParaplegicDashboard: any =
        {
            Controller: '/ParaplegicDashboard/',
            getParaplegicRegistrationDashboardAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicRegistrationDashboardAllCounts',
            getParaplegicRegistrationDashboardAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicRegistrationDashboardAllList',
            getParaplegicRegDashboardOPDSectionWiseTokenCount: () => this.ParaplegicDashboard.Controller + 'getParaplegicRegDashboardOPDSectionWiseTokenCount',
            getParaplegicPatientVisitCountByUser: () => this.ParaplegicDashboard.Controller + 'getParaplegicPatientVisitCountByUser',

            getParaplegicVitalDashboardAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicVitalDashboardAllCounts',
            getParaplegicVitalDashboardAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicVitalDashboardAllList',
            getParaplegicPatientVisitVitalCountByUser: () => this.ParaplegicDashboard.Controller + 'getParaplegicPatientVisitVitalCountByUser',

            getParaplegicDoctorDashboardPatientAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicDoctorDashboardPatientAllCounts',
            getParaplegicDoctorDashboardHFPatientAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicDoctorDashboardHFPatientAllCounts',
            getParaplegicDoctorDashboardPatientAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicDoctorDashboardPatientAllList',
            getParaplegicDoctorDashboardHFPatientAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicDoctorDashboardHFPatientAllList',

            getParaplegicPharmacyDashboardAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicPharmacyDashboardAllCounts',
            getParaplegicPharmacyDashboardAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicPharmacyDashboardAllList',
            GetParaplegicMIMSCountForHMISByHealthFacilityCode: () => this.ParaplegicDashboard.Controller + 'GetParaplegicMIMSCountForHMISByHealthFacilityCode',
            getParaplegicPharmacyInternalExternalAccumulateQuantityPatientWiseReport: () => this.ParaplegicDashboard.Controller + 'getParaplegicPharmacyInternalExternalAccumulateQuantityPatientWiseReport',
            GetParaplegicPharmacyDashboardMedcineIssuedReport: () => this.ParaplegicDashboard.Controller + 'GetParaplegicPharmacyDashboardMedcineIssuedReport',
            getParaplegicLabDashboardTestAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicLabDashboardTestAllCounts',


            getParaplegicLabDashboardTestAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicLabDashboardTestAllList',
            getParaplegicLabDashboardTop20LabTestRecommended: () => this.ParaplegicDashboard.Controller + 'getParaplegicLabDashboardTop20LabTestRecommended',
            getParaplegicLabDashboardTestTimeFromStartTillNowAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicLabDashboardTestTimeFromStartTillNowAllCounts',
            getParaplegicLabDashboardTestTimeFromStartTillNowAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicLabDashboardTestTimeFromStartTillNowAllList',

            getParaplegicDashboardAllCounts: () => this.ParaplegicDashboard.Controller + 'getParaplegicDashboardAllCounts',
            getParaplegicDashboardAllList: () => this.ParaplegicDashboard.Controller + 'getParaplegicDashboardAllList',
            getIndivisualOpdDashboardAllCounts: () => this.ParaplegicDashboard.Controller + 'getIndivisualOpdDashboardAllCounts',
            getIndivisualOpdDashboardAllList: () => this.ParaplegicDashboard.Controller + 'getIndivisualOpdDashboardAllList',

            //Listing

        }

    //#region DSR Report

    static DSRDashboard: any =
        {
            Controller: '/Dashboard/',
            getDSRReportAllCounts: () => this.DSRDashboard.Controller + 'getDSRReportAllCounts',
        }

    ////#endregion

    //#HealthCouncil

    static Budget: any =
        {
            Controller: '/Budget/',
            bulkCreateOrEdit: () => this.Budget.Controller + 'BulkCreateOrEdit',
            getFacilityTypeCountAndBalance: () => this.Budget.Controller + 'GetFacilityTypeCountAndBalance',
            getAllocateBudget: () => this.Budget.Controller + 'GetAllocateBudget',
            getHealthFacilitiesDetail: () => this.Budget.Controller + 'GetHealthFacilitiesDetail',
            getReleaseBudget: () => this.Budget.Controller + 'GetReleaseBudget',
            getChequeImage: () => this.Budget.Controller + 'GetChequeImage?BudgetId=',
            updateReleaseBudget: () => this.Budget.Controller + 'UpdateReleaseBudget',
            saveChequeImage: () => this.Budget.Controller + 'SaveChequeImage',
            removeImage: () => this.Budget.Controller + 'RemoveImage',
            getChequeIssue: () => this.Budget.Controller + 'GetChequeIssue',
            saveBankStatement: () => this.Budget.Controller + 'SaveBankStatement',
            getBankStatements: () => this.Budget.Controller + 'GetBankStatements',
            getContigentStaffList: () => this.Budget.Controller + 'GetContigentStaffList',
            createOrEditContigentStaff: () => this.Budget.Controller + 'CreateOrEditContigentStaff',
            updateCheuqeStatus: () => this.Budget.Controller + 'UpdateCheuqeStatus',
            getIssuedCheques: () => this.Budget.Controller + 'GetIssuedCheques',
        }



    static HealthCouncil: any = {
        Controller: '/HealthCouncil/',
        createOrEditCommitteeFormulation: () => this.HealthCouncil.Controller + 'CreateOrEditCommitteeFormulation',
        createOrEditMeetingCall: () => this.HealthCouncil.Controller + 'CreateOrEditMeetingCall',
        createOrEditMeetingDetails: () => this.HealthCouncil.Controller + 'CreateOrEditMeetingDetails',
        createOrEditExpenses: () => this.HealthCouncil.Controller + 'CreateOrEditExpenses',
        getCommitteeFormulationList: () => this.HealthCouncil.Controller + 'GetCommitteeFormulationList',
        createOrEditVendor: () => this.HealthCouncil.Controller + 'CreateOrEditVendor',
        getMeetingCallList: () => this.HealthCouncil.Controller + 'GetMeetingCallList',
        getMeetingDetailsList: () => this.HealthCouncil.Controller + 'GetMeetingDetailsList',
        getVendors: () => this.HealthCouncil.Controller + 'GetVendors',
        getMeetingDetailsById: () => this.HealthCouncil.Controller + 'GetMeetingDetailsById?MeetingDetailId=',
        getHealthFacilityAccountBalance: () => this.HealthCouncil.Controller + 'GetHealthFacilityAccountBalance?healthFacilityId=',
        getAccountHeadsList: () => this.HealthCouncil.Controller + 'GetAccountHeadsList',
        getAccountMeetingsList: () => this.HealthCouncil.Controller + 'GetAccountMeetingsList',
        getMeetingCalls: () => this.HealthCouncil.Controller + 'GetMeetingCalls?HealthFacilityId=',
        getMeetingDisscussedCatgories: () => this.HealthCouncil.Controller + 'GetMeetingDisscussedCatgories?MeetingId=',
        getMeetingExpendetures: () => this.HealthCouncil.Controller + 'GetMeetingExpendetures?MeetingDisscussedCategoryId=',
        getAllVendorsHealthFacilityWise: () => this.HealthCouncil.Controller + 'GetAllVendorsHealthFacilityWise',
        getMeetingExpenses: () => this.HealthCouncil.Controller + 'GetMeetingExpenses',
    }


    static BankDetails: any = {
        Controller: '/BankDetails/',
        createOrEditBankDetails: () => this.BankDetails.Controller + 'CreateOrEditBankDetails',
        getBankListByHealthFacility: () => this.BankDetails.Controller + 'GetBankListByHealthFacility',
        bulkCreateOrEdit: () => this.HealthCouncil.Controller + 'BulkCreateOrEdit',
        getFacilityTypeCountAndBalance: () => this.HealthCouncil.Controller + 'GetFacilityTypeCountAndBalance',
        getAllocateBudget: () => this.HealthCouncil.Controller + 'GetAllocateBudget',
        getHealthFacilitiesDetail: () => this.HealthCouncil.Controller + 'GetHealthFacilitiesDetail',
        getReleaseBudget: () => this.HealthCouncil.Controller + 'GetReleaseBudget',
        getChequeImage: () => this.HealthCouncil.Controller + 'GetChequeImage?BudgetId=',
        updateReleaseBudget: () => this.HealthCouncil.Controller + 'UpdateReleaseBudget',
        saveChequeImage: () => this.HealthCouncil.Controller + 'SaveChequeImage',
        removeImage: () => this.HealthCouncil.Controller + 'RemoveImage',
        getChequeIssue: () => this.HealthCouncil.Controller + 'GetChequeIssue',
    }

    //#endregion
    //#region speech therapy

    static SpeechTherapyDashboard: any =
        {
            Controller: '/Dashboard/',
            getSpeechTherapyDashboardAllCounts: () => this.SpeechTherapyDashboard.Controller + 'getSpeechTherapyDashboardAllCounts',
            getSpeechTherapyDashboardAllList: () => this.SpeechTherapyDashboard.Controller + 'getSpeechTherapyDashboardAllList',

        }

    ////#endregion

    //#region Nutrition

    static NutritionDashboard: any =
        {
            Controller: '/Dashboard/',
            getNutritionDashboardAllCounts: () => this.NutritionDashboard.Controller + 'getNutritionDashboardAllCounts',
            getNutritionDashboardAllList: () => this.NutritionDashboard.Controller + 'getNutritionDashboardAllList',

        }

    ////#endregion
    //#region Psychology

    static PsychologyDashboard: any =
        {
            Controller: '/Dashboard/',
            getPsychologyDashboardAllCounts: () => this.PsychologyDashboard.Controller + 'getPsychologyDashboardAllCounts',
            getPsychologyDashboardAllList: () => this.PsychologyDashboard.Controller + 'getPsychologyDashboardAllList',

        }

    ////#endregion

    //#region MimsMedicineData

    static MimsMedicineData: any =
        {
            Controller: '/MimsMedicineData/',
            GetMedicineIndent: () => this.MimsMedicineData.Controller + 'GetMedicineIndent',
            CreateOrEditMimsGetMedicineResponse: () => this.MimsMedicineData.Controller + 'CreateOrEditMimsGetMedicineResponse',
            UpdateIndentStatus: () => this.MimsMedicineData.Controller + 'UpdateIndentStatus',
            SyncronizeMimsWithHmis: () => this.MimsMedicineData.Controller + 'SyncronizeMimsWithHmis',
            GetUnSyncMedicineIndentFromMims: () => this.MimsMedicineData.Controller + 'GetUnSyncMedicineIndentFromMims',
            SyncronizeAnIndentFromMimsInHmis: () => this.MimsMedicineData.Controller + 'SyncronizeAnIndentFromMimsInHmis',
        }

    ////#endregion

    //#region Emergency Doctor
    static EmergencyDoctor: any =
        {
            Controller: '/EmergencyDoctor/',
            CreateOrEditPatientDiagnose: () => this.EmergencyDoctor.Controller + 'CreateOrEditPatientDiagnose',
        }

    //#endregion

    //#region Medicine Advised

    static MedicineAdvised: any =
        {
            Controller: '/MedicineAdvised/',
            CreateOrEdit: () => this.MedicineAdvised.Controller + 'CreateOrEdit',
            GetByPatientVisitId: () => this.MedicineAdvised.Controller + 'GetByPatientVisitId?patientVisitId=',
            DiscontinueMedicineAdvised: () => this.MedicineAdvised.Controller + 'DiscontinueMedicineAdvised',
            UpdateMedicineAdvisedDays: () => this.MedicineAdvised.Controller + 'UpdateMedicineAdvisedDays',
        }

    //#endregion

    //#region Medicine Advised Requsition

    static MedicineAdvisedRequisition: any =
        {
            Controller: '/MedicineAdvisedRequisition/',
            CreateOrEditWithPrescription: () => this.MedicineAdvisedRequisition.Controller + 'CreateOrEditWithPrescription',
            GetAllWithPagination: () => this.MedicineAdvisedRequisition.Controller + 'GetAllWithPagination',
            GetDespencedMedicine: () => this.MedicineAdvisedRequisition.Controller + 'GetDespencedMedicine?MedicineAdvisedRequisitionId=',
            UpdatePatientMedicineStatus: () => this.MedicineAdvisedRequisition.Controller + 'UpdatePatientMedicineStatus?PatientPrescriptionId=',
            UpdatePatientRequisitionStatus: () => this.MedicineAdvisedRequisition.Controller + 'UpdatePatientRequisitionStatus?MedicineAdvisedRequisitionId=',

            // DiscontinueMedicineAdvised: () => this.MedicineAdvisedRequisition.Controller + 'DiscontinueMedicineAdvised',
            // UpdateMedicineAdvisedDays: () => this.MedicineAdvisedRequisition.Controller + 'UpdateMedicineAdvisedDays',
        }

    //#endregion

    //#region Patient Diagnose Procedure

    static PatientDiagnoseProcedure: any =
        {
            Controller: '/PatientDiagnoseProcedure/',
            CreateOrEdit: () => this.PatientDiagnoseProcedure.Controller + 'CreateOrEdit',
            GetByPatientVisitId: () => this.PatientDiagnoseProcedure.Controller + 'GetByPatientVisitId?patientVisitId=',
        }

    //#endregion
    //#region MLC Dashboard

    static MLCDashboard: any =
        {
            Controller: '/MLCDashboard/',
            getMedicoLegalDashboardAllCounts: () => this.MLCDashboard.Controller + 'getMedicoLegalDashboardAllCounts',
            getMedicoLegalDashboardAllList: () => this.MLCDashboard.Controller + 'getMedicoLegalDashboardAllList',
            getEMCDashboardAllCounts: () => this.MLCDashboard.Controller + 'getEMCDashboardAllCounts',

        }

    //#endregion

    //#region MEAS Dashboard

    static MEADashboard: any = 
    {
        Controller: '/Dashboard/',
        GetCurrentMonthVisits:() => this.MEADashboard.Controller + 'GetCurrentMonthVisits',
        Get_HF_LastVisit: () => this.MEADashboard.Controller + 'Get_HF_LastVisit',
        GetMEACoverageCompliance: () => this.MEADashboard.Controller + 'GetMEACoverageCompliance',
        GetTodaysVisitDetails: () => this.MEADashboard.Controller + 'GetTodaysVisitDetails',
        GetDashboardCounts: () => this.MEADashboard.Controller + 'GetDashboardCounts',
        GetMEAsCoverageAndCompliance: () => this.MEADashboard.Controller + 'GetMEAsCoverageAndCompliance',
    }

    //#endregion
}
