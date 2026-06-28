
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
// import { PatientDoctorFilter } from '../doctors/patientdoctor/patientdoctor-filter';
import { Patient } from './patientmodel';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';

@Injectable({
  providedIn: 'root'
})
export class PatientsService extends ResourceService<Patient> {

  constructor(private http: HttpClient) {
    super(http, Patient, environment.patientApiURL + '/Patient')
  }
  private tbPatientContactData: any;

  setTbPatientContactData(tbPatientContactData: any) {
    this.tbPatientContactData = tbPatientContactData;
    return true;
  }

  getTbPatientContactData() {
    return this.tbPatientContactData;
  }

  getAllBeds(HealthFacilityId: any, DepartmentLookupId: any, SectionLookupId: any) {
    // This will hit the endpoint to get all bed list for a specific ward
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.GetBedsBySectionId()}HealthFacilityId=${HealthFacilityId}&DepartmentLookupId=${DepartmentLookupId}&SectionLookupId=${SectionLookupId}`);
  }

  getPatientbyCNIC(key: any, value: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetByKeys()}${key}&SearchValue=${value}`);
  }

  isPatientAdviseMedicineInLastVisit(cnic: any, deptId: any, sectionId: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.IsPatientAdviseMedicineInLastVisit()}${cnic}&DeptId=${deptId}&SectionId=${sectionId}`);
  }

  getPatientbyMRNO(key: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetByMrNo()}${key}`);
  }


  GetPatientAdditionalInfoByPatientId(PatientId: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientAdditionalInfoByPatientId()}${PatientId}`);
  }

  GetPatientAdditionalInfoByPatientIdPme(PatientId: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientAdditionalInfoByPatientIdPme()}${PatientId}`);
  }

  getPatientbyVisit(VisitId: any, DiagnoseId?: any): Observable<any> {

    if (DiagnoseId)
      return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.PatientVisitDetailById()}${VisitId}&DiagnoseId=${DiagnoseId}`);
    else
      return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.PatientVisitDetailById()}${VisitId}`);
  }

  getPatientVisitForVital(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientVisitForVitalById()}${Id}`);
  }

  getPatientVisitForDoctor(Id: any, pmisCheck?: any, isPatientHistory: boolean = false): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientVisitForDoctorById()}${Id}&IsFromPMIS=${pmisCheck}&isPatientHistory=${isPatientHistory}`);
  }

  GetPatientVisitForMlcDoctorById(Id: any, pmisCheck?: any, isPatientHistory: boolean = false, FormTypeMlc?: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientVisitForMlcDoctorById()}${Id}&IsFromPMIS=${pmisCheck}&isPatientHistory=${isPatientHistory}&FormTypeMlc=${FormTypeMlc}`);
  }

  getPatientVisitForPharmacy(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientVisitForPharmacyById()}${Id}`);
  }

  getPatientDiagnoseRecord(Id: any, daignoseId?: any): Observable<any> {
    if (daignoseId)
      return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientDiagnoseRecordByVisitId()}${Id}&DiagnoseId=${daignoseId}`);
    else
      return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientDiagnoseRecordByVisitId()}${Id}`);
  }

  getAdmissionDetailByVisitId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientAdmissionDetail.GetAdmissionDetailByVisitId()}${Id}`);
  }
  getDischargeDetailByVisitId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDischargeDetail.GetDischargeDetailByVisitId()}${Id}`);
  }
  getPatientHistory(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.PatientVisitHistory()}${Id}`);
  }

  getAllTestListByVisitId(Id: any): Observable<any> {
    return this.http.get(`${environment.pathologyApiURL}${EndPointConstant.PatientLabTest.GetAllTestListByVisitId()}${Id}`);
  }

  getHealthfacilityDept(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartment.GetHfDepartmentsByHealthFacility()}`);
  }

  getDepartmentSections(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.GetHfDepartmentSectionsByHfDepartmentId()}${Id}`);
  }

  getAllLocations(): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.Province.GetAllLocations()}`);
  }

  getProvince(): Observable<any> {

    return this.http.get(`${environment.apiURL}/Province/GetAll`);
  }

  getDivision(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}/Division/GetAllByProvinceId?ProvinceId=${Id}`);
  }

  getDistrict(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}/District/GetAllByDivisionId?DivisionId=${Id}`);
  }


  getTehsil(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}/Tehsil/GetAllByDistrictId?DistrictId=${Id}`);
  }

  getUnionCouncil(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}/UnionCouncil/GetAllByTehsilId?TehsilId=${Id}`);
  }

  getLabTests(Id: any): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.LabTest.GetAllByDepartmentId()}${Id}`);
  }

  // New Function to Get Lab Test With Configuration
  getAllLabTests(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.LabTest.GetAllWithHealthFacilityId()}`);
  }
  // Old Function to Get Lab Test
  // getAllLabTests(): Observable<any> {
  //   return this.http.get(`${environment.apiURL}${EndPointConstant.LabTest.GetAll()}`);
  // }

  getAllCacheLabTest(): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.LabTest.GetAllCacheLabTest()}`);
  }

  getTodayList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.GetTodayVisits()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  getPatientDiagnoseById(Id: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetByIdWithPrescription()}${Id}`);

  }

  getAllWithPagination(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetAllWithPagination()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  getAllWithPaginationWithDetail(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetAllWithPaginationWithDetail()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  getOldList(paginatorModel: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.GetOldVisits()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  savePatientRegistration(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CreateOrEditWithVisit()}`, obj);
  }
  DischargeIpdPatient(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDischargeDetail.DischargePatientVisit()}`, obj);
  }

  saveUnknownPatientRegistration(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CreateUnknownPatient()}`, obj);
  }

  savepatientAndDispence(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.MedicineDispatch.CreatePatientDispatch()}`, obj);
  }

  createPatientContactDetails(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CreatePatientContactDetails()}`, obj);
  }

  createPatientAdditionalInfo(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.AddNewAdditionalPatientInfo()}`, obj);
  }


  savePmis(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CreatePmis()}`, obj);
  }
  savePatientHistory(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CreatePatientHistory()}`, obj);
  }
  saveFeePayment(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.SaveFeePayment()}`, obj);
  }
  RefundFee(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.RefundFee()}`, obj);
  }

  getPharmacySlipByVisitId(Id?: string): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.MedicineDispatch.GetPharmacySlipByVisitId()}${Id}`);
  }

  getPatienVitalQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientVital.GetAllQue()}${Id}`);
  }

  getPatientdata(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetById()}${Id}`);
  }

  getDoctorPatientdata(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetByIdWithDetails()}${Id}`);
  }

  savePatientVitals(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientVital.CreateOrEditPatientVitals()}`, obj);

  }

  getVitalPatientByVisitId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientVital.GetByVisitId()}${Id}`);
  }

  getLabPatientByVisitId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetLabTestbyVisitId()}${Id}`);
  }

  getLabPatientByDiagnoseId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetLabTestbyDiagnoseId()}${Id}`);
  }

  public dashifyCNIC(cnic: string) {
    if (!cnic) {
      return '';
    }
    return cnic[0] +
      cnic[1] +
      cnic[2] +
      cnic[3] +
      cnic[4] +
      '-' +
      cnic[5] +
      cnic[6] +
      cnic[7] +
      cnic[8] +
      cnic[9] +
      cnic[10] +
      cnic[11] +
      '-' +
      cnic[12];
  }

  getDoctorsQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetAllQue()}${Id}`);
  }

  getDoctorsQueueMLC(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetAllQueMlc()}${Id}`);
  }

  getIpdDoctorsQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetAllIpdQue()}${Id}`);
  }
  getPharmacyIpdQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.MedicineDispatch.GetAllIpdQue()}${Id}`);
  }
  getPharmacyQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.MedicineDispatch.GetAllQue()}${Id}`);
  }
  getAllMedicine(): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.MedicineLookup.GetAvailableMedicine()}`);
  }

  saveDoctorAndVisitclose(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.CreateOrEditPatientDiagnoseWithPrescription()}`, obj);
  }

  // ============================ EMERGENCY DOCTOR =====================================
  getPatientVisitForEmergencyDoctorById(Id: any, pmisCheck?: any, isPatientHistory: boolean = false): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientVisitForEmergencyDoctorById()}${Id}&IsFromPMIS=${pmisCheck}&isPatientHistory=${isPatientHistory}`);
  }
  //====================================================================================

  SavePatientDiagnoseWithPrescriptionForIpd(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.CreateOrEditPatientDiagnoseWithPrescriptionForIpd()}`, obj);
  }
  saveDoctorphysioTherapist(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.CreateOrEditPhysiotherapyForm()}`, obj);

  }
  saveDoctorTemplate(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnoseTemplate.CreateOrEdit()}`, obj);
  }

  getTemplatetByUserId(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnoseTemplate.GetByUserId()}${Id}`);
  }

  deletePatientDiagnoseTemplate(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnoseTemplate.Delete()}${Id}`, Id);
  }
  deletePatientPrescription(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientPrescription.Delete()}${Id}`, Id);
  }
  CheckIfMedicineDispensed(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientPrescription.CheckIfMedicineDispensed()}${Id}`, Id);
  }
  CheckIfCanDeleteLab(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientPrescription.CheckIfCanDeleteLab()}${Id}`, Id);
  }

  getTbPatientList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetTbPatientsList()}` + '?' + this.encodeQueryData(paginatorModel));
  }
  getEyeBlindnessPatientList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetEyeBlindnessPatientList()}` + '?' + this.encodeQueryData(paginatorModel));
  }


  getExcelExportEyeBlindnessPatientList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetExcelExportEyeBlindnessPatientList()}` + '?' + this.encodeQueryData(paginatorModel));
  }
  getUnknownPatientsList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetUnknownPatientsList()}` + '?' + this.encodeQueryData(paginatorModel));
  }


  getMortauryPatientsList(paginatorModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetMortauryPatientsList()}` + '?' + this.encodeQueryData(paginatorModel));
  }

  VerifyWithNADRA(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.VerifyWithNADRA()}`, obj);

  }


  getVerifiedPatientDataFromNADRA(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetVerifiedPatientDataFromNADRA()}${Id}`);
  }


  getVerifiedPatientDataFromNADRAForDeadBody(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetVerifiedPatientDataFromNADRAForDeadBody()}${Id}`);
  }

  getTbPatientContactList(tbPatientContactDetailsFilterModel: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetTbPatientContactListByPatientId()}` + '?' + this.encodeQueryData(tbPatientContactDetailsFilterModel));
  }

  updateSputumById(ContactId: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.UpdateSputumById()}${ContactId}`, ContactId);
  }

  getSectionProcedureBySectionId(sectionLookupId: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.SectionProcedure.GetBySectionLookupId()}${sectionLookupId}`);
  }

  getGlobalQue(searchkey: string): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.GetAllQue()}${searchkey}`);

  }

  checkOutPatient(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.ReleaseOccupiedPatientVisit()}${Id}`, Id);

  }
  getIPDQueue(Id: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetAllQueForIpd()}${Id}`);
  }
  getIPdSlipData(Id: any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetPatientDischargeReceiptForIpdById()}${Id}`);
  }
  UpdatePatientEligibleForSSC(obj: any): Observable<any> {

    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.UpdatePatientEligibleForSSC()}`, obj);
  }
  CreateOrEdit(obj: any): Observable<any> {
    return this.http.post(`${environment.hcpApiURL}${EndPointConstant.HCPScreening.CreateOrEdit()}`, obj);
  }

  getLostOfFollowupPatients(paginatorModel: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetLostOfFollowupPatients()}` + '?' + this.encodeQueryData(paginatorModel));
  }
  getSvrPcrPendingPatients(paginatorModel: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetSvrPcrPendingPatients()}` + '?' + this.encodeQueryData(paginatorModel));
  }



  checkRoomNoForSpeciality(healthFacilityId: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.CheckRoomNoForSpeciality()}${healthFacilityId}`);
  }


  GetFeePaymments(filter: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetFeePaymments()}` + '?' + this.encodeQueryData(filter));
  }


  updatePrintStatusPatientDiagnose(Id: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.UpdatePrintStatusPatientDiagnose()}${Id}`, Id);
  }


  CheckIfPatientVisitExist(PatientId: any, HealthFacilityId: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.Patient.CheckIfPatientVisitExist()}${PatientId}&HealthFacilityId=${HealthFacilityId}`, PatientId);
  }


  
  getFilteredDentalProcedureList(paginatorModel: any): Observable<any> {
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.GetFilteredDentalProcedureList()}` + '?' + this.encodeQueryData(paginatorModel));
  }

  
  updateProcedureData(obj: any): Observable<any> {
    return this.http.post(`${environment.patientApiURL}${EndPointConstant.PatientDiagnose.UpdateProcedureData()}`, obj);
  }


  
  GetAlmonerSpecialityFeeStat(filterModel:any): Observable<any>{
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetAlmonerSpecialityFeeStat()}`+ this.encodeQueryData(filterModel));
  }
  
  getAlmonerDentalProcedureStat(filterModel:any): Observable<any>{
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetAlmonerDentalProcedureStat()}`+ this.encodeQueryData(filterModel));
  }
  
  getAlmonerDentalProcedureList(filterModel:any): Observable<any>{
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetAlmonerDentalProcedureListWithPagination()}`+ this.encodeQueryData(filterModel));
  }
  
  getAnmonalSpecilityFeeListWithPagination(filterModel:any): Observable<any>{
    return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.GetAnmonalSpecilityFeeListWithPagination()}`+ this.encodeQueryData(filterModel));
  }
  // getTbPatientContactList(tbPatientContactDetailsFilterModel:any): Observable<any> {

  //
  //   return this.http.get(`${environment.patientApiURL}${EndPointConstant.Patient.getTbPatientContactListByPatientId()}`+ '?'+ this.encodeQueryData(tbPatientContactDetailsFilterModel));
  // }


}
