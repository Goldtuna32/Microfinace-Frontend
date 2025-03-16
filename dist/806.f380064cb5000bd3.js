"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[806],{4806:(v,s,r)=>{r.r(s),r.d(s,{LoanDetailComponent:()=>f});var l=r(177),t=r(4438),c=r(8498),d=r(7309);function m(n,i){if(1&n){const e=t.RV6();t.j41(0,"div",13),t.nrm(1,"i",14),t.EFF(2),t.j41(3,"button",15),t.bIt("click",function(){t.eBV(e);const o=t.XpG();return t.Njj(o.errorMessage=null)}),t.k0s()()}if(2&n){const e=t.XpG();t.R7$(2),t.SpI(" ",e.errorMessage," ")}}function p(n,i){if(1&n&&(t.j41(0,"div",35)(1,"p",36)(2,"strong"),t.EFF(3,"Name:"),t.k0s(),t.EFF(4),t.k0s(),t.j41(5,"p",36)(6,"strong"),t.EFF(7,"CIF Code:"),t.k0s(),t.EFF(8),t.k0s(),t.j41(9,"p",36)(10,"strong"),t.EFF(11,"NRC Number:"),t.k0s(),t.EFF(12),t.k0s(),t.j41(13,"p")(14,"strong"),t.EFF(15,"Email:"),t.k0s(),t.EFF(16),t.k0s()()),2&n){const e=t.XpG(2);t.R7$(4),t.SpI(" ",e.loan.cif.name,""),t.R7$(4),t.SpI(" ",e.loan.cif.serialNumber,""),t.R7$(4),t.SpI(" ",e.loan.cif.nrcNumber,""),t.R7$(4),t.SpI(" ",e.loan.cif.email,"")}}function g(n,i){1&n&&(t.j41(0,"p",20),t.EFF(1,"No CIF details available."),t.k0s())}function b(n,i){if(1&n&&(t.j41(0,"li",39)(1,"span"),t.EFF(2),t.k0s(),t.j41(3,"span"),t.EFF(4),t.nI1(5,"currency"),t.k0s()()),2&n){const e=i.$implicit;t.R7$(2),t.Lme("",e.description," (ID: ",e.collateralId,")"),t.R7$(2),t.JRh(t.bMT(5,3,e.collateralAmount))}}function u(n,i){if(1&n&&(t.j41(0,"div",35)(1,"ul",37),t.DNE(2,b,6,5,"li",38),t.k0s()()),2&n){const e=t.XpG(2);t.R7$(2),t.Y8G("ngForOf",e.loan.collaterals)}}function F(n,i){1&n&&(t.j41(0,"p",20),t.EFF(1,"No collaterals available."),t.k0s())}function _(n,i){if(1&n&&(t.j41(0,"div",16)(1,"div",17)(2,"p",18),t.nrm(3,"i",19),t.EFF(4,"Loan Amount:"),t.k0s(),t.j41(5,"p",20),t.EFF(6),t.nI1(7,"currency"),t.k0s()(),t.j41(8,"div",17)(9,"p",18),t.nrm(10,"i",21),t.EFF(11,"Interest Rate:"),t.k0s(),t.j41(12,"p",20),t.EFF(13),t.k0s()(),t.j41(14,"div",17)(15,"p",18),t.nrm(16,"i",22),t.EFF(17,"Grace Period:"),t.k0s(),t.j41(18,"p",20),t.EFF(19),t.k0s()(),t.j41(20,"div",17)(21,"p",18),t.nrm(22,"i",23),t.EFF(23,"Repayment Duration:"),t.k0s(),t.j41(24,"p",20),t.EFF(25),t.k0s()(),t.j41(26,"div",17)(27,"p",18),t.nrm(28,"i",24),t.EFF(29,"Document Fee:"),t.k0s(),t.j41(30,"p",20),t.EFF(31),t.nI1(32,"currency"),t.k0s()(),t.j41(33,"div",17)(34,"p",18),t.nrm(35,"i",25),t.EFF(36,"Service Charges:"),t.k0s(),t.j41(37,"p",20),t.EFF(38),t.nI1(39,"currency"),t.k0s()(),t.j41(40,"div",17)(41,"p",18),t.nrm(42,"i",26),t.EFF(43,"Status:"),t.k0s(),t.j41(44,"p",20),t.EFF(45),t.k0s()(),t.j41(46,"div",17)(47,"p",18),t.nrm(48,"i",27),t.EFF(49,"Current Account ID:"),t.k0s(),t.j41(50,"p",20),t.EFF(51),t.k0s()(),t.j41(52,"div",17)(53,"p",18),t.nrm(54,"i",28),t.EFF(55,"Current Account Number:"),t.k0s(),t.j41(56,"p",20),t.EFF(57),t.k0s()(),t.j41(58,"div",29)(59,"h3",30),t.nrm(60,"i",31),t.EFF(61,"CIF Details"),t.k0s(),t.DNE(62,p,17,4,"div",32)(63,g,2,0,"ng-template",null,0,t.C5r),t.k0s(),t.j41(65,"div",29)(66,"h3",30),t.nrm(67,"i",33),t.EFF(68,"Collaterals"),t.k0s(),t.DNE(69,u,3,1,"div",32)(70,F,2,0,"ng-template",null,1,t.C5r),t.k0s(),t.j41(72,"div",29)(73,"p",18),t.nrm(74,"i",34),t.EFF(75,"Total Collateral Amount:"),t.k0s(),t.j41(76,"p",20),t.EFF(77),t.nI1(78,"currency"),t.k0s()()()),2&n){const e=t.sdS(64),a=t.sdS(71),o=t.XpG();t.R7$(6),t.JRh(t.bMT(7,14,o.loan.loanAmount)),t.R7$(7),t.SpI("",o.loan.interestRate,"%"),t.R7$(6),t.SpI("",o.loan.gracePeriod," days"),t.R7$(6),t.SpI("",o.loan.repaymentDuration," months"),t.R7$(6),t.JRh(t.bMT(32,16,o.loan.documentFee)),t.R7$(7),t.JRh(t.bMT(39,18,o.loan.serviceCharges)),t.R7$(7),t.JRh(3===o.loan.status?"Pending":"Approved"),t.R7$(6),t.JRh(o.loan.currentAccountId),t.R7$(6),t.JRh(o.loan.accountNumber),t.R7$(5),t.Y8G("ngIf",o.loan.cif)("ngIfElse",e),t.R7$(7),t.Y8G("ngIf",o.loan.collaterals&&o.loan.collaterals.length>0)("ngIfElse",a),t.R7$(8),t.JRh(t.bMT(78,20,o.loan.totalCollateralAmount))}}let f=(()=>{class n{constructor(e,a,o){this.route=e,this.router=a,this.loanService=o,this.loan=null,this.errorMessage=null}ngOnInit(){const e=Number(this.route.snapshot.paramMap.get("id"));e?this.loadLoanDetails(e):this.errorMessage="Invalid loan ID"}loadLoanDetails(e){this.loanService.getLoanById(e).subscribe({next:a=>{this.loan=a},error:a=>this.errorMessage="Failed to load loan details: "+a.message})}goBack(){this.router.navigate(["/loan/list"])}static{this.\u0275fac=function(a){return new(a||n)(t.rXU(c.nX),t.rXU(c.Ix),t.rXU(d.a))}}static{this.\u0275cmp=t.VBU({type:n,selectors:[["app-loan-detail"]],decls:13,vars:3,consts:[["noCif",""],["noCollaterals",""],[1,"container","mx-auto","p-6"],[1,"card","shadow-lg"],[1,"card-header","bg-primary","text-white","d-flex","align-items-center"],[1,"bi","bi-info-circle","me-2"],[1,"text-xl","font-bold","mb-0"],[1,"card-body"],["class","alert alert-danger alert-dismissible fade show mb-4","role","alert",4,"ngIf"],["class","row g-4",4,"ngIf"],[1,"card-footer","d-flex","justify-content-end"],[1,"btn","btn-outline-secondary",3,"click"],[1,"bi","bi-arrow-left","me-2"],["role","alert",1,"alert","alert-danger","alert-dismissible","fade","show","mb-4"],[1,"bi","bi-exclamation-triangle","me-2"],["type","button","aria-label","Close",1,"btn-close",3,"click"],[1,"row","g-4"],[1,"col-md-6"],[1,"fw-bold","mb-1"],[1,"bi","bi-currency-dollar","me-2"],[1,"text-muted"],[1,"bi","bi-percent","me-2"],[1,"bi","bi-clock","me-2"],[1,"bi","bi-calendar-month","me-2"],[1,"bi","bi-file-earmark-text","me-2"],[1,"bi","bi-gear","me-2"],[1,"bi","bi-check-circle","me-2"],[1,"bi","bi-bank","me-2"],[1,"bi","bi-card-text","me-2"],[1,"col-12","mt-4"],[1,"text-lg","font-semibold","mb-2"],[1,"bi","bi-person","me-2"],["class","card p-4 bg-light",4,"ngIf","ngIfElse"],[1,"bi","bi-shield","me-2"],[1,"bi","bi-wallet","me-2"],[1,"card","p-4","bg-light"],[1,"mb-2"],[1,"list-group","list-group-flush"],["class","list-group-item d-flex justify-content-between align-items-center",4,"ngFor","ngForOf"],[1,"list-group-item","d-flex","justify-content-between","align-items-center"]],template:function(a,o){1&a&&(t.j41(0,"div",2)(1,"div",3)(2,"div",4),t.nrm(3,"i",5),t.j41(4,"h2",6),t.EFF(5),t.k0s()(),t.j41(6,"div",7),t.DNE(7,m,4,1,"div",8)(8,_,79,22,"div",9),t.k0s(),t.j41(9,"div",10)(10,"button",11),t.bIt("click",function(){return o.goBack()}),t.nrm(11,"i",12),t.EFF(12,"Back to List "),t.k0s()()()()),2&a&&(t.R7$(5),t.SpI("Loan Details - ID: ",null==o.loan?null:o.loan.id,""),t.R7$(2),t.Y8G("ngIf",o.errorMessage),t.R7$(),t.Y8G("ngIf",o.loan))},dependencies:[l.MD,l.Sq,l.bT,l.oe],styles:[".container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto;max-width:56rem;padding:1.5rem}.card[_ngcontent-%COMP%]{overflow:hidden;border-radius:.5rem;--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.card-header[_ngcontent-%COMP%]{display:flex;align-items:center;--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1));padding:1rem;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.card-body[_ngcontent-%COMP%]{padding:1.5rem}.card-footer[_ngcontent-%COMP%]{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1));padding:1rem}.alert[_ngcontent-%COMP%]{margin-bottom:1rem}.text-muted[_ngcontent-%COMP%]{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.fw-bold[_ngcontent-%COMP%]{font-weight:600}.list-group-item[_ngcontent-%COMP%]{border-width:0px;padding-top:.5rem;padding-bottom:.5rem}"]})}}return n})()}}]);