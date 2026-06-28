export var dose:any = {
  tablet:
    [
      {name: "1/4 گولی" ,value:1/4},
      {name: "1/2 گولی" ,value:1/2},
      {name: "1 گولی" ,value:1},
      {name: "2  گولی",value:2},
      {name: "3  گولی",value:3},
      {name: "4  گولی",value:4},
      {name: "5  گولی",value:5},
      {name: "6  گولی",value:6},
      {name: "7  گولی",value:7},
      {name: "8  گولی",value:8},
      {name: "9  گولی",value:9},
      {name: "10 گولی",value:10}
    ],
  capsule:
    [
      {name: "1/2 کیپسول" ,value:1/2},
      {name: "1 کیپسول" ,value:1},
      {name: "2  کیپسول",value:2},
      {name: "3  کیپسول",value:3},
      {name: "4  کیپسول",value:4},
      {name: "5  کیپسول",value:5},
      {name: "6  کیپسول",value:6},
      {name: "7  کیپسول",value:7},
      {name: "8  کیپسول",value:8},
      {name: "9  کیپسول",value:9},
      {name: "10 کیپسول",value:10}
    ],
  syrup:
    [
      {name:"1/2 چمچ", value:1/2},
      {name:"پونا چمچ", value:3/4},
      {name:"1 چمچ", value:1},
      {name:"سوا چمچ", value:1.25},
      {name:"ڈیڑھ چمچ", value:1.5},
      {name:"2 چمچ", value:2},
      {name:"1 سی سی", value:3},
      {name:"2 سی سی", value:4},
      {name:"3 سی سی", value:5},
      {name:"5 سی سی", value:6},
    ],
  pack:
    [
      {name:"1 عدد", value:1},
      {name:"2 عدد", value:2},
      {name:"3 عدد", value:3},
      {name:"4 عدد", value:4},
      {name:"5 عدد", value:5},
      {name:"6 عدد", value:6},
      {name:"7 عدد", value:7},
      {name:"8 عدد", value:8},
      {name:"9 عدد", value:9},
      {name:"10 عدد", value:10},
    ],
  injection:
    [
      {name:"1 انجکشن",value:1}
    ],
  drip:
    [
      {name:"1 ڈرپ",value:1}
    ],
  infusion:
  [
      {name:"1",value:1}
  ],
  drop:
    [
      {name:"1 قطرہ",value:1},
      {name:"2 قطرے",value:2},
      {name:"3 قطرے",value:3},
      {name:"4 قطرے",value:4}
    ],
  cream:
  [
    {name:"متاثرہ جگہ پر لگائیں",value:1},
    {name:"بالوں کی جڑوں میں لگائیں",value:1},
    {name:"گردن سے پاؤں تک لگائیں",value:1},
    {name:"چہرے پر لگائیں",value:1},
    {name:"رات کو سونے سے پہلے جلد پر لگائیں",value:1},
    {name:"As per Doctor Recommendation",value:1}
  ],
  spray:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  powder:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  lotion:
  [
    {name:"As per Doctor Recommendation",value:1},
    {name:"رات کو سونے سے پہلے جلد پر لگائیں",value:1},
    {name:"متاثرہ جگہ پر لگائیں",value:1},
    {name:"بالوں کی جڑوں میں لگائیں",value:1},
    {name:"گردن سے پاؤں تک لگائیں",value:1},
    {name:"چہرے پر لگائیں",value:1},
  ],
  sachet:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  ointment:
  [
    {name:"متاثرہ جگہ پر لگائیں",value:1},
    {name:"بالوں کی جڑوں میں لگائیں",value:1},
    {name:"گردن سے پاؤں تک لگائیں",value:1},
    {name:"چہرے پر لگائیں",value:1},
    {name:"رات کو سونے سے پہلے جلد پر لگائیں",value:1},
    {name:"As per Doctor Recommendation",value:1}
  ],
  roll:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  inhaler:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  soap:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  facewash:
  [
    {name:"As per Doctor Recommendation",value:1}
  ],
  gel:
  [
    {name:"As per Doctor Recommendation",value:1}
  ]
};
    
export var route:any = [
  {
    name:"PO (Oral)",
    value:"po"
  },
  {
    name:"IV (Into the Vein)",
    value:"iv"
  },
  {
    name:"IM (Into the Muscle)",
    value:"im"
  },
  {
    name:"SC (Between the Skin and Muscle)",
    value:"sc"
  },
  {
    name:"PR",
    value:"pr"
  },
  {
    name:"PV (Into the Vagina)",
    value:"pv"
  },
  {
    name:"Inhale",
    value:"po"
  },
  {
    name:"Sublingual (Beneath the tongue)",
    value:"su"
  },
  {
    name:"Topical (Effected Place)",
    value:"to"
  },
  {
    name:"As directed",
    value:"as directed"
  },
  {
    name:"-",
    value:"-"
  }
   
];
    
export var frequency:any = [
  {
    name:"دن میں ایک دفعہ",
    value:1
  },
  {
    name:"صبح + شام",
    value:2
  },
  {
    name:"صبح، دوپہر،شام",
    value:3
  },
  {
    name:"صبح، دوپہر،شام، رات",
    value:4
  },
  {
    name:"-",
    value:1
  }
];
    
export var instructions:any = [
  {
    name:"صبح ناشتہ سے پہلے",
    value:1
  },
  {
    name:"صبح ناشتہ سے پہلے اور رات کھانے سے پہلے",
    value:2
  },
  {
    name:"کھانے کے بعد",
    value:3
  },
  {
    name:"کھانے سے پہلے",
    value:4
  },
  {
    name:"کھانے کے درمیان",
    value:5
  },
  {
    name:"رات کو سوتے وقت",
    value:6
  },
  {
    name:"ماہواری کے5 دن",
    value:7
  },
  {
    name:"ہفتے میں ایک بار",
    value:8
  },
  {
    name:"ہفتے میں دو بار",
    value:9
  },
  {
    name:"دن میں ایک بار",
    value:10
  },
  {
    name:"-",
    value:11
  }

];
    
export var duration:any = [
  {
    name:"1",
    value:1
  },
  {
    name:"2",
    value:2
  }, 
  {
    name:"3",
    value:3
  },
  {
    name:"5",
    value:5
  },
  {
    name:"7",
    value:7
  },
  {
    name:"10",
    value:10
  },
  {
    name:"14",
    value:14
  },
  {
    name:"21",
    value:21
  },
  {
    name:"28",
    value: 28
  },
  {
    name:"30",
    value:30
  },
  {
    name:"-",
    value:1
  }
];

export var medicinetypes:any = [
  
  {
    name:"Tablet",
    MedicineTypeName:'tablets'
  },
  {
    name:"Syrup",
    MedicineTypeName:'syrup'
  },
  {
    name:"Injection",
    MedicineTypeName:'injection'
  },
  {
    name:"Drip",
    MedicineTypeName:'drip'
  },
  {
    name:"Drop",
    MedicineTypeName:'drops'
  },
  {
    name:"Pack",
    MedicineTypeName:'pack'
  },
  {
    name:"Cream",
    MedicineTypeName:'cream'
  },
  {
    name:"Solution",
    MedicineTypeName:'solution'
  },
  {
    name:"Infusion",
    MedicineTypeName:'infusion'
  },
  {
    name:"Capsule",
    MedicineTypeName:'capsule'
  },
  {
    name:"Ointment",
    MedicineTypeName:'ointment'
  },
  {
    name:"Roll",
    MedicineTypeName:'roll'
  },
  {
    name:"Powder",
    MedicineTypeName:'powder'
  },
  {
    name:"Spray",
    MedicineTypeName:'spray'
  },
  {
    name:"Gel",
    MedicineTypeName:'gel'
  },
  {
    name:"Granules",
    MedicineTypeName:'granules'
  },
  {
    name:"Lotion",
    MedicineTypeName:'lotion'
  },
  {
    name:"FaceWash",
    MedicineTypeName:'facewash'
  },
  {
    name:"Shampoo",
    MedicineTypeName:'shampoo'
  },
  {
    name:"Soap",
    MedicineTypeName:'soap'
  }

]