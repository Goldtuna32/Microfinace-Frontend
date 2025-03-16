"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[888],{4888:(B,l,s)=>{s.r(l),s.d(l,{BranchCreateComponent:()=>y});var o=s(9417),c=s(177),e=s(4438),d=s(1626),h=s(2861);function u(r,i){1&r&&(e.j41(0,"div",29),e.EFF(1," Branch Name is required. "),e.k0s())}function b(r,i){1&r&&(e.j41(0,"span"),e.EFF(1,"Phone Number is required."),e.k0s())}function p(r,i){1&r&&(e.j41(0,"span"),e.EFF(1,"Enter a valid phone number (10-15 digits)."),e.k0s())}function g(r,i){if(1&r&&(e.j41(0,"div",29),e.DNE(1,b,2,0,"span",30)(2,p,2,0,"span",30),e.k0s()),2&r){const n=e.XpG();e.R7$(),e.Y8G("ngIf",null==n.branchForm.controls.phoneNumber.errors?null:n.branchForm.controls.phoneNumber.errors.required),e.R7$(),e.Y8G("ngIf",null==n.branchForm.controls.phoneNumber.errors?null:n.branchForm.controls.phoneNumber.errors.pattern)}}function f(r,i){1&r&&(e.j41(0,"span"),e.EFF(1,"Email is required."),e.k0s())}function F(r,i){1&r&&(e.j41(0,"span"),e.EFF(1,"Enter a valid email address."),e.k0s())}function _(r,i){if(1&r&&(e.j41(0,"div",29),e.DNE(1,f,2,0,"span",30)(2,F,2,0,"span",30),e.k0s()),2&r){const n=e.XpG();e.R7$(),e.Y8G("ngIf",null==n.branchForm.controls.email.errors?null:n.branchForm.controls.email.errors.required),e.R7$(),e.Y8G("ngIf",null==n.branchForm.controls.email.errors?null:n.branchForm.controls.email.errors.email)}}function v(r,i){if(1&r&&(e.j41(0,"option",31),e.EFF(1),e.k0s()),2&r){const n=i.$implicit;e.Y8G("value",n),e.R7$(),e.JRh(n)}}function C(r,i){1&r&&(e.j41(0,"div",29),e.EFF(1," Region is required. "),e.k0s())}function E(r,i){if(1&r&&(e.j41(0,"option",31),e.EFF(1),e.k0s()),2&r){const n=i.$implicit;e.Y8G("value",n),e.R7$(),e.JRh(n)}}function k(r,i){1&r&&(e.j41(0,"div",29),e.EFF(1," District is required. "),e.k0s())}function j(r,i){if(1&r&&(e.j41(0,"option",31),e.EFF(1),e.k0s()),2&r){const n=i.$implicit;e.Y8G("value",n),e.R7$(),e.JRh(n)}}function w(r,i){1&r&&(e.j41(0,"div",29),e.EFF(1," Township is required. "),e.k0s())}function N(r,i){1&r&&(e.j41(0,"div",29),e.EFF(1," Street is required. "),e.k0s())}let y=(()=>{class r{constructor(n,a,t){this.fb=n,this.http=a,this.branchService=t,this.regions=[],this.districts=[],this.townships=[],this.locationData={}}ngOnInit(){this.branchForm=this.fb.group({region:["",o.k0.required],district:["",o.k0.required],township:["",o.k0.required],branchName:["",o.k0.required],phoneNumber:["",[o.k0.required,o.k0.pattern(/^\d{10,15}$/)]],email:["",[o.k0.required,o.k0.email]],street:["",o.k0.required]}),this.http.get("assets/myanmar-townships.json").subscribe(n=>{this.locationData=n,this.regions=Object.keys(n)})}onRegionChange(){const n=this.branchForm.value.region;this.districts=n?Object.keys(this.locationData[n]):[],this.townships=[],this.branchForm.patchValue({district:"",township:""})}onDistrictChange(){const n=this.branchForm.value.region,a=this.branchForm.value.district;this.townships=n&&a?this.locationData[n][a]:[],this.branchForm.patchValue({township:""})}isFormFullyFilled(){return this.branchForm.valid&&Object.values(this.branchForm.value).every(n=>"object"==typeof n?n&&Object.values(n).every(a=>""!==a&&null!==a):""!==n&&null!==n)}onSubmit(){if(this.branchForm.valid){const n={branch:{branchName:this.branchForm.value.branchName,phoneNumber:this.branchForm.value.phoneNumber,email:this.branchForm.value.email},address:{region:this.branchForm.value.region.trim(),district:this.branchForm.value.district,township:this.branchForm.value.township,street:this.branchForm.value.street}};console.log("Submitting Data:",n),this.branchService.createBranch(n).subscribe({next:a=>{console.log("Branch Created:",a),alert("Branch Created Successfully"),this.branchForm.reset()},error:a=>{console.error("Error Creating Branch:",a),alert("Failed to create branch")}})}}static{this.\u0275fac=function(a){return new(a||r)(e.rXU(o.ok),e.rXU(d.Qq),e.rXU(h.O))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-branch-create"]],decls:69,vars:14,consts:[[1,"container","mt-6","px-4"],[1,"card","shadow-lg","rounded-lg","overflow-hidden","bg-white"],[1,"card-header","bg-blue-600","text-white","p-4","flex","justify-between","items-center"],[1,"text-lg","font-semibold","mb-0"],[1,"card-body","p-6"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-6",3,"ngSubmit","formGroup"],[1,"relative"],["for","branchName",1,"block","text-sm","font-medium","text-gray-700","mb-1"],[1,"text-red-500"],["type","text","id","branchName","formControlName","branchName","placeholder","Enter branch name",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition"],["class","text-red-500 text-sm mt-1 animate-fade-in",4,"ngIf"],["for","phoneNumber",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["type","tel","id","phoneNumber","formControlName","phoneNumber","placeholder","Enter phone number (10-15 digits)",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition"],["for","email",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["type","email","id","email","formControlName","email","placeholder","Enter email",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition"],["for","region",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["id","region","formControlName","region",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition","appearance-none","bg-white",3,"change"],["value",""],[3,"value",4,"ngFor","ngForOf"],["for","district",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["id","district","formControlName","district",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition","appearance-none","bg-white","disabled:bg-gray-100",3,"change","disabled"],["for","township",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["id","township","formControlName","township",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition","appearance-none","bg-white","disabled:bg-gray-100",3,"disabled"],[1,"relative","md:col-span-2"],["for","street",1,"block","text-sm","font-medium","text-gray-700","mb-1"],["type","text","id","street","formControlName","street","placeholder","Enter street",1,"w-full","p-3","border","border-gray-300","rounded-md","focus:ring-2","focus:ring-blue-500","focus:border-blue-500","transition"],[1,"md:col-span-2","flex","justify-end","mt-4"],["type","submit",1,"px-6","py-2","bg-blue-600","text-white","rounded-lg","hover:bg-blue-700","focus:ring-4","focus:ring-blue-300","transition","flex","items-center","gap-2","disabled:bg-gray-400","disabled:cursor-not-allowed",3,"disabled"],[1,"bi","bi-check-lg"],[1,"text-red-500","text-sm","mt-1","animate-fade-in"],[4,"ngIf"],[3,"value"]],template:function(a,t){1&a&&(e.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"h4",3),e.EFF(4,"Create Branch"),e.k0s()(),e.j41(5,"div",4)(6,"form",5),e.bIt("ngSubmit",function(){return t.onSubmit()}),e.j41(7,"div",6)(8,"label",7),e.EFF(9," Branch Name "),e.j41(10,"span",8),e.EFF(11,"*"),e.k0s()(),e.nrm(12,"input",9),e.DNE(13,u,2,0,"div",10),e.k0s(),e.j41(14,"div",6)(15,"label",11),e.EFF(16," Phone Number "),e.j41(17,"span",8),e.EFF(18,"*"),e.k0s()(),e.nrm(19,"input",12),e.DNE(20,g,3,2,"div",10),e.k0s(),e.j41(21,"div",6)(22,"label",13),e.EFF(23," Email "),e.j41(24,"span",8),e.EFF(25,"*"),e.k0s()(),e.nrm(26,"input",14),e.DNE(27,_,3,2,"div",10),e.k0s(),e.j41(28,"div",6)(29,"label",15),e.EFF(30," Region "),e.j41(31,"span",8),e.EFF(32,"*"),e.k0s()(),e.j41(33,"select",16),e.bIt("change",function(){return t.onRegionChange()}),e.j41(34,"option",17),e.EFF(35,"Select Region"),e.k0s(),e.DNE(36,v,2,2,"option",18),e.k0s(),e.DNE(37,C,2,0,"div",10),e.k0s(),e.j41(38,"div",6)(39,"label",19),e.EFF(40," District "),e.j41(41,"span",8),e.EFF(42,"*"),e.k0s()(),e.j41(43,"select",20),e.bIt("change",function(){return t.onDistrictChange()}),e.j41(44,"option",17),e.EFF(45,"Select District"),e.k0s(),e.DNE(46,E,2,2,"option",18),e.k0s(),e.DNE(47,k,2,0,"div",10),e.k0s(),e.j41(48,"div",6)(49,"label",21),e.EFF(50," Township "),e.j41(51,"span",8),e.EFF(52,"*"),e.k0s()(),e.j41(53,"select",22)(54,"option",17),e.EFF(55,"Select Township"),e.k0s(),e.DNE(56,j,2,2,"option",18),e.k0s(),e.DNE(57,w,2,0,"div",10),e.k0s(),e.j41(58,"div",23)(59,"label",24),e.EFF(60," Street "),e.j41(61,"span",8),e.EFF(62,"*"),e.k0s()(),e.nrm(63,"input",25),e.DNE(64,N,2,0,"div",10),e.k0s(),e.j41(65,"div",26)(66,"button",27),e.nrm(67,"i",28),e.EFF(68," Create Branch "),e.k0s()()()()()()),2&a&&(e.R7$(6),e.Y8G("formGroup",t.branchForm),e.R7$(7),e.Y8G("ngIf",t.branchForm.controls.branchName.touched&&t.branchForm.controls.branchName.invalid),e.R7$(7),e.Y8G("ngIf",t.branchForm.controls.phoneNumber.touched&&t.branchForm.controls.phoneNumber.invalid),e.R7$(7),e.Y8G("ngIf",t.branchForm.controls.email.touched&&t.branchForm.controls.email.invalid),e.R7$(9),e.Y8G("ngForOf",t.regions),e.R7$(),e.Y8G("ngIf",t.branchForm.controls.region.touched&&t.branchForm.controls.region.invalid),e.R7$(6),e.Y8G("disabled",0===t.districts.length),e.R7$(3),e.Y8G("ngForOf",t.districts),e.R7$(),e.Y8G("ngIf",t.branchForm.controls.district.touched&&t.branchForm.controls.district.invalid),e.R7$(6),e.Y8G("disabled",0===t.townships.length),e.R7$(3),e.Y8G("ngForOf",t.townships),e.R7$(),e.Y8G("ngIf",t.branchForm.controls.township.touched&&t.branchForm.controls.township.invalid),e.R7$(7),e.Y8G("ngIf",t.branchForm.controls.street.touched&&t.branchForm.controls.street.invalid),e.R7$(2),e.Y8G("disabled",!t.isFormFullyFilled()))},dependencies:[c.MD,c.Sq,c.bT,o.X1,o.qT,o.xH,o.y7,o.me,o.wz,o.BC,o.cb,o.j4,o.JD,o.YN],styles:['@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0}to{opacity:1}}.animate-fade-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_fadeIn .3s ease-in}select[_ngcontent-%COMP%]{appearance:none;background-image:url(\'data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>\');background-repeat:no-repeat;background-position:right 1rem center;padding-right:2.5rem}input[_ngcontent-%COMP%], select[_ngcontent-%COMP%]{transition:all .2s ease}input[_ngcontent-%COMP%]:focus, select[_ngcontent-%COMP%]:focus{outline:none;box-shadow:0 0 0 2px #2563eb33}select[_ngcontent-%COMP%]:disabled{color:#6b7280;cursor:not-allowed}@media (max-width: 768px){.grid-cols-2[_ngcontent-%COMP%]{grid-template-columns:1fr}}']})}}return r})()}}]);