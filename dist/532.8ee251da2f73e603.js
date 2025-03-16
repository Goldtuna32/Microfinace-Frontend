"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[532],{6532:(w,u,i)=>{i.r(u),i.d(u,{RepaymentScheduleComponent:()=>v});var p=i(177),d=i(8834),c=i(5596),l=i(9159),e=i(4438),h=i(8498),f=i(1626);let y=(()=>{class t{constructor(n){this.http=n,this.apiUrl="http://localhost:8080/api"}getRepaymentSchedule(n){return this.http.get(`${this.apiUrl}/repayment-schedule/${n}`)}exportReport(n,o){return this.http.get(`${this.apiUrl}/reports/repayment-schedule/${n}?format=${o}`,{responseType:"blob"})}static{this.\u0275fac=function(o){return new(o||t)(e.KVO(f.Qq))}}static{this.\u0275prov=e.jDH({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();function R(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Installment #"),e.k0s())}function b(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(n.installmentNumber)}}function F(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Due Date"),e.k0s())}function S(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.nI1(2,"date"),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(e.bMT(2,1,n.dueDate))}}function C(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Principal"),e.k0s())}function k(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.nI1(2,"currency"),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(e.bMT(2,1,n.principalAmount))}}function x(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Interest"),e.k0s())}function D(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.nI1(2,"currency"),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(e.bMT(2,1,n.interestAmount))}}function E(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Total Payment"),e.k0s())}function T(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.nI1(2,"currency"),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(e.bMT(2,1,n.totalPayment))}}function _(t,a){1&t&&(e.j41(0,"th",20),e.EFF(1,"Remaining Balance"),e.k0s())}function $(t,a){if(1&t&&(e.j41(0,"td",21),e.EFF(1),e.nI1(2,"currency"),e.k0s()),2&t){const n=a.$implicit;e.R7$(),e.JRh(e.bMT(2,1,n.remainingPrincipal))}}function j(t,a){1&t&&e.nrm(0,"tr",22)}function g(t,a){1&t&&e.nrm(0,"tr",23)}function I(t,a){1&t&&(e.j41(0,"tr",24)(1,"td",25),e.EFF(2,"No repayment schedule found."),e.k0s()())}let v=(()=>{class t{constructor(n,o,m){this.route=n,this.repaymentScheduleService=o,this.router=m,this.repaymentSchedule=new l.I6,this.displayedColumns=["installmentNumber","dueDate","principalAmount","interestAmount","totalPayment","remainingPrincipal"],this.loanId=+this.route.snapshot.paramMap.get("loanId")}ngOnInit(){this.loadRepaymentSchedule()}loadRepaymentSchedule(){this.repaymentScheduleService.getRepaymentSchedule(this.loanId).subscribe({next:n=>{this.repaymentSchedule.data=n.map((o,m)=>({...o,installmentNumber:m+1,totalPayment:o.principalAmount+o.interestAmount}))},error:n=>console.error("Failed to load repayment schedule:",n)})}exportReport(n){this.repaymentScheduleService.exportReport(this.loanId,n).subscribe({next:o=>{const m=new Blob([o],{type:"pdf"===n?"application/pdf":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),r="repayment_schedule."+("pdf"===n?"pdf":"xlsx"),s=document.createElement("a");s.href=window.URL.createObjectURL(m),s.download=r,s.click()},error:o=>console.error(`Failed to export ${n}:`,o)})}goBack(){this.router.navigate(["/loan/list"])}static{this.\u0275fac=function(o){return new(o||t)(e.rXU(h.nX),e.rXU(y),e.rXU(h.Ix))}}static{this.\u0275cmp=e.VBU({type:t,selectors:[["app-repayment-schedule"]],decls:39,vars:4,consts:[[1,"container","mx-auto","p-4"],[1,"shadow-lg"],[1,"flex","justify-between","mb-4","space-x-2"],["mat-raised-button","","color","primary",3,"click"],[1,"bi","bi-arrow-left","mr-2"],["mat-raised-button","","color","primary",1,"mr-2",3,"click"],[1,"bi","bi-file-earmark-pdf","mr-2"],[1,"bi","bi-file-earmark-excel","mr-2"],["mat-table","",1,"w-full","bg-white","shadow-md","rounded-lg",3,"dataSource"],["matColumnDef","installmentNumber"],["mat-header-cell","","class","bg-gray-800 text-blue-600 p-2",4,"matHeaderCellDef"],["mat-cell","","class","p-2",4,"matCellDef"],["matColumnDef","dueDate"],["matColumnDef","principalAmount"],["matColumnDef","interestAmount"],["matColumnDef","totalPayment"],["matColumnDef","remainingPrincipal"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["mat-header-cell","",1,"bg-gray-800","text-blue-600","p-2"],["mat-cell","",1,"p-2"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],["colspan","6",1,"mat-cell","text-center","p-4"]],template:function(o,m){1&o&&(e.j41(0,"div",0)(1,"mat-card",1)(2,"mat-card-header")(3,"mat-card-title"),e.EFF(4),e.k0s()(),e.j41(5,"mat-card-content")(6,"div",2)(7,"button",3),e.bIt("click",function(){return m.goBack()}),e.nrm(8,"i",4),e.EFF(9,"Back to Loan List "),e.k0s(),e.j41(10,"div")(11,"button",5),e.bIt("click",function(){return m.exportReport("pdf")}),e.nrm(12,"i",6),e.EFF(13,"Export to PDF "),e.k0s(),e.j41(14,"button",3),e.bIt("click",function(){return m.exportReport("excel")}),e.nrm(15,"i",7),e.EFF(16,"Export to Excel "),e.k0s()()(),e.j41(17,"table",8),e.qex(18,9),e.DNE(19,R,2,0,"th",10)(20,b,2,1,"td",11),e.bVm(),e.qex(21,12),e.DNE(22,F,2,0,"th",10)(23,S,3,3,"td",11),e.bVm(),e.qex(24,13),e.DNE(25,C,2,0,"th",10)(26,k,3,3,"td",11),e.bVm(),e.qex(27,14),e.DNE(28,x,2,0,"th",10)(29,D,3,3,"td",11),e.bVm(),e.qex(30,15),e.DNE(31,E,2,0,"th",10)(32,T,3,3,"td",11),e.bVm(),e.qex(33,16),e.DNE(34,_,2,0,"th",10)(35,$,3,3,"td",11),e.bVm(),e.DNE(36,j,1,0,"tr",17)(37,g,1,0,"tr",18)(38,I,3,0,"tr",19),e.k0s()()()()),2&o&&(e.R7$(4),e.SpI("Repayment Schedule for Loan #",m.loanId,""),e.R7$(13),e.Y8G("dataSource",m.repaymentSchedule),e.R7$(19),e.Y8G("matHeaderRowDef",m.displayedColumns),e.R7$(),e.Y8G("matRowDefColumns",m.displayedColumns))},dependencies:[p.MD,p.oe,p.vh,c.Hu,c.RN,c.m2,c.MM,c.dh,l.tP,l.Zl,l.tL,l.ji,l.cC,l.YV,l.iL,l.KS,l.$R,l.YZ,l.NB,l.ky,d.Hl,d.$z],encapsulation:2})}}return t})()}}]);