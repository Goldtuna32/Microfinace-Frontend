"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[244],{2244:(k,m,s)=>{s.r(m),s.d(m,{CifCreateComponent:()=>v});var n=s(9417),d=s(177),e=s(4438),u=s(9609),f=s(2861),h=s(1626);function p(a,c){if(1&a&&(e.j41(0,"option",37),e.EFF(1),e.k0s()),2&a){const r=c.$implicit;e.Y8G("value",r.nrc_code+"/"+r.name_en+"(N)"),e.R7$(),e.Lme(" ",r.nrc_code," / ",r.name_en," ")}}function F(a,c){1&a&&(e.j41(0,"div",38)(1,"small"),e.EFF(2,"\u274c Must be at least 18 years old"),e.k0s()())}function b(a,c){if(1&a&&(e.j41(0,"option",37),e.EFF(1),e.k0s()),2&a){const r=c.$implicit;e.Y8G("value",r.id),e.R7$(),e.SpI(" ",r.branchName," ")}}function C(a,c){if(1&a&&(e.j41(0,"div",39),e.nrm(1,"img",40),e.k0s()),2&a){const r=e.XpG();e.R7$(),e.Y8G("src",r.frontNrcPreview,e.B4B)}}function g(a,c){if(1&a&&(e.j41(0,"div",39),e.nrm(1,"img",41),e.k0s()),2&a){const r=e.XpG();e.R7$(),e.Y8G("src",r.backNrcPreview,e.B4B)}}let v=(()=>{class a{constructor(r,i,o,t){this.fb=r,this.cifService=i,this.branchService=o,this.http=t,this.branches=[],this.nrcFormats=[],this.selectedNrcPrefix="",this.frontNrcFile=null,this.backNrcFile=null,this.errorMessage="",this.frontNrcPreview=null,this.backNrcPreview=null}ngOnInit(){this.cifForm=this.fb.group({name:["",n.k0.required],nrcPrefix:["",n.k0.required],nrcNumber:["",n.k0.required],dob:["",[n.k0.required,this.minimumAgeValidator]],gender:["",n.k0.required],phoneNumber:["",n.k0.required],email:["",[n.k0.required,n.k0.email]],address:["",n.k0.required],maritalStatus:["",n.k0.required],occupation:["",n.k0.required],incomeSource:["",n.k0.required],branchId:["",n.k0.required]}),this.branchService.getBranches().subscribe({next:r=>this.branches=r,error:r=>console.error("Error loading branches:",r)}),this.http.get("assets/nrc.json").subscribe({next:r=>{this.nrcFormats=r.data},error:r=>{console.error("Error loading NRC formats:",r)}})}onNrcPrefixChange(r){const i=r.target.value;console.log("\u{1f50d} Selected NRC Value:",i),i?(this.cifForm.get("nrcPrefix")?.setValue(i),console.log("\u2705 Updated Form Value:",this.cifForm.value)):console.error("\u274c No NRC value selected!")}isFormValid(){return this.cifForm.valid&&this.nrcFormats.length>0&&this.branches.length>0}minimumAgeValidator(r){if(!r.value)return null;const i=new Date(r.value),o=new Date;let t=o.getFullYear()-i.getFullYear();const l=o.getMonth()-i.getMonth(),_=o.getDate()-i.getDate();return(l<0||0===l&&_<0)&&t--,t>=18?null:{underage:!0}}checkAge(){const r=this.cifForm.get("dob");console.log("\u{1f6e0}\ufe0f DOB Control Errors:",r?.errors),this.errorMessage=r?.errors?.underage?"\u274c User must be at least 18 years old.":""}onSubmit(){if(this.cifForm.invalid)return void alert("Please fill in all required fields!");let r=this.cifForm.get("nrcPrefix")?.value;const i=this.cifForm.value.nrcNumber;if(!r||"undefined"===r)return alert("\u274c NRC Prefix is missing! Please select an NRC."),void console.error("\u274c NRC Prefix is missing from form!");this.cifForm.patchValue({nrcPrefix:r});const o=`${r}/${i}`;console.log("\u2705 Full NRC to Submit:",o);const t=new FormData;t.append("name",this.cifForm.value.name),t.append("nrcNumber",o),t.append("dob",this.cifForm.value.dob),t.append("gender",this.cifForm.value.gender),t.append("phoneNumber",this.cifForm.value.phoneNumber),t.append("email",this.cifForm.value.email),t.append("address",this.cifForm.value.address),t.append("maritalStatus",this.cifForm.value.maritalStatus),t.append("occupation",this.cifForm.value.occupation),t.append("incomeSource",this.cifForm.value.incomeSource),t.append("branchId",this.cifForm.value.branchId),console.log("Form Data:",t),this.frontNrcFile&&t.append("fNrcPhotoUrl",this.frontNrcFile),this.backNrcFile&&t.append("bNrcPhotoUrl",this.backNrcFile),this.cifService.createCIF(t).subscribe({next:l=>{console.log("CIF Created:",l),alert("CIF Created Successfully!"),this.cifForm.reset()},error:l=>{console.error("Error Creating CIF:",l),alert("Failed to create CIF")}})}onFileChange(r,i){const o=r.target.files[0];if(o){"front"===i?this.frontNrcFile=o:"back"===i&&(this.backNrcFile=o);const t=new FileReader;t.onload=l=>{"front"===i?this.frontNrcPreview=l.target?.result:"back"===i&&(this.backNrcPreview=l.target?.result)},t.onerror=l=>{console.error("Error reading file:",l)},t.readAsDataURL(o)}}static{this.\u0275fac=function(i){return new(i||a)(e.rXU(n.ok),e.rXU(u.k),e.rXU(f.O),e.rXU(h.Qq))}}static{this.\u0275cmp=e.VBU({type:a,selectors:[["app-cif-create"]],decls:93,vars:7,consts:[[1,"container","mt-5"],[1,"card","shadow-lg","border-0"],[1,"card-header","bg-primary","text-white","py-3"],[1,"mb-0","fw-bold"],[1,"card-body","p-4"],["novalidate","",1,"needs-validation",3,"ngSubmit","formGroup"],[1,"row","g-3","mb-4"],[1,"col-md-6"],[1,"form-label","fw-semibold"],["type","text","formControlName","name","placeholder","Enter full name","required","",1,"form-control","rounded-3"],[1,"col-md-3"],["formControlName","nrcPrefix","required","",1,"form-select","rounded-3",3,"change"],["value","","disabled",""],[3,"value",4,"ngFor","ngForOf"],["type","text","formControlName","nrcNumber","placeholder","6-digit number","required","",1,"form-control","rounded-3"],["type","date","formControlName","dob","required","",1,"form-control","rounded-3",3,"change"],["class","text-danger mt-1",4,"ngIf"],["formControlName","gender","required","",1,"form-select","rounded-3"],["value","","disabled","","selected",""],["value","Male"],["value","Female"],[1,"col-md-4"],["type","tel","formControlName","phoneNumber","placeholder","Enter phone number",1,"form-control","rounded-3"],[1,"col-md-8"],["type","email","formControlName","email","placeholder","Enter email address",1,"form-control","rounded-3"],["type","text","formControlName","address","placeholder","Enter full address",1,"form-control","rounded-3"],["type","text","formControlName","occupation","placeholder","Enter occupation",1,"form-control","rounded-3"],["formControlName","maritalStatus","required","",1,"form-select","rounded-3"],["value","Single"],["value","Married"],["type","text","formControlName","incomeSource","placeholder","Enter income source",1,"form-control","rounded-3"],[1,"mb-4"],["formControlName","branchId","required","",1,"form-select","rounded-3"],["type","file","accept","image/*",1,"form-control","rounded-3",3,"change"],["class","mt-2",4,"ngIf"],[1,"text-end"],["type","submit",1,"btn","btn-primary","px-4","py-2","rounded-3",3,"disabled"],[3,"value"],[1,"text-danger","mt-1"],[1,"mt-2"],["alt","Front NRC Preview",1,"img-fluid","rounded","shadow-sm",2,"max-height","200px","width","auto",3,"src"],["alt","Back NRC Preview",1,"img-fluid","rounded","shadow-sm",2,"max-height","200px","width","auto",3,"src"]],template:function(i,o){if(1&i&&(e.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"h4",3),e.EFF(4,"Create Customer Information File (CIF)"),e.k0s()(),e.j41(5,"div",4)(6,"form",5),e.bIt("ngSubmit",function(){return o.onSubmit()}),e.j41(7,"div",6)(8,"div",7)(9,"label",8),e.EFF(10,"Full Name"),e.k0s(),e.nrm(11,"input",9),e.k0s(),e.j41(12,"div",10)(13,"label",8),e.EFF(14,"NRC Prefix"),e.k0s(),e.j41(15,"select",11),e.bIt("change",function(l){return o.onNrcPrefixChange(l)}),e.j41(16,"option",12),e.EFF(17,"Select NRC"),e.k0s(),e.DNE(18,p,2,3,"option",13),e.k0s()(),e.j41(19,"div",10)(20,"label",8),e.EFF(21,"NRC Number"),e.k0s(),e.nrm(22,"input",14),e.k0s()(),e.j41(23,"div",6)(24,"div",7)(25,"label",8),e.EFF(26,"Date of Birth"),e.k0s(),e.j41(27,"input",15),e.bIt("change",function(){return o.checkAge()}),e.k0s(),e.DNE(28,F,3,0,"div",16),e.k0s(),e.j41(29,"div",7)(30,"label",8),e.EFF(31,"Gender"),e.k0s(),e.j41(32,"select",17)(33,"option",18),e.EFF(34,"Select Gender"),e.k0s(),e.j41(35,"option",19),e.EFF(36,"Male"),e.k0s(),e.j41(37,"option",20),e.EFF(38,"Female"),e.k0s()()()(),e.j41(39,"div",6)(40,"div",21)(41,"label",8),e.EFF(42,"Phone Number"),e.k0s(),e.nrm(43,"input",22),e.k0s(),e.j41(44,"div",23)(45,"label",8),e.EFF(46,"Email"),e.k0s(),e.nrm(47,"input",24),e.k0s()(),e.j41(48,"div",6)(49,"div",7)(50,"label",8),e.EFF(51,"Address"),e.k0s(),e.nrm(52,"input",25),e.k0s(),e.j41(53,"div",7)(54,"label",8),e.EFF(55,"Occupation"),e.k0s(),e.nrm(56,"input",26),e.k0s()(),e.j41(57,"div",6)(58,"div",7)(59,"label",8),e.EFF(60,"Marital Status"),e.k0s(),e.j41(61,"select",27)(62,"option",18),e.EFF(63,"Select Marital Status"),e.k0s(),e.j41(64,"option",28),e.EFF(65,"Single"),e.k0s(),e.j41(66,"option",29),e.EFF(67,"Married"),e.k0s()()(),e.j41(68,"div",7)(69,"label",8),e.EFF(70,"Income Source"),e.k0s(),e.nrm(71,"input",30),e.k0s()(),e.j41(72,"div",31)(73,"label",8),e.EFF(74,"Branch"),e.k0s(),e.j41(75,"select",32)(76,"option",18),e.EFF(77,"Select Branch"),e.k0s(),e.DNE(78,b,2,2,"option",13),e.k0s()(),e.j41(79,"div",6)(80,"div",7)(81,"label",8),e.EFF(82,"Front NRC"),e.k0s(),e.j41(83,"input",33),e.bIt("change",function(l){return o.onFileChange(l,"front")}),e.k0s(),e.DNE(84,C,2,1,"div",34),e.k0s(),e.j41(85,"div",7)(86,"label",8),e.EFF(87,"Back NRC"),e.k0s(),e.j41(88,"input",33),e.bIt("change",function(l){return o.onFileChange(l,"back")}),e.k0s(),e.DNE(89,g,2,1,"div",34),e.k0s()(),e.j41(90,"div",35)(91,"button",36),e.EFF(92," Create CIF "),e.k0s()()()()()()),2&i){let t;e.R7$(6),e.Y8G("formGroup",o.cifForm),e.R7$(12),e.Y8G("ngForOf",o.nrcFormats),e.R7$(10),e.Y8G("ngIf",null==(t=o.cifForm.get("dob"))||null==t.errors?null:t.errors.underage),e.R7$(50),e.Y8G("ngForOf",o.branches),e.R7$(6),e.Y8G("ngIf",o.frontNrcPreview),e.R7$(5),e.Y8G("ngIf",o.backNrcPreview),e.R7$(2),e.Y8G("disabled",!o.isFormValid())}},dependencies:[n.X1,n.qT,n.xH,n.y7,n.me,n.wz,n.BC,n.cb,n.YS,n.j4,n.JD,d.MD,d.Sq,d.bT],encapsulation:2})}}return a})()}}]);