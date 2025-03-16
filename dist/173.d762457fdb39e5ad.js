"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[173],{6543:(O,M,c)=>{c.d(M,{O:()=>F});var t=c(9417),E=c(5351),o=c(4438),g=c(2071);let F=(()=>{class d{constructor(h,_,C,p){this.fb=h,this.accountService=_,this.dialogRef=C,this.data=p,this.isEditMode=!1,this.isEditMode=!!p.id,this.accountForm=this.fb.group({id:[p.id||null],cifId:[{value:p.cifId,disabled:!0},t.k0.required],accountNumber:[p.accountNumber||""],balance:[p.balance||0,[t.k0.required,t.k0.min(0)]],maximumBalance:[p.maximumBalance||0,[t.k0.required,t.k0.min(0)]],minimumBalance:[p.minimumBalance||0,[t.k0.required,t.k0.min(0)]],status:[p.status||1]})}ngOnInit(){}saveAccount(){if(this.accountForm.invalid)return void alert("Please fill in all required fields!");const h=this.accountForm.getRawValue();console.log("Form Data:",h),this.isEditMode?this.accountService.updateCurrentAccount(h).subscribe({next:_=>{alert("Current Account Updated Successfully!"),this.dialogRef.close(_)},error:_=>{console.error("Error Updating Account:",_),alert("Failed to update Current Account")}}):this.accountService.createCurrentAccount(h).subscribe({next:_=>{alert("Current Account Created Successfully!"),this.dialogRef.close(_)},error:_=>{console.error("Error Creating Account:",_),alert("Failed to create Current Account")}})}closeDialog(){this.dialogRef.close()}static{this.\u0275fac=function(_){return new(_||d)(o.rXU(t.ok),o.rXU(g.A),o.rXU(E.CP),o.rXU(E.Vh))}}static{this.\u0275cmp=o.VBU({type:d,selectors:[["app-current-account"]],decls:24,vars:1,consts:[[3,"ngSubmit","formGroup"],[1,"mb-3"],[1,"form-label"],["type","text","formControlName","cifId",1,"form-control"],["type","number","formControlName","balance","step","0.01",1,"form-control"],["type","number","formControlName","maximumBalance","step","0.01",1,"form-control"],["type","number","formControlName","minimumBalance","step","0.01",1,"form-control"],[1,"d-flex","justify-content-end"],["type","button",1,"btn","btn-secondary","me-2",3,"click"],["type","submit",1,"btn","btn-success"]],template:function(_,C){1&_&&(o.j41(0,"h2"),o.EFF(1,"Create Current Account"),o.k0s(),o.j41(2,"form",0),o.bIt("ngSubmit",function(){return C.saveAccount()}),o.j41(3,"div",1)(4,"label",2),o.EFF(5,"CIF ID"),o.k0s(),o.nrm(6,"input",3),o.k0s(),o.j41(7,"div",1)(8,"label",2),o.EFF(9,"Balance"),o.k0s(),o.nrm(10,"input",4),o.k0s(),o.j41(11,"div",1)(12,"label",2),o.EFF(13,"Maximum Balance"),o.k0s(),o.nrm(14,"input",5),o.k0s(),o.j41(15,"div",1)(16,"label",2),o.EFF(17,"Minimum Balance"),o.k0s(),o.nrm(18,"input",6),o.k0s(),o.j41(19,"div",7)(20,"button",8),o.bIt("click",function(){return C.closeDialog()}),o.EFF(21,"Cancel"),o.k0s(),o.j41(22,"button",9),o.EFF(23,"Create Account"),o.k0s()()()),2&_&&(o.R7$(2),o.Y8G("formGroup",C.accountForm))},dependencies:[t.X1,t.qT,t.me,t.Q0,t.BC,t.cb,t.j4,t.JD],encapsulation:2})}}return d})()},2071:(O,M,c)=>{c.d(M,{A:()=>o});var t=c(4438),E=c(1626);let o=(()=>{class g{constructor(d){this.http=d,this.baseUrl="http://localhost:8080/api/current-accounts"}getAllCurrentAccounts(){return this.http.get(`${this.baseUrl}`)}getCurrentAccountById(d){return this.http.get(`${this.baseUrl}/${d}`)}createCurrentAccount(d){return this.http.post(`${this.baseUrl}`,d)}deleteCurrentAccount(d){return this.http.delete(`${this.baseUrl}/${d}`)}hasCurrentAccount(d){return this.http.get(`${this.baseUrl}/exists/${d}`)}updateCurrentAccount(d){return this.http.put(`${this.baseUrl}/${d.id}`,d)}static{this.\u0275fac=function(A){return new(A||g)(t.KVO(E.Qq))}}static{this.\u0275prov=t.jDH({token:g,factory:g.\u0275fac,providedIn:"root"})}}return g})()},9213:(O,M,c)=>{c.d(M,{m_:()=>j});var t=c(4438),E=c(3);c(177),c(7673),c(8810),c(7468),c(8141),c(6354),c(9437),c(980),c(7647),c(1626),c(345);let j=(()=>{class s{static \u0275fac=function(r){return new(r||s)};static \u0275mod=t.$C({type:s});static \u0275inj=t.G2t({imports:[E.yE,E.yE]})}return s})()},9183:(O,M,c)=>{c.d(M,{D6:()=>b,LG:()=>C,Mg:()=>p});var t=c(4438),E=c(177),o=c(3);const g=["determinateSpinner"];function F(f,k){if(1&f&&(t.qSk(),t.j41(0,"svg",11),t.nrm(1,"circle",12),t.k0s()),2&f){const l=t.XpG();t.BMQ("viewBox",l._viewBox()),t.R7$(),t.xc7("stroke-dasharray",l._strokeCircumference(),"px")("stroke-dashoffset",l._strokeCircumference()/2,"px")("stroke-width",l._circleStrokeWidth(),"%"),t.BMQ("r",l._circleRadius())}}const d=new t.nKC("mat-progress-spinner-default-options",{providedIn:"root",factory:function A(){return{diameter:h}}}),h=100;let C=(()=>{class f{_elementRef=(0,t.WQX)(t.aKT);_noopAnimations;get color(){return this._color||this._defaultColor}set color(l){this._color=l}_color;_defaultColor="primary";_determinateCircle;constructor(){const l=(0,t.WQX)(t.bc$,{optional:!0}),u=(0,t.WQX)(d);this._noopAnimations="NoopAnimations"===l&&!!u&&!u._forceAnimations,this.mode="mat-spinner"===this._elementRef.nativeElement.nodeName.toLowerCase()?"indeterminate":"determinate",u&&(u.color&&(this.color=this._defaultColor=u.color),u.diameter&&(this.diameter=u.diameter),u.strokeWidth&&(this.strokeWidth=u.strokeWidth))}mode;get value(){return"determinate"===this.mode?this._value:0}set value(l){this._value=Math.max(0,Math.min(100,l||0))}_value=0;get diameter(){return this._diameter}set diameter(l){this._diameter=l||0}_diameter=h;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(l){this._strokeWidth=l||0}_strokeWidth;_circleRadius(){return(this.diameter-10)/2}_viewBox(){const l=2*this._circleRadius()+this.strokeWidth;return`0 0 ${l} ${l}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return"determinate"===this.mode?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(u){return new(u||f)};static \u0275cmp=t.VBU({type:f,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(u,m){if(1&u&&t.GBs(g,5),2&u){let S;t.mGM(S=t.lsd())&&(m._determinateCircle=S.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(u,m){2&u&&(t.BMQ("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow","determinate"===m.mode?m.value:null)("mode",m.mode),t.HbH("mat-"+m.color),t.xc7("width",m.diameter,"px")("height",m.diameter,"px")("--mdc-circular-progress-size",m.diameter+"px")("--mdc-circular-progress-active-indicator-width",m.diameter+"px"),t.AVh("_mat-animation-noopable",m._noopAnimations)("mdc-circular-progress--indeterminate","indeterminate"===m.mode))},inputs:{color:"color",mode:"mode",value:[2,"value","value",t.Udg],diameter:[2,"diameter","diameter",t.Udg],strokeWidth:[2,"strokeWidth","strokeWidth",t.Udg]},exportAs:["matProgressSpinner"],features:[t.GFd],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(u,m){if(1&u&&(t.DNE(0,F,2,8,"ng-template",null,0,t.C5r),t.j41(2,"div",2,1),t.qSk(),t.j41(4,"svg",3),t.nrm(5,"circle",4),t.k0s()(),t.joV(),t.j41(6,"div",5)(7,"div",6)(8,"div",7),t.eu8(9,8),t.k0s(),t.j41(10,"div",9),t.eu8(11,8),t.k0s(),t.j41(12,"div",10),t.eu8(13,8),t.k0s()()()),2&u){const S=t.sdS(1);t.R7$(4),t.BMQ("viewBox",m._viewBox()),t.R7$(),t.xc7("stroke-dasharray",m._strokeCircumference(),"px")("stroke-dashoffset",m._strokeDashOffset(),"px")("stroke-width",m._circleStrokeWidth(),"%"),t.BMQ("r",m._circleRadius()),t.R7$(4),t.Y8G("ngTemplateOutlet",S),t.R7$(2),t.Y8G("ngTemplateOutlet",S),t.R7$(2),t.Y8G("ngTemplateOutlet",S)}},dependencies:[E.T3],styles:[".mat-mdc-progress-spinner{display:block;overflow:hidden;line-height:0;position:relative;direction:ltr;transition:opacity 250ms cubic-bezier(0.4, 0, 0.6, 1)}.mat-mdc-progress-spinner circle{stroke-width:var(--mdc-circular-progress-active-indicator-width, 4px)}.mat-mdc-progress-spinner._mat-animation-noopable,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle{transition:none !important}.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container{animation:none !important}.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle{stroke-dasharray:0 !important}@media(forced-colors: active){.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle{stroke:currentColor;stroke:CanvasText}}.mdc-circular-progress__determinate-container,.mdc-circular-progress__indeterminate-circle-graphic,.mdc-circular-progress__indeterminate-container,.mdc-circular-progress__spinner-layer{position:absolute;width:100%;height:100%}.mdc-circular-progress__determinate-container{transform:rotate(-90deg)}.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container{opacity:0}.mdc-circular-progress__indeterminate-container{font-size:0;letter-spacing:0;white-space:nowrap;opacity:0}.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container{opacity:1;animation:mdc-circular-progress-container-rotate 1568.2352941176ms linear infinite}.mdc-circular-progress__determinate-circle-graphic,.mdc-circular-progress__indeterminate-circle-graphic{fill:rgba(0,0,0,0)}.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic{stroke:var(--mdc-circular-progress-active-indicator-color, var(--mat-sys-primary))}@media(forced-colors: active){.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic{stroke:CanvasText}}.mdc-circular-progress__determinate-circle{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1)}.mdc-circular-progress__gap-patch{position:absolute;top:0;left:47.5%;box-sizing:border-box;width:5%;height:100%;overflow:hidden}.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic{left:-900%;width:2000%;transform:rotate(180deg)}.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic{width:200%}.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{left:-100%}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress__circle-clipper{display:inline-flex;position:relative;width:50%;height:100%;overflow:hidden}.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}@keyframes mdc-circular-progress-container-rotate{to{transform:rotate(360deg)}}@keyframes mdc-circular-progress-spinner-layer-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes mdc-circular-progress-left-spin{from{transform:rotate(265deg)}50%{transform:rotate(130deg)}to{transform:rotate(265deg)}}@keyframes mdc-circular-progress-right-spin{from{transform:rotate(-265deg)}50%{transform:rotate(-130deg)}to{transform:rotate(-265deg)}}"],encapsulation:2,changeDetection:0})}return f})();const p=C;let b=(()=>{class f{static \u0275fac=function(u){return new(u||f)};static \u0275mod=t.$C({type:f});static \u0275inj=t.G2t({imports:[o.yE]})}return f})()}}]);