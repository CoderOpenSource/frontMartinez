import{a as z}from"./chunk-VQFNXLW7.js";import{a as $,b as A,e as B,k as V}from"./chunk-BTD7GRPP.js";import{b as N}from"./chunk-ZBLQCJ4V.js";import{$a as C,Da as l,Ea as S,Ra as f,Rb as k,Sb as T,Ta as x,Ub as L,Va as t,Wa as e,Xa as y,_a as I,ab as P,ba as _,e as j,fb as n,gb as m,hb as M,ib as b,jb as w,ka as v,kb as O,la as E,lb as F,nb as D}from"./chunk-IG4KVHXC.js";var u=j(z());function W(s,d){s&1&&(t(0,"div",9),y(1,"div",10),e())}function H(s,d){if(s&1){let r=I();t(0,"tr")(1,"td"),n(2),e(),t(3,"td"),n(4),e(),t(5,"td"),n(6),e(),t(7,"td")(8,"button",11),C("click",function(){let i=v(r).$implicit,o=P();return E(o.crearConsulta(i))}),n(9," Crear Consulta "),e()()()}if(s&2){let r=d.$implicit;l(2),m(r.fecha),l(2),m(r.hora),l(2),b("",r.pacienteNombre," ",r.pacienteApellido,"")}}function Z(s,d){if(s&1&&(t(0,"tr")(1,"td"),n(2),e(),t(3,"td"),n(4),e(),t(5,"td"),n(6),e(),t(7,"td"),n(8),e(),t(9,"td"),n(10),e(),t(11,"td"),n(12),e(),t(13,"td"),n(14),e()()),s&2){let r=d.$implicit;l(2),m(r.fecha),l(2),m(r.diagnostico),l(2),m(r.tratamiento),l(2),m(r.notas),l(2),b("",r.pacienteNombre," ",r.pacienteApellido,""),l(2),m(r.especialidadNombre),l(2),M(" ",r.derivoProcedimiento===!0?"S\xED":"No"," ")}}var U=(()=>{let d=class d{constructor(a){this.http=a,this.consultas=[],this.citas=[],this.selectedDate=null,this.loading=!1,this.medicoId=parseInt(localStorage.getItem("medicoId")||"0",10)}ngOnInit(){this.loadConsultas(),this.loadCitas()}loadConsultas(){this.loading=!0;let a=`http://143.198.147.110/api/consultas/medico/${this.medicoId}`;this.selectedDate&&(a+=`?fecha=${this.selectedDate}`),this.http.get(a).subscribe(i=>{this.consultas=i,this.loading=!1},i=>{this.loading=!1,u.default.fire({title:"Error al cargar consultas",text:"Por favor, int\xE9ntalo nuevamente.",icon:"error",confirmButtonText:"Aceptar"}),console.error("Error al cargar consultas",i)})}loadCitas(){this.loading=!0;let a=new Date().toLocaleString("es-BO",{timeZone:"America/La_Paz",year:"numeric",month:"2-digit",day:"2-digit"}),[i,o,p]=a.split("/"),c=`${p}-${o}-${i}`;console.log(c),this.http.get("http://143.198.147.110/api/citas").subscribe(g=>{this.citas=g.filter(h=>h.estado==="atendida"&&h.medicoId===this.medicoId&&h.consultaCreada===!1&&h.fecha===c),this.loading=!1},g=>{this.loading=!1,u.default.fire({title:"Error al cargar citas",text:"Por favor, int\xE9ntalo nuevamente.",icon:"error",confirmButtonText:"Aceptar"}),console.error("Error al cargar citas",g)})}crearConsulta(a){u.default.fire({title:`Crear Consulta para ${a.pacienteNombre} ${a.pacienteApellido}`,html:`
        <textarea id="diagnostico" class="swal2-textarea" placeholder="Diagn\xF3stico"></textarea>
        <textarea id="sintomas" class="swal2-textarea" placeholder="S\xEDntomas"></textarea>
        <textarea id="tratamiento" class="swal2-textarea" placeholder="Tratamiento"></textarea>
        <textarea id="notas" class="swal2-textarea" placeholder="Notas"></textarea>
        <label class="swal2-checkbox">
          <input id="derivoProcedimiento" type="checkbox">
          <span>\xBFDeriv\xF3 a procedimiento?</span>
        </label>
      `,preConfirm:()=>{let i=document.getElementById("diagnostico").value,o=document.getElementById("sintomas").value.split(",").map(h=>h.trim()),p=document.getElementById("tratamiento").value,c=document.getElementById("notas").value,g=document.getElementById("derivoProcedimiento").checked;return i?{diagnostico:i,sintomas:o,tratamiento:p,notas:c,derivoProcedimiento:g}:(u.default.showValidationMessage("El diagn\xF3stico es obligatorio"),null)}}).then(i=>{if(i.isConfirmed){this.loading=!0;let o={citaId:a.id,pacienteId:a.pacienteId,pacienteNombre:`${a.pacienteNombre} ${a.pacienteApellido}`,medicoId:this.medicoId,fecha:a.fecha,diagnostico:i.value?.diagnostico,sintomas:i.value?.sintomas,tratamiento:i.value?.tratamiento,notas:i.value?.notas,derivoProcedimiento:i.value?.derivoProcedimiento};this.http.post("http://143.198.147.110/api/consultas",o).subscribe({next:()=>{this.loading=!1,u.default.fire("Consulta creada","La consulta fue creada exitosamente","success"),this.loadConsultas(),this.loadCitas()},error:p=>{this.loading=!1,u.default.fire("Consulta creada","La consulta fue creada exitosamente","success"),this.loadConsultas(),this.loadCitas()},complete:()=>{console.log("Proceso de creaci\xF3n de consulta completado")}})}})}filtrarConsultasPorFecha(){this.loadConsultas()}};d.\u0275fac=function(i){return new(i||d)(S(N))},d.\u0275cmp=_({type:d,selectors:[["app-consulta-list"]],standalone:!0,features:[D],decls:45,vars:4,consts:[[1,"container","mx-auto","px-4","py-8"],[1,"text-2xl","font-bold","mb-4","text-center"],[1,"flex","justify-between","items-center","mb-4"],["type","date",1,"border","rounded","px-3","py-2",3,"ngModelChange","change","ngModel"],[1,"bg-blue-500","text-white","px-4","py-2","rounded",3,"click"],["class","spinner-container",4,"ngIf"],[1,"mb-8"],[1,"text-xl","font-bold","mb-4","text-center"],[4,"ngFor","ngForOf"],[1,"spinner-container"],[1,"spinner"],[1,"bg-green-500","text-white","px-4","py-2","rounded",3,"click"]],template:function(i,o){i&1&&(t(0,"div",0)(1,"h1",1),n(2,"Lista de Consultas"),e(),t(3,"div",2)(4,"input",3),F("ngModelChange",function(c){return O(o.selectedDate,c)||(o.selectedDate=c),c}),C("change",function(){return o.filtrarConsultasPorFecha()}),e(),t(5,"button",4),C("click",function(){return o.filtrarConsultasPorFecha()}),n(6," Filtrar por Fecha "),e()(),f(7,W,2,0,"div",5),t(8,"div",6)(9,"h2",7),n(10,"Citas Disponibles"),e(),t(11,"table")(12,"thead")(13,"tr")(14,"th"),n(15,"Fecha"),e(),t(16,"th"),n(17,"Hora"),e(),t(18,"th"),n(19,"Paciente"),e(),t(20,"th"),n(21,"Acci\xF3n"),e()()(),t(22,"tbody"),f(23,H,10,4,"tr",8),e()()(),t(24,"h2",7),n(25,"Consultas Existentes"),e(),t(26,"table")(27,"thead")(28,"tr")(29,"th"),n(30,"Fecha"),e(),t(31,"th"),n(32,"Diagn\xF3stico"),e(),t(33,"th"),n(34,"Tratamiento"),e(),t(35,"th"),n(36,"Notas"),e(),t(37,"th"),n(38,"Paciente"),e(),t(39,"th"),n(40,"Especialidad"),e(),t(41,"th"),n(42,"Deriv\xF3 a Procedimiento"),e()()(),t(43,"tbody"),f(44,Z,15,8,"tr",8),e()()()),i&2&&(l(4),w("ngModel",o.selectedDate),l(3),x("ngIf",o.loading),l(16),x("ngForOf",o.citas),l(21),x("ngForOf",o.consultas))},dependencies:[L,k,T,V,$,A,B],styles:[".spinner-container[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#000c;display:flex;justify-content:center;align-items:center;z-index:1000}.spinner[_ngcontent-%COMP%]{border:4px solid rgba(255,255,255,.3);border-top:4px solid #ffffff;border-radius:50%;width:50px;height:50px;animation:_ngcontent-%COMP%_spin 1s linear infinite}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;margin-bottom:20px}thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{background-color:#343a40;color:#fff}th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{border:1px solid #dee2e6;padding:12px;text-align:left}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#f8f9fa}button[_ngcontent-%COMP%]{padding:10px 20px;border-radius:8px;font-weight:700;cursor:pointer;transition:background-color .3s ease}button[_ngcontent-%COMP%]:hover{opacity:.9}@media (max-width: 768px){table[_ngcontent-%COMP%]{font-size:14px}button[_ngcontent-%COMP%]{width:100%;margin-top:10px}}"]});let s=d;return s})();export{U as ConsultaListComponent};
