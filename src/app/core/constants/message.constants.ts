
export class MessageConstant {

    //#region User Error

    public static UserAlreadyExist = 'User already exist';
    public static UserNotPresentInHR = 'User does not exist in HR';
    public static UserAlreadyLoggedIn = 'User already loggedIn!';
    public static ConfirmPassword = 'Password Update Successfully';
    public static PasswordNotMatch = 'New Password did not Match With Confirm New Password';
    public static TestAlreadyInConsignment = 'Test Already Added In this Consignment'



    //#endregion

    //#region Roles
    public static SelectAtLeastOneRole = 'At least one role should be selected';
    //#endregion

    //#region Health Facility Error

    public static readonly ErrorCantPerformHFOperation = 'Please login with health facility user!';

    //#endregion

    //#region Patient Doctor

    public static LabAlert = 'Patient is Attended by Almoner/Pathalogy, Now you cannot Delete this Lab Test!';
    public static MedicineAlert = 'Medicine is Dispensed, you cannot Delete it!';
    public static MedicineAlreadySelected = 'Medicine Already Selected';
    public static AdviceGivenIsRequired = 'Advice Given Is Required';
    public static PleaseSelectPatientFromQueue = 'Please Select a Patient from Queue';
    public static PleaseSelectDepAndSec = 'Please Select Department & Section';
    public static pleaseddPatientWeightInVitals = 'Please add patient weight in vitals';
    public static TakePatientVitals = 'Please add Patient Required Vitals';
    public static chooseLabTestIssueMedicine = 'Choose Lab Test/ Issue Medicine ';
    public static ConsultantNotAvailable = 'Consultant Not Available';
    public static ConsultantNotAvailableDetail = 'There is no Consultant in Current Department';
    public static Requisition = 'Select Medicine';
    public static RequisitionDetail = 'Atleast Select One Medicine to Make Requisition';

    public static MedicineQuantityForRequisition = 'Incorrect Quantity';
    public static MedicineQuantityForRequisitionDetail = 'Kindly select Medicine Quantity between 1 and Available Prescribed Quantity!';

    public static selectAtleastOneTBLabTest = '';
    public static patientContactDetails = 'Patient Contact Details Saved Successfully';
    public static FollowupDateCannotBeOfThePast = 'Followup date cannot be set to past date';
    public static FollowupDateCannotBeMoreThanOneYear = 'Followup date cannot be set to more than one year';
    public static SelectIsGynaePatient = 'Select Is Gynae Patient';
    public static AtleastOneItemIsPerformedOrHasFeedback = 'At least one item is performed or has feedback.';
    public static AlreadyAddedInList = 'Already Added In List';

    //#endregion


    //#region TB

    public static AddPatientOutcomes = 'Add Patient Outcomes';
    public static PatientOutcomeSuccessfullyAdded = 'Patient Outcomes Successfully Added';
    public static SelectDRTBCenter = 'Select DRTB Center';
    public static selectFollowupDate = 'Select Followup date';
    public static addMedicine = 'Kindly Add Medicine';
    public static CultureAndLPALabTest = 'Assign Culture and LPA Lab Test';
    public static addContacts = 'Kindly Add Contact Details';
    public static MustSelectSSMOrXpert = 'Kindly Select Atleast One Test From (Sputum Smear Microscopy / X-Pert)';
    public static selectHivScreeningLabTest = 'Select HIV Screening Lab Test';
    public static selectTbPatientType = 'Select TB Patient Type';
    public static selectTbPatientConfirmationType = 'Select TB Patient Confirmation Type';
    public static selectTbPatientStatus = 'Select TB Patient Status';
    public static selectXpertLabTest = 'Select Xpert Lab Test';
    public static selectTBLabTest = 'Select TB Lab Test';
    public static fillAllContactDetails = 'Fill All Contact Details';
    public static contactNumberMustBeUnique = 'Contact Number Must Be Unique';
    public static FailedToReteriveDataPatientData = 'Failed To Reterive TB Patient Contact Data';
    public static SelectVisitDate = 'Select Visit Date';
    public static SelectHealthFacility = 'Select Healthfacility';

    //#endregion


    //#region Victom Of Avastin
    public static FillAllDetailsForVictimOfAvastin = 'Fill All Details For Victim Of Avastin';
    //#endregion



    //#region Nutrition From
    public static SelectTypeName = 'Select Type Of Visit';
    //#endregion


    //#region DRTB

    public static selectDRTBPatientStatus = "Select DRTB Patient Status";

    //#endregion

    //#region PMIS

    public static Vitals = 'Vitals Pending Recente Patient Please Add Vitals ';
    public static Doctor = 'Prescription Pending Recente Patient Please Add Prescription ';
    public static Pharmacy = 'Dispence Medicine Pending Recente Patient Please Dispence Medicine';

    //#endregion

    //#region Errors
    public static InternalServerError = 'Internal Server Error';
    public static CheckYourInternetConnection = 'Please check your internet connection';
    //#endregion


    //#region
    public static PatientSuptumUpdate = 'Patient Sputum Collected Now Generate Visit'
    public static PatientNotSuptumUpdate = 'Failed To Collect Sputum'

    //#endregion

    //#region Registration
    public static FailedToGenerateVisit = 'Failed To Generate Visit';
    //#endregion

    //#region pharmacy
    public static NoMedicinePrescribed = 'No Medicine Prescirbed to This Patient By Doctor';
    public static FillAllRiskFactors = 'Fill All Risk Factors';
    public static MedicineIndentSyncStatusSuccess = 'Medicine Indent Status Updated';
    public static MedicineIndentSyncStatusFailure = 'Medicine Indent Status Not Updated';
    public static InvalidQuantity = 'Invalid Quantity';
    //#endregion



    //#region assignableUserRoles
    public static RoleSaveSuccessfully = 'Role Save Successfully'
    public static FailedRoleToSave = 'Failed To Save'
    //#endregion

    //#region HCP
    public static ASKPatientForScreening = 'Ask Patient to take Screening to continue Treatment'
    public static CompleteScreeningBeforeSubmit = 'Please Complete Patient Screening Before Submit'
    public static SelectVaccinationDateFirst = 'Please Select Vaccination Date'
    public static SelectMedicineRegime = 'Please Select Medicine Regime'
    public static PatientOnDialysisOrNot = 'Please Mention if Patient is on Dialysis or Not'
    public static ErrorGettingPatientScreening = 'Error Getting Patient Screening'
    public static SelectPatientVisitType = 'Select Patient Visit Type First'
    public static AddLabTestsFirst = 'Add Lab Tests First'
    public static AddLabMedicinesFirst = 'Add Medicines First'
    public static SelectVisitCountFirst = 'Select Visit Count First'
    public static CannotSelectSameFollowup = 'Cannot Select Same Followup'
    public static PatientHasCompletedTreatment = 'Patient Has Completed His/Her Treatment'
    public static ErrorCreatingBatchName = 'Error in Creating Batch Name'
    public static ErrorGettingSVRPCRDate = 'Error Getting SVR/PCR Date'
    public static SelectBatchTypeFirst = 'Select Batch Type First'
    public static SelectRightBatchTypeSample = 'Select Right Batch Type Sample'
    public static BatchLimitError = '93 Batch Limit has been reached'
    public static TestAlreadyInBatch = 'Test Already Added In this Batch'
    public static ErrorGettingProfileTypes = 'Error in Getting Profile Types'
    public static BaseLineTestFirst = 'Patient is Advised to complete Baseline Tests First'
    public static CBCnLFTTestFirst = 'Patient is Advised to Take CBC & LFT First for Medication and APRI Calculator'
    public static HBVPendingPCRReport = 'HBV PCR Result is Pending'
    public static HCVPendingPCRReport = 'HCV PCR Result is Pending'
    public static ResultIsNotDetected = 'Result is Not Detected'
    public static NullValueFoundInBaseLineTests = 'Null Value Found in Baseline Tests'
    public static EmptyBatchList = 'Empty Batch List'
    public static ErrorFetchingSVRStatus = 'Error Fetching SVR Pending Status'
    public static ErrorFetchingPCRStatus = 'Error Fetching PCR Pending Status'

    //#endregion

    //#region Physio-therapy
    public static TypeOfVisit = 'Please Select At Least One Type Of Visit'
    public static Diagnosis = 'All Fields Are Required For Diagnosis Except Previous Drug History'
    public static Modalitites = 'Atleast One Modality Is Required OR Select No Modality With Reason'
    public static ModalititesDetails = 'Please Enter The Details Of Selected Modality'
    public static PreviousDrugHistory = 'Please Enter The Details About Previous Drug History'
    public static Total_Duration_Of_Tratement_Session = 'Please Select Total Duration Of Tratement Session '
    public static Home_Exercise_Plan_Dropdown = 'Please Select Home Exercise Plan'
    public static Clinical_Diagnosis = 'Please Enter Clinical Diagnosis'
    public static Prognosis = 'Please Select Prognosis'
    public static Physiotherapy_Diagnosis = 'Please Enter Physiotherapy Diagnosis'
    public static EmptyPhysioForm = 'Please Fill Required Fields'



    //#endregion


    //#region Health Council

    public static AccountStatusIsNotActive = 'Account status is not active'
    public static EnterDiaryNo = 'Enter Diary No.'
    public static SelectCourierCompany = 'Enter Courier Company'
    public static EnterCourierDispatchDate = 'Enter Courier Dispatch Rate'
    public static EnterChequeNo = 'Enter Cheque No.'
    public static EnterChequeDate = 'Enter Cheque Date'
    public static RecordSavedSuccessfully = 'Record Saved Successfully'
    public static InsufficientBalance = 'Insufficient Balance'
    public static Note = 'Due to insufficient funds, the health facility is currently unable to arrange meeting calls.'
    //#endregion

    //#region File
    public static FileUploadedSuccessfully = 'File Uploaded Successfully'
    public static ImageRemovedSuccessfully = 'Image Removed Successfully'
    public static FailedToRemoveImage = 'Failed To Remove Image'
    public static FileAlreadyAdded = 'File Already Added'
    //#endregion



    //#region IPD
    public static DiagnoseNotPerformed = 'Diagnose Not Performed'
    //#endregion


}


