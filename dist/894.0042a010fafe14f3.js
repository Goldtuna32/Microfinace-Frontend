"use strict";(self.webpackChunkskeleton=self.webpackChunkskeleton||[]).push([[894],{5894:(m,d,o)=>{o.r(d),o.d(d,{CreateProductTypeComponent:()=>i});var t=o(9417),e=o(4438),u=o(5173),s=o(8498);let i=(()=>{class a{constructor(r,n){this.productTypeService=r,this.router=n,this.productType={name:"",status:1}}saveProductType(){this.productTypeService.createProductType(this.productType).subscribe({next:r=>{console.log("Product type created:",r),this.router.navigate(["/product-types"])},error:r=>{console.error("Error creating product type:",r),alert("Failed to create product type")}})}static{this.\u0275fac=function(n){return new(n||a)(e.rXU(u.p),e.rXU(s.Ix))}}static{this.\u0275cmp=e.VBU({type:a,selectors:[["app-create-product-type"]],decls:14,vars:1,consts:[[1,"container","mt-5"],[1,"row","justify-content-center"],[1,"col-md-6"],[1,"card","shadow-lg","p-4"],[1,"text-center","text-2xl","font-bold","mb-4"],[3,"ngSubmit"],[1,"mb-3"],["for","name",1,"form-label","font-semibold"],["type","text","id","name","name","name","required","",1,"form-control","py-2","px-3","border","rounded",3,"ngModelChange","ngModel"],[1,"text-center"],["type","submit",1,"btn","btn-primary","px-4","py-2","rounded"]],template:function(n,c){1&n&&(e.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h2",4),e.EFF(5,"Create Product Type"),e.k0s(),e.j41(6,"form",5),e.bIt("ngSubmit",function(){return c.saveProductType()}),e.j41(7,"div",6)(8,"label",7),e.EFF(9,"Name:"),e.k0s(),e.j41(10,"input",8),e.mxI("ngModelChange",function(p){return e.DH7(c.productType.name,p)||(c.productType.name=p),p}),e.k0s()(),e.j41(11,"div",9)(12,"button",10),e.EFF(13,"Create"),e.k0s()()()()()()()),2&n&&(e.R7$(10),e.R50("ngModel",c.productType.name))},dependencies:[t.X1,t.qT,t.me,t.BC,t.cb,t.YS,t.YN,t.vS,t.cV],encapsulation:2})}}return a})()}}]);