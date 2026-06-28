import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { ApiService } from 'src/Services/api.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ConfigService } from 'src/config/config.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    providers: [MessageService],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent {
    valCheck: string[] = ['remember'];
    password!: string;
    cnic!: string;
    mobile!: string;
    loading = false;
    register: any = {};

    selectedDivision: any = {};
    selectedDistrict: any = {};
    selectedTehsil: any = {};



    divisions: SelectItem[] = [];
    districts: SelectItem[] = [];
    tehsils: SelectItem[] = [];


    filteredDivisions: SelectItem[] = [];
    filteredDistricts: SelectItem[] = [];
    filteredTehsils: SelectItem[] = [];

    constructor(public layoutService: LayoutService,private configService: ConfigService, private apiService: ApiService,private router: Router,private messageService: MessageService) { 
        console.log('API URL:', this.configService.apiUrl);
    }

    ngOnInit() {

        this.divisions = [
            { label: 'Bahawalpur', value: { id: 1, name: 'Bahawalpur', code: "31" } },
            { label: 'Dera Ghazi Khan', value: { id: 2, name: 'Dera Ghazi Khan', code: "32" } },
            { label: 'Faisalabad', value: { id: 3, name: 'Faisalabad', code: "33" } },
            { label: 'Gujranwala', value: { id: 4, name: 'Gujranwala', code: "34" } },
            { label: 'Lahore', value: { id: 5, name: 'Lahore', code: "35" } },
            { label: 'Multan', value: { id: 6, name: 'Multan', code: "36" } },
            { label: 'Rawalpindi', value: { id: 7, name: 'Rawalpindi', code: "37" } },
            { label: 'Sargodha', value: { id: 8, name: 'Sargodha', code: "38" } },
            { label: 'Sahiwal', value: { id: 9, name: 'Sahiwal', code: "39" } },
            { label: 'Islamabad', value: { id: 10, name: 'Islamabad', code: "40" } }
        ];
        
        // Example usage:
        this.districts = [
            { label: 'Bahawalnagar', value: { id: 1, name: 'Bahawalnagar', code: '31001' } },
            { label: 'Bahawalpur', value: { id: 2, name: 'Bahawalpur', code: '31002' } },
            { label: 'Rahim Yar Khan', value: { id: 3, name: 'Rahim Yar Khan', code: '31003' } },
            { label: 'Dera Ghazi Khan', value: { id: 4, name: 'Dera Ghazi Khan', code: '32001' } },
            { label: 'Layyah', value: { id: 5, name: 'Layyah', code: '32002' } },
            { label: 'Muzaffargarh', value: { id: 6, name: 'Muzaffargarh', code: '32003' } },
            { label: 'Rajanpur', value: { id: 7, name: 'Rajanpur', code: '32004' } },
            { label: 'Faisalabad', value: { id: 8, name: 'Faisalabad', code: '33001' } },
            { label: 'Jhang', value: { id: 9, name: 'Jhang', code: '33002' } },
            { label: 'T.T Singh', value: { id: 10, name: 'T.T Singh', code: '33003' } },
            { label: 'Chiniot', value: { id: 11, name: 'Chiniot', code: '33004' } },
            { label: 'Gujranwala', value: { id: 12, name: 'Gujranwala', code: '34001' } },
            { label: 'Gujrat', value: { id: 13, name: 'Gujrat', code: '34002' } },
            { label: 'Sialkot', value: { id: 14, name: 'Sialkot', code: '34003' } },
            { label: 'Narowal', value: { id: 15, name: 'Narowal', code: '34004' } },
            { label: 'Hafizabad', value: { id: 16, name: 'Hafizabad', code: '34005' } },
            { label: 'Mandi Bahuddin', value: { id: 17, name: 'Mandi Bahuddin', code: '34006' } },
            { label: 'Kasur', value: { id: 18, name: 'Kasur', code: '35001' } },
            { label: 'Lahore', value: { id: 19, name: 'Lahore', code: '35002' } },
            { label: 'Sheikhupura', value: { id: 20, name: 'Sheikhupura', code: '35004' } },
            { label: 'Nankana Sahib', value: { id: 21, name: 'Nankana Sahib', code: '35006' } },
            { label: 'Multan', value: { id: 22, name: 'Multan', code: '36001' } },
            { label: 'Vehari', value: { id: 23, name: 'Vehari', code: '36003' } },
            { label: 'Khanewal', value: { id: 24, name: 'Khanewal', code: '36004' } },
            { label: 'Lodhran', value: { id: 25, name: 'Lodhran', code: '36006' } },
            { label: 'Attock', value: { id: 26, name: 'Attock', code: '37001' } },
            { label: 'Jhelum', value: { id: 27, name: 'Jhelum', code: '37002' } },
            { label: 'Rawalpindi', value: { id: 28, name: 'Rawalpindi', code: '37003' } },
            { label: 'Chakwal', value: { id: 29, name: 'Chakwal', code: '37004' } },
            { label: 'Bhakkar', value: { id: 30, name: 'Bhakkar', code: '38001' } },
            { label: 'Khushab', value: { id: 31, name: 'Khushab', code: '38002' } },
            { label: 'Mianwali', value: { id: 32, name: 'Mianwali', code: '38003' } },
            { label: 'Sargodha', value: { id: 33, name: 'Sargodha', code: '38004' } },
            { label: 'Okara', value: { id: 34, name: 'Okara', code: '39003' } },
            { label: 'Sahiwal', value: { id: 35, name: 'Sahiwal', code: '39007' } },
            { label: 'Pakpattan', value: { id: 36, name: 'Pakpattan', code: '39008' } },
            { label: 'Islamabad', value: { id: 37, name: 'Islamabad', code: '40001' } }
        ];

        this.tehsils = [
            { label: 'Bahawalnagar', value: { id: 1, name: 'Bahawalnagar', code: '31001001' } },
            { label: 'Minchanabad', value: { id: 2, name: 'Minchanabad', code: '31001002' } },
            { label: 'Chishtian', value: { id: 3, name: 'Chishtian', code: '31001003' } },
            { label: 'Haroonabad', value: { id: 4, name: 'Haroonabad', code: '31001004' } },
            { label: 'Fortabbas', value: { id: 5, name: 'Fortabbas', code: '31001005' } },
            { label: 'Bahawalpur City', value: { id: 6, name: 'Bahawalpur City', code: '31002001' } },
            { label: 'Yazman', value: { id: 7, name: 'Yazman', code: '31002002' } },
            { label: 'Hasilpur', value: { id: 8, name: 'Hasilpur', code: '31002003' } },
            { label: 'Ahmedpur East', value: { id: 9, name: 'Ahmedpur East', code: '31002004' } },
            { label: 'Khairpur Tamewali', value: { id: 10, name: 'Khairpur Tamewali', code: '31002005' } },
            { label: 'Bahawalpur Saddar', value: { id: 11, name: 'Bahawalpur Saddar', code: '31002007' } },
            { label: 'Rahim Yar Khan', value: { id: 12, name: 'Rahim Yar Khan', code: '31003001' } },
            { label: 'Khanpur', value: { id: 13, name: 'Khanpur', code: '31003002' } },
            { label: 'Liaqatpur', value: { id: 14, name: 'Liaqatpur', code: '31003003' } },
            { label: 'Sadiqabad', value: { id: 15, name: 'Sadiqabad', code: '31003004' } },
            { label: 'Dera Ghazi Khan', value: { id: 16, name: 'Dera Ghazi Khan', code: '32001001' } },
            { label: 'Taunsa Sharif', value: { id: 17, name: 'Taunsa Sharif', code: '32001002' } },
            { label: 'Kot Chutta', value: { id: 18, name: 'Kot Chutta', code: '32001003' } },
            { label: 'Tribal Area', value: { id: 19, name: 'Tribal Area', code: '32001004' } },
            { label: 'Layyah', value: { id: 20, name: 'Layyah', code: '32002001' } },
            { label: 'Chaubara', value: { id: 21, name: 'Chaubara', code: '32002002' } },
            { label: 'Karor Lal-E-Son', value: { id: 22, name: 'Karor Lal-E-Son', code: '32002003' } },
            { label: 'Muzaffargarh', value: { id: 23, name: 'Muzaffargarh', code: '32003001' } },
            { label: 'AliPur', value: { id: 24, name: 'AliPur', code: '32003002' } },
            { label: 'Kot Adu', value: { id: 25, name: 'Kot Adu', code: '32003003' } },
            { label: 'Jatoi', value: { id: 26, name: 'Jatoi', code: '32003004' } },
            { label: 'Rajanpur', value: { id: 27, name: 'Rajanpur', code: '32004001' } },
            { label: 'Jampur', value: { id: 28, name: 'Jampur', code: '32004002' } },
            { label: 'Rojhan', value: { id: 29, name: 'Rojhan', code: '32004003' } },
            { label: 'Faisalabad City', value: { id: 30, name: 'Faisalabad City', code: '33001001' } },
            { label: 'Faisalabad Sadar', value: { id: 31, name: 'Faisalabad Sadar', code: '33001002' } },
            { label: 'Samundri', value: { id: 32, name: 'Samundri', code: '33001003' } },
            { label: 'Jaranwala', value: { id: 33, name: 'Jaranwala', code: '33001004' } },
            { label: 'Tandlianwala', value: { id: 34, name: 'Tandlianwala', code: '33001005' } },
            { label: 'Chak Jhumra', value: { id: 35, name: 'Chak Jhumra', code: '33001006' } },
            { label: 'Jhang', value: { id: 36, name: 'Jhang', code: '33002001' } },
            { label: 'Ahmadpur Sial', value: { id: 37, name: 'Ahmadpur Sial', code: '33002002' } },
            { label: 'Shorkot', value: { id: 38, name: 'Shorkot', code: '33002003' } },
            { label: '18-Hazari', value: { id: 39, name: '18-Hazari', code: '33002005' } },
            { label: 'Toba Tek Singh', value: { id: 40, name: 'Toba Tek Singh', code: '33003001' } },
            { label: 'Gojra', value: { id: 41, name: 'Gojra', code: '33003002' } },
            { label: 'Kamalia', value: { id: 42, name: 'Kamalia', code: '33003003' } },
            { label: 'Pirmahal', value: { id: 43, name: 'Pirmahal', code: '33003005' } },
            { label: 'Chiniot', value: { id: 44, name: 'Chiniot', code: '33004001' } },
            { label: 'Bhowana', value: { id: 45, name: 'Bhowana', code: '33004002' } },
            { label: 'Lalian', value: { id: 46, name: 'Lalian', code: '33004003' } },
            { label: 'Gujranwala', value: { id: 47, name: 'Gujranwala', code: '34001001' } },
            { label: 'Kamoke', value: { id: 48, name: 'Kamoke', code: '34001002' } },
            { label: 'Nowshera Virkan', value: { id: 49, name: 'Nowshera Virkan', code: '34001003' } },
            { label: 'Wazirabad', value: { id: 50, name: 'Wazirabad', code: '34001004' } },
            { label: 'Khiyali Town', value: { id: 51, name: 'Khiyali Town', code: '34001005' } },
            { label: 'Qila Deedar Singh', value: { id: 52, name: 'Qila Deedar Singh', code: '34001006' } },
            { label: 'Aroop Town', value: { id: 53, name: 'Aroop Town', code: '34001007' } },
            { label: 'Gujrat', value: { id: 54, name: 'Gujrat', code: '34002001' } },
            { label: 'Kharian', value: { id: 55, name: 'Kharian', code: '34002002' } },
            { label: 'Sarai Alamgir', value: { id: 56, name: 'Sarai Alamgir', code: '34002003' } },
            { label: 'Sambrial', value: { id: 57, name: 'Sambrial', code: '34003001' } },
            { label: 'Sialkot', value: { id: 58, name: 'Sialkot', code: '34003002' } },
            { label: 'Daska', value: { id: 59, name: 'Daska', code: '34003003' } },
            { label: 'Pasrur', value: { id: 60, name: 'Pasrur', code: '34003004' } },
            { label: 'Narowal', value: { id: 61, name: 'Narowal', code: '34004001' } },
            { label: 'Shakargarh', value: { id: 62, name: 'Shakargarh', code: '34004002' } },
            { label: 'Zafarwal', value: { id: 63, name: 'Zafarwal', code: '34004004' } },
            { label: 'Pindi Bhattian', value: { id: 64, name: 'Pindi Bhattian', code: '34005001' } },
            { label: 'Hafizabad', value: { id: 65, name: 'Hafizabad', code: '34005002' } },
            { label: 'Mandi Bahuddin', value: { id: 66, name: 'Mandi Bahuddin', code: '34006001' } },
            { label: 'Malikwal', value: { id: 67, name: 'Malikwal', code: '34006002' } },
            { label: 'Phalia', value: { id: 68, name: 'Phalia', code: '34006003' } },
            { label: 'Kasur', value: { id: 69, name: 'Kasur', code: '35001001' } },
            { label: 'Kot Radha Kishan', value: { id: 70, name: 'Kot Radha Kishan', code: '35001002' } },


            { label: 'Pattoki', value: { id: 71, name: 'Pattoki', code: '35001003' } },
            { label: 'Chunian', value: { id: 72, name: 'Chunian', code: '35001004' } },
            { label: 'Lahore City', value: { id: 73, name: 'Lahore City', code: '35002001' } },
            { label: 'Raiwind', value: { id: 74, name: 'Raiwind', code: '35002003' } },
            { label: 'Model Town', value: { id: 75, name: 'Model Town', code: '35002005' } },
            { label: 'Shalimar', value: { id: 76, name: 'Shalimar', code: '35002006' } },
            { label: 'Lahore Cantt', value: { id: 77, name: 'Lahore Cantt', code: '35002007' } },
            { label: 'Sheikhupura', value: { id: 78, name: 'Sheikhupura', code: '35004001' } },
            { label: 'Ferozewala', value: { id: 79, name: 'Ferozewala', code: '35004002' } },
            { label: 'Sharaqpur', value: { id: 80, name: 'Sharaqpur', code: '35004003' } },
            { label: 'Muridkey', value: { id: 81, name: 'Muridkey', code: '35004004' } },
            { label: 'Safdar Abad', value: { id: 82, name: 'Safdar Abad', code: '35004006' } },
            { label: 'Nankana Sahib', value: { id: 83, name: 'Nankana Sahib', code: '35006001' } },
            { label: 'Shah Kot', value: { id: 84, name: 'Shah Kot', code: '35006003' } },
            { label: 'Sangla Hill', value: { id: 85, name: 'Sangla Hill', code: '35006004' } },
            { label: 'Multan Sadar', value: { id: 86, name: 'Multan Sadar', code: '36001001' } },
            { label: 'Shuja Abad', value: { id: 87, name: 'Shuja Abad', code: '36001004' } },
            { label: 'Jalalpur Pirwala', value: { id: 88, name: 'Jalalpur Pirwala', code: '36001006' } },
            { label: 'Multan City', value: { id: 89, name: 'Multan City', code: '36001007' } },
            { label: 'Vehari', value: { id: 90, name: 'Vehari', code: '36003001' } },
            { label: 'Burewala', value: { id: 91, name: 'Burewala', code: '36003002' } },
            { label: 'Mailsi', value: { id: 92, name: 'Mailsi', code: '36003003' } },
            { label: 'Khanewal', value: { id: 93, name: 'Khanewal', code: '36004001' } },
            { label: 'Kabirwala', value: { id: 94, name: 'Kabirwala', code: '36004002' } },
            { label: 'Mian Channu', value: { id: 95, name: 'Mian Channu', code: '36004003' } },
            { label: 'Jahanian', value: { id: 96, name: 'Jahanian', code: '36004005' } },
            { label: 'Lodhran', value: { id: 97, name: 'Lodhran', code: '36006001' } },
            { label: 'Duniapur', value: { id: 98, name: 'Duniapur', code: '36006002' } },
            { label: 'Kahror Pacca', value: { id: 99, name: 'Kahror Pacca', code: '36006003' } },
            { label: 'Hazro', value: { id: 100, name: 'Hazro', code: '37001001' } },
            { label: 'Attock', value: { id: 101, name: 'Attock', code: '37001002' } },
            { label: 'Jand', value: { id: 102, name: 'Jand', code: '37001003' } },
            { label: 'Fateh Jang', value: { id: 103, name: 'Fateh Jang', code: '37001004' } },
            { label: 'Pindi Gheb', value: { id: 104, name: 'Pindi Gheb', code: '37001005' } },
            { label: 'Hassanabdal', value: { id: 105, name: 'Hassanabdal', code: '37001006' } },
            { label: 'Jhelum', value: { id: 106, name: 'Jhelum', code: '37002001' } },
            { label: 'Dena', value: { id: 107, name: 'Dena', code: '37002002' } },
            { label: 'Sohawa', value: { id: 108, name: 'Sohawa', code: '37002003' } },
            { label: 'Pind Dadan Khan', value: { id: 109, name: 'Pind Dadan Khan', code: '37002004' } },
            { label: 'Taxila', value: { id: 110, name: 'Taxila', code: '37003001' } },
            { label: 'Kahuta', value: { id: 111, name: 'Kahuta', code: '37003002' } },
            { label: 'Murree', value: { id: 112, name: 'Murree', code: '37003003' } },
            { label: 'Kotli Sattian', value: { id: 113, name: 'Kotli Sattian', code: '37003004' } },
            { label: 'Rawalpindi', value: { id: 114, name: 'Rawalpindi', code: '37003005' } },
            { label: 'Gujar Khan', value: { id: 115, name: 'Gujar Khan', code: '37003006' } },
            { label: 'Kallar Syedan', value: { id: 116, name: 'Kallar Syedan', code: '37003008' } },
            { label: 'Chakwal', value: { id: 117, name: 'Chakwal', code: '37004001' } },
            { label: 'Choa Saidan Shah', value: { id: 118, name: 'Choa Saidan Shah', code: '37004002' } },
            { label: 'Talagang', value: { id: 119, name: 'Talagang', code: '37004003' } },
            { label: 'Kallar Kahar', value: { id: 120, name: 'Kallar Kahar', code: '37004004' } },
            { label: 'Lawa', value: { id: 121, name: 'Lawa', code: '37004005' } },
            { label: 'Bhakkar', value: { id: 122, name: 'Bhakkar', code: '38001001' } },
            { label: 'Mankera', value: { id: 123, name: 'Mankera', code: '38001002' } },
            { label: 'Kallurkot', value: { id: 124, name: 'Kallurkot', code: '38001003' } },
            { label: 'Darya Khan', value: { id: 125, name: 'Darya Khan', code: '38001004' } },
            { label: 'Khushab', value: { id: 126, name: 'Khushab', code: '38002001' } },
            { label: 'Noorpur Thal', value: { id: 127, name: 'Noorpur Thal', code: '38002002' } },
            { label: 'Quaidabad', value: { id: 128, name: 'Quaidabad', code: '38002003' } },
            { label: 'Naushera', value: { id: 129, name: 'Naushera', code: '38002005' } },
            { label: 'Mianwali', value: { id: 130, name: 'Mianwali', code: '38003001' } },
            { label: 'Esa Khel', value: { id: 131, name: 'Esa Khel', code: '38003002' } },
            { label: 'Piplan', value: { id: 132, name: 'Piplan', code: '38003003' } },
            { label: 'Sargodha', value: { id: 133, name: 'Sargodha', code: '38004001' } },
            { label: 'Bhalwal', value: { id: 134, name: 'Bhalwal', code: '38004002' } },
            { label: 'Sahiwal', value: { id: 135, name: 'Sahiwal', code: '38004003' } },
            { label: 'Shahpur', value: { id: 136, name: 'Shahpur', code: '38004004' } },
            { label: 'Sillanwali', value: { id: 137, name: 'Sillanwali', code: '38004005' } },
            { label: 'Kot Momin', value: { id: 138, name: 'Kot Momin', code: '38004007' } },
            { label: 'Bhera', value: { id: 139, name: 'Bhera', code: '38004008' } },
            { label: 'Okara', value: { id: 140, name: 'Okara', code: '39003001' } },
            { label: 'Renala Khurd', value: { id: 141, name: 'Renala Khurd', code: '39003002' } },
            { label: 'Depal Pur', value: { id: 142, name: 'Depal Pur', code: '39003003' } },
            { label: 'Sahiwal City', value: { id: 143, name: 'Sahiwal City', code: '39007001' } },
            { label: 'Chichawatni', value: { id: 144, name: 'Chichawatni', code: '39007002' } },
            { label: 'Pakpattan', value: { id: 145, name: 'Pakpattan', code: '39008001' } },
            { label: 'Arifwala', value: { id: 146, name: 'Arifwala', code: '39008002' } },
            { label: 'Islamabad', value: { id: 147, name: 'Islamabad', code: '40001001' } },
            { label: 'Data Gunj Bakhsh Town', value: { id: 148, name: 'Data Gunj Bakhsh Town', code: '35002008' } },

            { label: 'Data Gunj Bakhsh Town', value: { id: 149, name: 'Data Gunj Bakhsh Town', code: '35002008' } },
            { label: 'Ravi Town', value: { id: 150, name: 'Ravi Town', code: '35002009' } },
            { label: 'Allama Iqbal Town', value: { id: 151, name: 'Allama Iqbal Town', code: '35002010' } },
            { label: 'Nishter Town', value: { id: 152, name: 'Nishter Town', code: '35002011' } },
            { label: 'Gulberg Town', value: { id: 153, name: 'Gulberg Town', code: '35002012' } },
            { label: 'Lahore Cantt', value: { id: 154, name: 'Lahore Cantt', code: '35002014' } },
            { label: 'Samanabad Town', value: { id: 155, name: 'Samanabad Town', code: '35002015' } },
            { label: 'Aziz Bhatti Town', value: { id: 156, name: 'Aziz Bhatti Town', code: '35002016' } },
            { label: 'Wagha Town', value: { id: 157, name: 'Wagha Town', code: '35002017' } }
        ];
        

    //   this.apiService.get('Authenticate', 'logout', null)
    //   .subscribe(response => {
    //     console.log(response);
    //   });

    }

    onDropdownChange(event: any, filter: string) {
       
        if(filter == 'division')
        {
            debugger;
            this.filteredDistricts = this.districts.filter(x => x.value.code.startsWith(event.value.code));
        }
        if(filter == 'district')
        {
            debugger;
            const firstfiveDigits = event.value.code.substring(0, 5);
            this.filteredTehsils = this.tehsils.filter(x => x.value.code.startsWith(firstfiveDigits));
        }
       
    }

    Register()
    {
      
      if (this.isEmailValid(this.register.Email)) {
      } else {
        this.showErrorViaToast("Error", "Invalid Email Format");
        return;
      }
        this.loading = true;
        debugger;
        this.selectedDivision;
        this.selectedDistrict;
        this.selectedTehsil;
        this.register;
        
        this.register.DivisionCode = this.selectedDivision.code;
        this.register.DistrictCode = this.selectedDistrict.code;
        this.register.TehsilCode =  this.selectedTehsil.code;
        this.register.UserName = this.register.CNIC;
        

       this.apiService.post('Authenticate', 'register', this.register).subscribe(x => {
        debugger
        if(x.Status == "Success")
        {
            this.showSuccessViaToast("Success", x.Message)
            this.loading = false;

            this.router.navigate(['/auth/login']);
        }
        if(x.Status == "Error")
        {
            this.showErrorViaToast("Error", x.Message)
            this.loading = false;
        }
       },(error: any) => {
        // Handle other types of errors (e.g., network errors)
        debugger
        this.loading = false;
        this.showErrorViaToast("Error", "Something Went Wrong !")        
       });
    }

    showInfoViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'info', summary, detail });
     }
    
      showWarnViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary, detail });
      }
    
      showErrorViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
      }
    
      showSuccessViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'success', summary, detail });
      }
    

     isEmailValid(email: string): boolean {
        // Regular expression for a simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Test the email against the regular expression
        return emailRegex.test(email);
      }
      
      
      

}
