'use strict';
const $=id=>document.getElementById(id), F=CosmoForms, STORAGE='cosmo.workspace.v2';
let pkg=null, runs=[], panel='overview', busy=false, rawDirty=false, lastResult=null, lastResultInputHash=null, builderDirty=false, attentionOrderIds=new Set(), orderPage=1, selectedOrderIds=new Set(), dirtySections=new Set(), calculationAcknowledged=false, lastCalculatedSections=[], annualSupplyDraft={}, matrixDirty=false, historyScenario=null, historySelectedKeys=new Set(), messageTimer=null, saveStatusTimer=null;
const clone=x=>JSON.parse(JSON.stringify(x));
const labels={FEASIBLE:'План покрывает выбранные условия',INFEASIBLE:'Текущий план не покрывает выбранные условия',TARGETS_MISSED:'Сервис ниже целевого уровня',INVALID_PLAN:'Расчёт ограничен входными данными',STOPPED_OVERFLOW:'Достигнута вместимость склада'};
const scenarioLabels={BASE:'Базовый тест',MANDATORY_STRESS:'Стресс-тест',LOW:'Низкий спрос',HIGH:'Высокий спрос'};
const profileLabels={BASE:'обычного спроса',LOW:'низкого спроса',HIGH:'высокого спроса'};
const legacyPlanLabels={'Земля + Emergency':'Только Земля','Земля + новый поставщик':'Земля + новый поставщик C','Земля + лунный источник':'Земля + лунное производство D','Новый поставщик + лунный источник':'Земля + C + лунное производство D'};
const sectionLabels={overview:'настройки автопостроения',conditions:'условия проверки',demand:'спрос',sources:'поставщики',contracts:'контракты',orders:'поставки',investments:'инвестиции',annual_supply:'годовой план поставок',json:'JSON-пакет'};
const planLabel=(plan=pkg?.plan,adapted=!!pkg?.reference_plan)=>{const base=legacyPlanLabels[plan?.label]||plan?.label||plan?.plan_id||'План снабжения';return adapted?`${base} + реакция B/E`:base;};
const fmt=(x,digits=2)=>x===null||x===undefined?'Нет данных':Number.isFinite(Number(x))?Number(x).toLocaleString('ru-RU',{maximumFractionDigits:digits}):String(x);
const inputNumber=x=>{const n=Number(x);return Number.isFinite(n)?String(Math.round((n+Number.EPSILON)*10000)/10000):(x??'');};
const pct=x=>x===null||x===undefined?'Нет данных':fmt(Number(x)*100,3)+'%';
const fmtTime=value=>{if(!value)return 'Нет данных';const date=new Date(value);return Number.isNaN(date.getTime())?String(value):date.toLocaleString('ru-RU',{dateStyle:'short',timeStyle:'medium'});};
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function dismissMessage(){clearTimeout(messageTimer);messageTimer=null;const node=$('message');node.hidden=true;node.textContent='';}
function message(text,kind='',timeout){
  dismissMessage();const node=$('message');node.textContent=text;node.className=`notice toast ${kind}`;node.hidden=false;
  const delay=timeout??(kind==='error'?10000:kind==='warning'?7000:4500);if(delay>0)messageTimer=setTimeout(dismissMessage,delay);
}
function currentResultInputHash(){return pkg?F.resultInputHash(pkg,$('scenario').value):null;}
function resultState(){
  if(!lastResult)return 'EMPTY';
  const pending=rawDirty||builderDirty||matrixDirty||dirtySections.size>0||!!document.querySelector('[aria-invalid="true"]');
  return pending||lastResultInputHash!==currentResultInputHash()?'STALE':'CURRENT';
}
function setResultExportsEnabled(enabled){
  $('downloads').querySelectorAll('a').forEach(a=>{
    if(enabled&&a.dataset.resultHref){a.href=a.dataset.resultHref;delete a.dataset.resultHref;}
    if(!enabled&&a.hasAttribute('href')){a.dataset.resultHref=a.getAttribute('href');a.removeAttribute('href');}
    a.toggleAttribute('aria-disabled',!enabled);a.tabIndex=enabled?0:-1;
  });
}
function refreshResultFreshness(){
  if(!lastResult)return;
  const state=resultState(),stale=state==='STALE',s=lastResult.summary,result=$('result'),summary=$('result-explanation'),summaryHeading=summary.querySelector('h3');
  result.dataset.state=state;result.dataset.resultHash=lastResultInputHash;result.dataset.inputHash=currentResultInputHash();
  result.classList.toggle('result-stale',stale);result.setAttribute('aria-label',stale?'Результат устарел':'Актуальный результат расчёта');$('stale').hidden=!stale;
  if(stale){$('result-title').textContent='Результат устарел';$('result-badge').textContent='Результат устарел';$('result-badge').className='badge warning';if(summaryHeading)summaryHeading.textContent='Предыдущий результат';summary.className='result-summary stale';}
  else{const [badge,badgeClass]=badgeStates[s.status]||['Проверьте результат','warning'];$('result-title').textContent=labels[s.status]||'Результат расчёта';$('result-badge').textContent=badge;$('result-badge').className=`badge ${badgeClass}`;if(summaryHeading)summaryHeading.textContent=s.status==='STOPPED_OVERFLOW'?overflowSummaryTitle(lastResult):(resultStates[s.status]||['Проверьте результат'])[0];summary.className=`result-summary ${s.status==='FEASIBLE'?'success':s.status==='INVALID_PLAN'||s.status==='STOPPED_OVERFLOW'?'danger':'warning'}`;}
  setResultExportsEnabled(!stale);
}
function saveDraft(){
  clearTimeout(saveStatusTimer);
  try{localStorage.setItem(STORAGE,JSON.stringify({version:3,package:pkg,runs,scenario:$('scenario').value,dirty_sections:[...dirtySections],calculation_acknowledged:calculationAcknowledged,last_calculated_sections:lastCalculatedSections,annual_supply_draft:annualSupplyDraft,matrix_dirty:matrixDirty,builder_dirty:builderDirty,builder_state:{strategy:$('strategy').value,reserve:$('reserve').value,profile:$('profile').value,zbo:$('zbo').checked,e_insurance:$('e-insurance').checked}}));$('save-status').textContent='Черновик сохранён';saveStatusTimer=setTimeout(()=>$('save-status').textContent='',2500);}
  catch(e){$('save-status').textContent='Не удалось сохранить черновик. Скачайте файл.';}
}
function updateCalculationStatus(){
  const bar=$('calculation-status');if(!pkg){bar.hidden=true;return;}
  const changed=[...dirtySections].map(key=>sectionLabels[key]||key);
  if(rawDirty&&!changed.includes(sectionLabels.json))changed.push(sectionLabels.json);
  if(matrixDirty&&!changed.includes(sectionLabels.annual_supply))changed.push(sectionLabels.annual_supply);
  if(changed.length||builderDirty){bar.hidden=false;bar.className='calculation-status';bar.replaceChildren();const text=el('span',`Есть изменения, которые ещё не рассчитаны${changed.length?`: ${changed.join(', ')}`:''}.`),actions=el('span',undefined,'status-actions'),recalc=el('button','Пересчитать текущий план','primary compact recalculate');recalc.onclick=()=>startCalculation('evaluate');if(matrixDirty)recalc.title='Сначала примените годовой план поставок';else if(builderDirty)recalc.title='Сначала постройте график по изменённому шаблону';actions.append(recalc);if(builderDirty||[...dirtySections].some(key=>['demand','sources','investments'].includes(key))){const rebuild=el('button','Перестроить график','secondary compact rebuild');rebuild.onclick=()=>$('build').click();actions.append(rebuild);}bar.append(text,actions);return;}
  bar.hidden=true;bar.replaceChildren();
}
function changed(research=false,section=panel){if(research)F.research(pkg);if(section){dirtySections.add(section);calculationAcknowledged=false;}updateIdentity();saveDraft();if(!rawDirty)$('json').value=JSON.stringify(pkg,null,2);refreshResultFreshness();updateCalculationStatus();controls();}
function joinRussian(items){return items.length<2?items.join(''):`${items.slice(0,-1).join(', ')} и ${items.at(-1)}`;}
function markCalculated(sections=[]){lastCalculatedSections=[...sections];dirtySections.clear();builderDirty=false;matrixDirty=false;calculationAcknowledged=true;updateCalculationStatus();}
function updateIdentity(){
  $('plan-name').textContent=planLabel();
  $('scope').textContent=pkg.dataset.scope==='RESEARCH_INPUT'?'Исследовательская копия':'Исходные данные кейса';
  $('scope').className=pkg.dataset.scope==='RESEARCH_INPUT'?'badge research-badge':'badge';
  $('horizon').textContent=pkg.plan.first_year+'-'+pkg.plan.last_year;
  $('back-base').hidden=!pkg.reference_plan;
  $('reset').hidden=!!pkg.reference_plan;
}
function switchPanel(name){
  closeHelp();panel=name;document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!=='panel-'+name);
  document.querySelectorAll('[data-panel]').forEach(b=>{if(b.dataset.panel===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if($('mobile-section-nav'))$('mobile-section-nav').value=name;
  $('workspace').scrollIntoView({block:'start',behavior:'auto'});
}
function controls(){
  document.querySelectorAll('main button, main input, main select, main textarea').forEach(e=>e.disabled=busy||e.dataset.readonly==='true');
  if(!busy&&pkg?.reference_plan){
    for(const id of ['demand-form','sources-form','contracts-form','orders-form','investments-form','policy-form'])$(id).querySelectorAll('input,select,button').forEach(e=>e.disabled=true);
    for(const id of ['build','strategy','reserve','profile','zbo','e-insurance','add-source','add-contract','add-order','research','apply','json','apply-supply-matrix'])$(id).disabled=true;
    $('supply-matrix').querySelectorAll('input,select,button').forEach(e=>e.disabled=true);
  }
  const stale=resultState()!=='CURRENT';
  $('adapt').disabled=busy||stale||!!pkg?.reference_plan||!['MANDATORY_STRESS','HIGH','SAVED'].includes($('scenario').value);
  document.querySelectorAll('#result-actions button').forEach(e=>e.disabled=busy||stale);
  if(pkg&&$('order-selected'))updateOrderBulk();
  document.querySelectorAll('.recalculate').forEach(e=>e.disabled=busy||builderDirty||matrixDirty);
}
async function task(fn){if(busy)return;busy=true;document.body.classList.add('busy');controls();try{await fn();}catch(e){message(e.message||'Не удалось выполнить действие','error');}finally{busy=false;document.body.classList.remove('busy');controls();}}
async function request(path,payload){if(window.CosmoRuntime)return window.CosmoRuntime.request(path,payload);let res;try{res=await fetch(path,payload?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}:{});}catch{throw Error('Нет связи с расчётным ядром. Обновите страницу и повторите.');}const data=await res.json();if(!res.ok)throw Error(data.error||`Ошибка сервера ${res.status}`);return data;}
function confirmAction(text){const dialog=$('confirm-dialog');$('confirm-text').textContent=text;dialog.returnValue='cancel';dialog.showModal();return new Promise(resolve=>dialog.addEventListener('close',()=>resolve(dialog.returnValue==='confirm'),{once:true}));}
function closeHelp(except=null){
  document.querySelectorAll('.help-popover:not([hidden])').forEach(popover=>{if(popover===except)return;popover.hidden=true;document.querySelector(`[aria-controls="${popover.id}"]`)?.setAttribute('aria-expanded','false');});
}
document.addEventListener('click',event=>{
  const trigger=event.target.closest('.help-trigger');
  if(trigger){event.preventDefault();event.stopPropagation();const popover=$(trigger.getAttribute('aria-controls')),open=popover.hidden;closeHelp(popover);popover.hidden=!open;trigger.setAttribute('aria-expanded',String(open));return;}
  if(!event.target.closest('.help-wrap'))closeHelp();
});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const popover=document.querySelector('.help-popover:not([hidden])');if(!popover)return;const trigger=document.querySelector(`[aria-controls="${popover.id}"]`);closeHelp();trigger?.focus();});
function valid(){
  if(rawDirty)throw Error('В расширенном редакторе есть неприменённый JSON. Примените его или отмените правки перед расчётом.');
  const bad=[...document.querySelectorAll('[data-field]')].find(e=>e.getAttribute('aria-invalid')==='true'||!e.checkValidity());
  if(bad){switchPanel(bad.closest('.panel').id.replace('panel-',''));bad.focus();bad.reportValidity();throw Error('Исправьте выделенное поле. Некорректный ввод не сохранён.');}
}
function option(select,value,text,disabled=false){const o=el('option',text);o.value=value;o.disabled=disabled;select.append(o);}
function filterOptions(id,items){const s=$(id),old=s.value;s.replaceChildren();for(const [value,text]of items)option(s,value,text);if(items.some(x=>String(x[0])===old))s.value=old;}
function field(obj,key,title,options={}){
  const wrap=el('div',undefined,'field-shell'), input=document.createElement(options.options?'select':'input'), error=el('span','','field-error');
  const uid='f-'+field.seq++;input.id=uid;error.id=uid+'-error';input.setAttribute('aria-label',title);input.setAttribute('aria-describedby',error.id);input.dataset.field='true';
  if(options.readonly){input.dataset.readonly='true';input.disabled=true;}
  if(options.options){for(const [v,t,disabled]of options.options)option(input,v,t,disabled);input.value=obj[key]??'';}
  else {const numeric=!['text','date'].includes(options.type);input.type=options.type==='date'?'date':'text';input.required=!options.optional;
    if(numeric){input.inputMode=options.integer?'numeric':'decimal';input.dataset.numeric='true';input.dataset.min=String(options.min??0);if(options.max!==undefined)input.dataset.max=String(options.max);}
    input.value=options.type==='date'?F.modelDate(obj[key]):options.percent?inputNumber(Number(obj[key])*100):numeric?inputNumber(obj[key]):obj[key]??'';
    if(numeric&&input.value!=='')input.setAttribute('aria-valuetext',fmt(input.value,4));
    if(options.type==='date')input.title='Модельный день: '+(obj[key]??'не задан');
  }
  input.addEventListener('input',()=>{
    input.setCustomValidity('');error.textContent='';input.removeAttribute('aria-invalid');
    let value=input.value;
    try{
      if(input.required&&!value.trim())throw Error('Заполните поле');
      if(input.dataset.numeric==='true'&&value!==''){
        value=value.trim().replace(',','.');const number=Number(value),min=Number(input.dataset.min),max=input.dataset.max===''||input.dataset.max===undefined?null:Number(input.dataset.max);
        if(!Number.isFinite(number))throw Error('Введите число');
        if(number<min||(max!==null&&number>max))throw Error(`Допустимое значение: ${fmt(min,4)}${max===null?' и больше':' - '+fmt(max,4)}`);
        if(options.integer&&!Number.isInteger(number))throw Error('Введите целое число');
        input.setAttribute('aria-valuetext',fmt(number,4));
      }else if(!input.checkValidity())throw Error(input.validity.valueMissing?'Заполните поле':'Проверьте значение');
      if(options.type==='date'&&value)value=F.modelDay(value);
      if(options.percent)value=String(Number(value)/100);
      if(options.integer)value=Number(value);
      if(options.check){const why=options.check(value);if(why)throw Error(why);}
      if(options.research)F.research(pkg);
      if(value===''&&options.optional)delete obj[key];else obj[key]=value;
      if(options.after)options.after(value);
      changed(!!options.research,options.section||input.closest('.panel')?.id.replace('panel-','')||panel);
    }catch(e){input.setCustomValidity(e.message);input.setAttribute('aria-invalid','true');error.textContent=e.message;$('save-status').textContent='Ошибка ввода не сохранена';refreshResultFreshness();controls();}
  });
  wrap.append(input,error);return wrap;
}
field.seq=0;
function ensureCounters(){
  pkg.ui_state=pkg.ui_state||{};const sourceMax=Math.max(5,...Object.keys(pkg.dataset.sources).map(id=>/^S(\d+)$/.test(id)?Number(id.slice(1)):0)),contractMax=Math.max(0,...pkg.plan.contracts.map(c=>/^K(\d+)$/.test(c.id)?Number(c.id.slice(1)):0));
  pkg.ui_state.next_source_id=Math.max(Number(pkg.ui_state.next_source_id)||6,sourceMax+1,6);pkg.ui_state.next_contract_id=Math.max(Number(pkg.ui_state.next_contract_id)||1,contractMax+1,1);
}
function nextSourceId(){ensureCounters();const id='S'+pkg.ui_state.next_source_id++;return id;}
function nextContractId(){ensureCounters();const id='K'+pkg.ui_state.next_contract_id++;return id;}
function labeledField(obj,key,title,options={}){const label=el('label',undefined,`field-label field-${key}`);label.append(el('span',title,'field-title'),field(obj,key,title,options));if(options.tag)label.append(el('span',options.tag,'assumption-mark'));if(options.help)label.append(el('small',options.help));return label;}
function table(target,headings,rows,render){target.replaceChildren();if(!rows.length){const text=target.id==='comparison'?'Здесь пока нет расчётов. Запустите проверку на вкладке «Обзор и расчёт».':'Пока нет записей. Измените фильтр или добавьте новую запись.';target.append(el('p',text,'hint empty-table'));return;}
  const t=el('table'),h=t.createTHead().insertRow();headings.forEach(x=>{const th=el('th',x);th.scope='col';h.append(th);});const b=t.createTBody();rows.forEach((row,i)=>render(b.insertRow(),row,i));target.append(t);
}
function cell(row,value){const td=row.insertCell();td.append(value instanceof Node?value:el('span',value));return td;}
function removeButton(label,fn){const b=el('button','Удалить','danger-button');b.setAttribute('aria-label',label);b.onclick=()=>task(async()=>{valid();await fn();});return b;}
function renderDemand(){table($('demand-form'),['Год','Общий спрос, т','Критический, т','Низкий, т','Высокий, т'],Object.values(pkg.dataset.demand),(tr,d)=>{
  cell(tr,d.year);for(const [key,title]of [['base_total_t','Общий'],['base_critical_t','Критический'],['low_total_t','Низкий'],['high_total_t','Высокий']])cell(tr,field(d,key,`${title} спрос ${d.year}`,{research:true,check:v=>key==='base_critical_t'&&Number(v)>Number(d.base_total_t)?'Не больше общего спроса':key==='base_total_t'&&Number(v)<Number(d.base_critical_t)?'Не меньше критического спроса':''}));
});}
function renderSources(){const root=$('sources-form');root.replaceChildren();for(const [id,s]of Object.entries(pkg.dataset.sources)){
  const linked=!!s.investment_id,research=pkg.dataset.scope==='RESEARCH_INPUT',card=el('article',undefined,`card source-card${linked?' source-card-linked':''}`),head=el('div',undefined,'source-header');head.append(el('h3',`Поставщик ${id}`));
  if(s.include_in_research_planner)head.append(removeButton(`Удалить поставщика ${id}`,async()=>{if(pkg.plan.contracts.some(c=>c.source===id))throw Error('У поставщика есть контракты. Сначала удалите их.');if(!await confirmAction(`Удалить поставщика ${id}?`))return;delete pkg.dataset.sources[id];changed(true);renderAll();}));
  const grid=el('div',undefined,'form-grid');
  grid.append(labeledField(s,'name','Название',{type:'text',research:true}),labeledField(s,'capacity_t_per_year','Мощность, т/год',{research:true}),labeledField(s,'variable_cost_mln_per_t','Цена топлива, млн/т',{research:true}),labeledField(s,'reservation_rate_mln_per_t_year_capacity','Резерв мощности, млн/(т/год)',{research:true}),labeledField(s,'take_or_pay_share','Обязательная оплата, %',{research:true,percent:true,max:100}));
  if(id==='C'){
    grid.append(labeledField(pkg.plan.policy,'earth_new_preparation_months','До появления мощности C, месяцев',{min:research?0.01:18,max:research?120:24,tag:'Допущение команды',after:()=>{pkg.plan.policy.policy_id='TEAM_USER_POLICY';}}));
  }else if(id==='D'){
    grid.append(labeledField(pkg.plan.policy,'isru_delivery_months','После ввода D, месяцев',{min:research?0.01:1,max:research?120:2,tag:'Допущение команды',after:()=>{pkg.plan.policy.policy_id='TEAM_USER_POLICY';}}));
  }else{
    const locked=!research&&['A','B','E'].includes(id);
    grid.append(labeledField(s,'lead_time_max_value','Срок доставки',{research:!locked,readonly:locked,after:v=>s.lead_time_min_value=v,help:locked?'Контрольное значение кейса. Для изменения создайте исследовательскую копию.':''}),labeledField(s,'lead_time_unit','Единица срока',{research:!locked,readonly:locked,options:[['month','Месяцы'],['week','Недели'],['day','Дни']]}),labeledField(s,'available_from_year','Доступен с года',{research:true,min:2034,max:2100,integer:true}));
  }
  grid.append(labeledField(s,'reliability_profile','Надёжность: допущение',{type:'text',research:true}),labeledField(s,'notes','Комментарий к данным',{type:'text',research:true,optional:!s.include_in_research_planner,check:v=>s.include_in_research_planner&&!String(v).trim()?'Для пользовательского источника нужен комментарий':''}));
  card.append(head,grid,el('p','Надёжность хранится как явное допущение и не уменьшает поставки в BASE автоматически.','source-note'));root.append(card);
}}
const roleLabels={opening_inventory:'Начальный запас',planned:'Плановый',planned_with_backup:'Плановый + резерв',contingent_backup:'Страховой резерв',emergency:'Экстренный'};
function contractBounds(c){return {start:F.number(c.start??(c.year-2035)*365),end:F.number(c.end??(c.year-2034)*365)};}
function contractLead(c){const s=pkg.dataset.sources[c.source],p=pkg.plan.policy;if(!s)return {days:0,label:'Нет данных'};if(c.source==='C')return {days:Number(p.earth_new_regular_delivery_months)*365/12,label:`${p.earth_new_regular_delivery_months} мес.`};if(c.source==='D')return {days:Number(p.isru_delivery_months)*365/12,label:`${p.isru_delivery_months} мес.`};const factor=s.lead_time_unit==='month'?365/12:s.lead_time_unit==='week'?7:s.lead_time_unit==='year'?365:1;const units={month:'мес.',week:'нед.',day:'дн.',year:'г.'};return {days:Number(s.lead_time_max_value)*factor,label:`${fmt(s.lead_time_max_value,2)} ${units[s.lead_time_unit]||s.lead_time_unit}`};}
function contractGovernance(c){
  if(c.role==='opening_inventory')return ['Руководитель закупок','До первого необратимого обязательства','Без подтверждения поставки текущий план не разрешается'];
  if(c.role==='contingent_backup')return ['Руководитель логистики','При уведомлении о задержке A','Активировать оплаченный резерв; неиспользованная мощность всё равно оплачена'];
  if(c.source==='C')return ['Менеджер поставщика C','До опциона и при каждом пересмотре графика','Срок свыше 4 месяцев останавливает разрешение и требует пересчёта'];
  return ['Руководитель закупок','Перед годовым обязательством и при изменении спроса','TOP и резерв сохраняются; дефицит публикуется как нарушение сервиса'];
}
function contractFacts(c){const s=pkg.dataset.sources[c.source]||{},bounds=contractBounds(c),fraction=Math.max(0,bounds.end-bounds.start)/365,reserved=Number(c.reserved_annual||0)*fraction,used=pkg.plan.orders.filter(o=>o.contract_id===c.id).reduce((sum,o)=>sum+Number(o.planned_t||0),0),top=Number(s.take_or_pay_share||0),price=Number(s.variable_cost_mln_per_t||0),reserveRate=Number(s.reservation_rate_mln_per_t_year_capacity||0),payable=Math.max(used,top*reserved),[owner,review,consequence]=contractGovernance(c);return [['Цена',`${fmt(price)} млн/т`],['TOP',`${pct(top)}; минимум ${fmt(top*reserved)} т`],['Минимальная оплата',`${fmt(payable*price)} млн`],['Стоимость резерва',`${fmt(reserveRate*Number(c.reserved_annual||0)*fraction)} млн`],['Lead time',contractLead(c).label],['Доступно / использовано',`${fmt(reserved)} / ${fmt(used)} т`],['Мощность источника',`${fmt(Number(s.capacity_t_per_year||0)*fraction)} т за период`],['Ответственный',owner],['Пересмотр',review],['Недопоставка',consequence]];}
function contractFact(label,value){const item=el('div',undefined,'contract-fact');item.append(el('small',label),el('span',value));return item;}
function matrixWindow(sourceId,year){
  const source=pkg.dataset.sources[sourceId],yearStart=(year-2035)*365,yearEnd=yearStart+365;let available=(Number(source.available_from_year||2035)-2035)*365,orderFloor=null;
  if(source.investment_id){const investment=pkg.plan.investments.find(item=>item.id===source.investment_id);if(!investment||investment.commissioned_at===undefined)return {available:false,reason:`Нужна инвестиция ${source.investment_id}`};available=F.number(investment.commissioned_at);orderFloor=available;}
  const start=Math.max(yearStart,available),lead=contractLead({source:sourceId}).days,earliestArrival=Math.max(start,orderFloor===null?start:orderFloor+lead),dates=Array.from({length:12},(_,month)=>Math.ceil(yearStart+month*365/12)).filter(at=>at>=earliestArrival-1e-9&&at<yearEnd),fraction=Math.max(0,yearEnd-start)/365;
  if(!dates.length||fraction<=0)return {available:false,reason:'Источник недоступен в этом году'};
  return {available:true,start,end:yearEnd,lead,orderFloor,dates,fraction,max:Number(source.capacity_t_per_year||0)*fraction};
}
function extractAnnualSupply(){const values={};for(const source of Object.keys(pkg.dataset.sources))values[source]={};const contracts=new Map(pkg.plan.contracts.map(c=>[c.id,c]));for(const order of pkg.plan.orders){if(order.role==='opening_inventory')continue;const contract=contracts.get(order.contract_id);if(!contract)continue;const year=contract.year;values[contract.source]=values[contract.source]||{};values[contract.source][year]=(values[contract.source][year]||0)+Number(order.planned_t||0);}return values;}
function syncAnnualSupplyDraft(force=false){if(force||!matrixDirty)annualSupplyDraft=extractAnnualSupply();}
function renderSupplyMatrix(){
  const target=$('supply-matrix');target.replaceChildren();const years=[];for(let year=pkg.plan.first_year;year<=pkg.plan.last_year;year++)years.push(year);const table=el('table',undefined,'supply-matrix'),head=table.createTHead().insertRow();for(const heading of ['Источник',...years.map(String)]){const th=el('th',heading);th.scope='col';head.append(th);}const body=table.createTBody();
  for(const [sourceId,source]of Object.entries(pkg.dataset.sources)){const row=body.insertRow(),name=el('span',undefined,'supply-matrix-note');name.append(el('strong',`${sourceId} / ${source.name}`));cell(row,name);let any=false;for(const year of years){const td=row.insertCell(),window=matrixWindow(sourceId,year),input=el('input');input.type='text';input.inputMode='decimal';input.value=inputNumber(annualSupplyDraft[sourceId]?.[year]||0);input.setAttribute('aria-label',`Поставка ${sourceId} в ${year}, тонн`);input.dataset.matrix='true';if(!window.available){input.value='0';input.disabled=true;input.title=window.reason;}else{any=true;input.dataset.max=String(window.max);input.addEventListener('input',()=>{const value=Number(input.value.trim().replace(',','.')),valid=Number.isFinite(value)&&value>=0&&value<=window.max+1e-9;input.setCustomValidity(valid?'':`Введите от 0 до ${fmt(window.max,3)} т`);input.toggleAttribute('aria-invalid',!valid);if(valid){annualSupplyDraft[sourceId]=annualSupplyDraft[sourceId]||{};annualSupplyDraft[sourceId][year]=value;matrixDirty=true;dirtySections.add('annual_supply');calculationAcknowledged=false;saveDraft();refreshResultFreshness();updateCalculationStatus();controls();}});}td.append(input);}if(!any)row.classList.add('source-unavailable');}
  target.append(table);
}
function buildPlanFromMatrix(){
  const contracts=pkg.plan.contracts.filter(c=>['opening_inventory','contingent_backup'].includes(c.role)),keptIds=new Set(contracts.map(c=>c.id)),orders=pkg.plan.orders.filter(o=>keptIds.has(o.contract_id));
  for(const [sourceId,byYear]of Object.entries(annualSupplyDraft))for(const year of Object.keys(byYear).map(Number).sort()){const amount=Number(byYear[year]||0);if(amount<=0)continue;const window=matrixWindow(sourceId,year);if(!window.available)throw Error(`${sourceId}, ${year}: ${window.reason}`);if(amount>window.max+1e-9)throw Error(`${sourceId}, ${year}: максимум ${fmt(window.max,3)} т.`);const id=nextContractId(),reserved=amount/window.fraction,firstArrival=window.dates[0],firstOrder=Math.floor(firstArrival-window.lead),decision=Math.max(firstOrder,window.orderFloor??-Infinity);contracts.push({id,source:sourceId,year,start:String(window.start),end:String(window.end),reserved_annual:String(reserved),decision_at:String(decision),role:'planned'});let booked=0;for(let index=0;index<window.dates.length;index++){const arrival=window.dates[index],quantity=index===window.dates.length-1?amount-booked:amount/window.dates.length,ordered=Math.floor(arrival-window.lead);orders.push({id:`${id}-P${String(index+1).padStart(2,'0')}`,contract_id:id,ordered_at:String(Math.max(ordered,window.orderFloor??-Infinity)),arrival_at:String(arrival),planned_t:String(quantity),role:'planned'});booked+=quantity;}}
  pkg.plan.contracts=contracts;pkg.plan.orders=orders;pkg.plan.label='Комбинированный годовой план';if(!pkg.plan.plan_id.endsWith('_MATRIX'))pkg.plan.plan_id+='_MATRIX';pkg.plan.construction={...(pkg.plan.construction||{}),method:'annual_supply_matrix_then_equal_batches',not_global_optimum:true};
}
function renderContracts(){const rows=pkg.plan.contracts.filter(c=>!$('contract-year').value||String(c.year)===$('contract-year').value);$('contract-count').textContent=`${rows.length} из ${pkg.plan.contracts.length} контрактов`;
  table($('contracts-form'),['Контракт','Поставщик','Год','Резерв, т/год','Решение','Начало','Конец, не вкл.','Роль','Условия',''],rows,(tr,c)=>{
    cell(tr,c.id);cell(tr,field(c,'source',`Поставщик ${c.id}`,{options:Object.values(pkg.dataset.sources).map(s=>[s.source_id,`${s.source_id} / ${s.name}`])}));cell(tr,c.year);
    cell(tr,field(c,'reserved_annual',`Мощность ${c.id}`));cell(tr,field(c,'decision_at',`Дата контракта ${c.id}`,{type:'date',optional:true}));
    const period={start:c.start??String((c.year-2035)*365),end:c.end??String((c.year-2034)*365)};
    cell(tr,field(period,'start',`Начало ${c.id}`,{type:'date',after:value=>{c.start=value;}}));cell(tr,field(period,'end',`Конец ${c.id}`,{type:'date',after:value=>{c.end=value;},check:value=>F.number(value)<=F.number(period.start)?'Конец должен быть позже начала':''}));
    const roles=Object.entries(roleLabels);if(c.role&&!roles.some(([value])=>value===c.role))roles.push([c.role,c.role]);cell(tr,field(c,'role',`Роль ${c.id}`,{options:roles}));
    const details=el('details',undefined,'contract-details'),summary=el('summary','Цена, TOP и контроль'),facts=el('div',undefined,'contract-detail-grid');for(const [label,value]of contractFacts(c))facts.append(contractFact(label,value));details.append(summary,facts);cell(tr,details);
    cell(tr,removeButton(`Удалить контракт ${c.id}`,async()=>{if(pkg.plan.orders.some(o=>o.contract_id===c.id))throw Error(`У ${c.id} есть поставки. Сначала перенесите или удалите их.`);if(!await confirmAction(`Удалить контракт ${c.id}?`))return;pkg.plan.contracts=pkg.plan.contracts.filter(x=>x!==c);changed();renderAll();}));
  });
}
function orderYear(order){return 2035+Math.floor(F.number(order.arrival_at)/365);}
function compatibleRole(order,contract){if(order.role==='opening_inventory')return contract.role==='opening_inventory';if(order.role==='emergency')return ['contingent_backup','emergency'].includes(contract.role);return ['planned','planned_with_backup'].includes(contract.role);}
function compatibleContracts(order,includeCurrent=true){
  const year=orderYear(order),current=pkg.plan.contracts.find(c=>c.id===order.contract_id),rows=pkg.plan.contracts.filter(c=>c.year===year&&(!current||c.source===current.source)&&compatibleRole(order,c)&&!validOrderDates(order,c));
  const options=rows.map(c=>[c.id,`${c.id} / ${c.source} / ${c.year}`]);
  if(includeCurrent&&current&&!rows.includes(current))options.unshift([current.id,`${current.id} / ${current.source} / ${current.year} (текущий, несовместим)`,true]);
  return options;
}
function orderGroup(order,mode){const c=pkg.plan.contracts.find(c=>c.id===order.contract_id);if(mode==='source')return {key:c?.source||'?',label:`Поставщик ${c?.source||'неизвестен'}`};if(mode==='contract')return {key:c?.id||'?',label:`Контракт ${c?.id||'неизвестен'} / ${c?.source||'?'}`};return {key:'all',label:''};}
function updateOrderBulk(){const selected=pkg.plan.orders.filter(o=>selectedOrderIds.has(o.id)),count=selected.length,locked=!!pkg.reference_plan;$('order-selected').textContent=count?`Выбрано: ${count}`:'Ничего не выбрано';$('order-bulk-apply').disabled=busy||locked||!count;$('order-bulk-delete').disabled=busy||locked||!count;const select=$('order-bulk-contract'),old=select.value,ids=selected.length?pkg.plan.contracts.filter(c=>selected.every(o=>compatibleContracts(o,false).some(([id])=>id===c.id))).map(c=>[c.id,`${c.id} / ${c.source} / ${c.year}`]):[];filterOptions('order-bulk-contract',[['','Не менять контракт'],...ids]);if(ids.some(([id])=>id===old))select.value=old;}
function renderOrders(){
  const search=$('order-search').value.trim().toLocaleLowerCase('ru-RU'),groupMode=$('order-group').value,pageSize=Number($('order-page-size').value||25);
  const rows=pkg.plan.orders.filter(o=>{const c=pkg.plan.contracts.find(c=>c.id===o.contract_id);return (!$('order-year').value||String(orderYear(o))===$('order-year').value)&&(!$('order-source').value||c?.source===$('order-source').value)&&(!search||o.id.toLocaleLowerCase('ru-RU').includes(search)||o.contract_id.toLocaleLowerCase('ru-RU').includes(search));});
  rows.sort((a,b)=>Number(attentionOrderIds.has(b.id))-Number(attentionOrderIds.has(a.id))||orderGroup(a,groupMode).key.localeCompare(orderGroup(b,groupMode).key)||F.number(a.arrival_at)-F.number(b.arrival_at)||a.id.localeCompare(b.id));
  const pages=Math.max(1,Math.ceil(rows.length/pageSize));orderPage=Math.min(Math.max(1,orderPage),pages);const shown=rows.slice((orderPage-1)*pageSize,orderPage*pageSize),attentionCount=rows.filter(o=>attentionOrderIds.has(o.id)).length;
  $('order-count').textContent=(attentionCount?`Проблемные: ${attentionCount}; `:'')+`${rows.length} из ${pkg.plan.orders.length} поставок`;$('order-page').textContent=`Страница ${orderPage} из ${pages}`;$('order-prev').disabled=busy||orderPage<=1;$('order-next').disabled=busy||orderPage>=pages;
  const target=$('orders-form');target.replaceChildren();if(!shown.length){target.append(el('p','Поставок по выбранным фильтрам нет.','hint empty-table'));updateOrderBulk();return;}
  const t=el('table'),head=t.createTHead().insertRow(),all=el('input');all.type='checkbox';all.setAttribute('aria-label','Выбрать поставки на текущей странице');all.checked=shown.every(o=>selectedOrderIds.has(o.id));all.indeterminate=!all.checked&&shown.some(o=>selectedOrderIds.has(o.id));all.onchange=()=>{for(const o of shown)all.checked?selectedOrderIds.add(o.id):selectedOrderIds.delete(o.id);renderOrders();};
  for(const heading of [all,'Поставка','Контракт','Заказ размещён','Поступление','Объём, т','']){const th=el('th');th.scope='col';th.append(heading instanceof Node?heading:document.createTextNode(heading));head.append(th);}
  const body=t.createTBody();let previousGroup=null;
  for(const o of shown){const group=orderGroup(o,groupMode);if(groupMode!=='none'&&group.key!==previousGroup){const groupRow=body.insertRow();groupRow.className='order-group-row';const groupCell=groupRow.insertCell();groupCell.colSpan=7;groupCell.textContent=group.label;previousGroup=group.key;}
    const tr=body.insertRow();if(attentionOrderIds.has(o.id))tr.classList.add('attention-row');const select=el('input');select.type='checkbox';select.checked=selectedOrderIds.has(o.id);select.setAttribute('aria-label',`Выбрать поставку ${o.id}`);select.onchange=()=>{select.checked?selectedOrderIds.add(o.id):selectedOrderIds.delete(o.id);updateOrderBulk();};cell(tr,select);
    cell(tr,o.id);cell(tr,field(o,'contract_id',`Контракт ${o.id}`,{options:compatibleContracts(o)}));cell(tr,field(o,'ordered_at',`Дата заказа ${o.id}`,{type:'date'}));cell(tr,field(o,'arrival_at',`Поступление ${o.id}`,{type:'date',check:v=>F.number(v)<F.number(o.ordered_at)?'Не раньше даты заказа':''}));cell(tr,field(o,'planned_t',`Объём ${o.id}`));
    cell(tr,removeButton(`Удалить поставку ${o.id}`,async()=>{if(!await confirmAction(`Удалить поставку ${o.id} (${fmt(o.planned_t)} т)?`))return;pkg.plan.orders=pkg.plan.orders.filter(x=>x!==o);selectedOrderIds.delete(o.id);changed();renderOrders();controls();}));
  }
  target.append(t);updateOrderBulk();
}
const investmentDefaults={ZBO:{id:'ZBO',exercise_at:'365',commissioned_at:'1095/2'},EARTH_NEW:{id:'EARTH_NEW',option_at:'0',exercise_at:'365',commissioned_at:'1095'},LUNAR_ISRU:{id:'LUNAR_ISRU',exercise_at:'1000',commissioned_at:'1095'}};
const investmentNames={ZBO:'Хранение ZBO',EARTH_NEW:'Новый поставщик C',LUNAR_ISRU:'Лунное производство D'};
function renderInvestments(){const root=$('investments-form');root.replaceChildren();for(const [id,defaults]of Object.entries(investmentDefaults)){
  const inv=pkg.plan.investments.find(i=>i.id===id),card=el('article',undefined,'card investment-card'),check=el('label',undefined,'check'),input=el('input');input.type='checkbox';input.checked=!!inv;input.setAttribute('aria-label',investmentNames[id]);
  check.append(input,el('strong',investmentNames[id]));card.append(check,el('p',`Инвестиции: ${fmt(pkg.dataset.investments[id]?.total_capex_mln)} млн у.е.`,'source-note'));
  input.onchange=()=>{try{valid();}catch(e){input.checked=!!inv;message(e.message,'error');return;}if(inv)pkg.plan.investments=pkg.plan.investments.filter(x=>x!==inv);else pkg.plan.investments.push(clone(defaults));changed();renderInvestments();$('strategy').value=F.strategy(pkg.plan);$('zbo').checked=pkg.plan.investments.some(i=>i.id==='ZBO');controls();};
  if(inv){const grid=el('div',undefined,'form-grid');if(id==='EARTH_NEW')grid.append(labeledField(inv,'option_at','Оплата опциона',{type:'date'}));grid.append(labeledField(inv,'exercise_at','Финансирование',{type:'date'}),labeledField(inv,'commissioned_at','Ввод в эксплуатацию',{type:'date'}));card.append(grid);}root.append(card);
  }
  const rootPolicy=$('policy-form'),research=pkg.dataset.scope==='RESEARCH_INPUT';rootPolicy.replaceChildren();for(const [key,title,caseMin,caseMax,percent,assumption]of [['real_discount_rate','Ставка дисконтирования, %',0,100,true,false],['earth_new_preparation_months','C: подготовка до мощности, месяцев',18,24,false,true],['earth_new_regular_delivery_months','C: доставка после ввода, месяцев',2,6,false,true],['zbo_installation_months','Монтаж ZBO, месяцев',0,60,false,true],['isru_delivery_months','D: доставка после ввода, месяцев',1,2,false,true]])rootPolicy.append(labeledField(pkg.plan.policy,key,title,{min:research&&assumption?0.01:caseMin,max:research&&assumption?120:caseMax,percent,tag:assumption?'Допущение команды':'',after:()=>{pkg.plan.policy.policy_id='TEAM_USER_POLICY';}}));
}
function keyViolationLabel(code){return code?(violations[code]?.[0]||code):'Нет';}
function runStatus(run){
  if(!run)return {kind:'idle',symbol:'-',label:'Не запускался'};
  if(run.status==='FEASIBLE')return {kind:'pass',symbol:'✓',label:'Покрывает условия'};
  if(['INFEASIBLE','TARGETS_MISSED'].includes(run.status))return {kind:'warning',symbol:'!',label:'Есть ограничения'};
  if(['INVALID_PLAN','STOPPED_OVERFLOW'].includes(run.status))return {kind:'error',symbol:'×',label:'Прогноз ограничен'};
  return {kind:'error',symbol:'×',label:'Ошибка'};
}
function statusCell(run){const state=runStatus(run),wrap=el('span',undefined,`comparison-status status-${state.kind}`),title=el('strong');title.append(el('span',state.symbol,'status-symbol'),document.createTextNode(state.label));wrap.append(title);if(run){const facts=[];if(run.shortage_t!==null&&run.shortage_t!==undefined)facts.push(`Дефицит ${fmt(run.shortage_t)} т`);if(run.pv_mln!==null&&run.pv_mln!==undefined)facts.push(`PV ${fmt(run.pv_mln)} млн`);wrap.append(el('small',facts.join(' · ')||'Показатели не рассчитаны'));}return wrap;}
function statusControl(run,label){if(!run)return statusCell(run);const button=el('button',undefined,'comparison-open');button.type='button';button.setAttribute('aria-label',`Открыть ${label}: ${runStatus(run).label}`);button.append(statusCell(run));button.onclick=event=>{event.stopPropagation();openSavedRun(run);};return button;}
function historyGroups(){const groups=new Map();runs.forEach((run,index)=>{const key=run.comparison_key||run.plan_key||(run.package?F.planInputHash(run.package):`legacy-${index}`);if(!groups.has(key))groups.set(key,{key,name:run.name||run.plan_id||'Сохранённый план',runs:[],package:run.package});groups.get(key).runs.push(run);});return [...groups.values()].map(group=>{group.base=group.runs.find(run=>run.scenario_id==='BASE');group.stress=group.runs.find(run=>run.scenario_id==='MANDATORY_STRESS');group.other=group.runs.filter(run=>!['BASE','MANDATORY_STRESS'].includes(run.scenario_id));group.latest=group.runs[0];return group;});}
function newComparisonKey(runPackage){const nonce=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;return `${F.planInputHash(runPackage)}-${nonce}`;}
function runRecord(evaluation,runPackage,name,origin='user',comparisonKey=''){return {...evaluation.summary,summary:evaluation.summary,annual:evaluation.annual||[],violations:evaluation.violations||[],diagnostics:evaluation.diagnostics||{},components_mln:evaluation.components_mln||{},violation_years:evaluation.violation_years||[],run_url:evaluation.run_url||'',scenario_mode:evaluation.scenario_mode||evaluation.summary.scenario_id,package:clone(runPackage),plan_key:F.planInputHash(runPackage),comparison_key:comparisonKey,name:name||planLabel(runPackage.plan,!!runPackage.reference_plan),origin};}
function rememberComparison(comparison,runPackage,name,origin='user',comparisonKey=newComparisonKey(runPackage)){for(const evaluation of [...comparison].reverse())runs.unshift(runRecord(evaluation,runPackage,name,origin,comparisonKey));runs=runs.slice(0,36);return comparisonKey;}
async function openSavedRun(run){if(!run?.package){message('У старой записи нет снимка входов. Откройте её HTML-отчёт.','warning');return;}if((dirtySections.size||builderDirty||matrixDirty||rawDirty)&&!await confirmAction('Открыть сохранённый расчёт? Текущий изменённый план будет заменён, история останется.'))return;pkg=clone(run.package);dirtySections.clear();builderDirty=false;matrixDirty=false;rawDirty=false;calculationAcknowledged=true;lastCalculatedSections=[];$('scenario').value=['BASE','MANDATORY_STRESS','LOW','HIGH','SAVED'].includes(run.scenario_mode)?run.scenario_mode:(['BASE','MANDATORY_STRESS','LOW','HIGH'].includes(run.scenario_id)?run.scenario_id:'SAVED');renderAll(true);scenarioHelp();if(run.annual&&run.summary)showResult(run);switchPanel('overview');saveDraft();message(`Открыт точный снимок: ${scenarioLabels[run.scenario_id]||run.scenario_id}. План, данные, контракты, поставки и инвестиции восстановлены.`,'success');}
const historyMetrics=[
  {key:'pv_mln',title:'Приведённая стоимость',short:'PV',unit:'млн у.е.',better:'Меньше лучше',lower:true,format:value=>`${fmt(value)} млн`},
  {key:'capex_mln',title:'Инвестиции',short:'CAPEX',unit:'млн у.е.',better:'Меньше лучше',lower:true,format:value=>`${fmt(value)} млн`},
  {key:'shortage_t',title:'Дефицит',short:'Дефицит',unit:'тонн',better:'Меньше лучше',lower:true,format:value=>`${fmt(value)} т`},
  {key:'worst_critical_service',title:'Критический сервис',short:'Сервис',unit:'доля спроса',better:'Больше лучше',lower:false,maximum:1,format:value=>pct(value)}
];
const historyPlanColors=['#245fd4','#14734a','#a66b05','#8357a3'];
function historyRun(group,scenario=historyScenario){return scenario==='MANDATORY_STRESS'?group.stress:group.base;}
function historyValue(run,key){const raw=run?.[key];if(raw===null||raw===undefined||raw==='')return null;const value=Number(raw);return Number.isFinite(value)?value:null;}
function historyPlanName(name){return String(name||'Сохранённый план').replace(/^Альтернатива:\s*/,'');}
function chooseHistoryScenario(groups){if(historyScenario)return;const count=scenario=>groups.filter(group=>historyValue(historyRun(group,scenario),'pv_mln')!==null).length;historyScenario=count('MANDATORY_STRESS')>count('BASE')?'MANDATORY_STRESS':'BASE';}
function chooseHistoryPlans(groups){
  const available=new Set(groups.map(group=>group.key));historySelectedKeys=new Set([...historySelectedKeys].filter(key=>available.has(key)).slice(0,4));if(historySelectedKeys.size)return;
  const ranked=[...groups].sort((left,right)=>{const a=historyRun(left),b=historyRun(right),aUser=left.runs.some(run=>run.origin==='user'),bUser=right.runs.some(run=>run.origin==='user');if(aUser!==bUser)return aUser?-1:1;const aFeasible=a?.status==='FEASIBLE',bFeasible=b?.status==='FEASIBLE';if(aFeasible!==bFeasible)return aFeasible?-1:1;return (historyValue(a,'pv_mln')??Infinity)-(historyValue(b,'pv_mln')??Infinity);});
  for(const group of ranked.slice(0,4))historySelectedKeys.add(group.key);
}
function historyDecision(groups){
  const evaluated=groups.filter(group=>historySelectedKeys.has(group.key)).map(group=>({group,run:historyRun(group)})).filter(item=>item.run&&historyMetrics.some(metric=>historyValue(item.run,metric.key)!==null)),feasible=evaluated.filter(item=>item.run.status==='FEASIBLE'),pool=feasible.length?feasible:evaluated,active=historyMetrics.filter(metric=>pool.some(item=>historyValue(item.run,metric.key)!==null));
  for(const item of pool){const scores=active.map(metric=>{const value=historyValue(item.run,metric.key),values=pool.map(candidate=>historyValue(candidate.run,metric.key)).filter(candidate=>candidate!==null);if(value===null||!values.length)return 0;const minimum=Math.min(...values),maximum=Math.max(...values);if(Math.abs(maximum-minimum)<1e-9)return 1;return metric.lower?(maximum-value)/(maximum-minimum):(value-minimum)/(maximum-minimum);});item.score=scores.length?scores.reduce((sum,value)=>sum+value,0)/scores.length:0;}
  const tieBreak=['shortage_t','worst_critical_service','pv_mln','capex_mln'];pool.sort((left,right)=>{if(Math.abs(right.score-left.score)>1e-9)return right.score-left.score;for(const key of tieBreak){const metric=historyMetrics.find(item=>item.key===key),a=historyValue(left.run,key),b=historyValue(right.run,key);if(a===null&&b!==null)return 1;if(a!==null&&b===null)return -1;if(a!==null&&b!==null&&Math.abs(a-b)>1e-9)return metric.lower?a-b:b-a;}return historyPlanName(left.group.name).localeCompare(historyPlanName(right.group.name),'ru');});
  return {winner:pool[0]||null,criteriaCount:active.length,feasibleOnly:feasible.length>0};
}
function historyTestButton(run,label){const state=runStatus(run),button=el('button',undefined,`history-test-button status-${state.kind}`);button.type='button';button.disabled=!run;if(!run)button.dataset.readonly='true';button.setAttribute('aria-label',run?`Открыть ${label}: ${state.label}`:`${label}: не запускался`);button.title=run?`${label}: ${state.label}`:`${label}: не запускался`;button.append(el('span',state.symbol,'status-symbol'),document.createTextNode(label));if(run)button.onclick=event=>{event.stopPropagation();openSavedRun(run);};return button;}
function renderHistorySummary(groups){
  const root=$('history-summary'),base=groups.filter(group=>group.base),stress=groups.filter(group=>group.stress),stats=[
    ['Планов',groups.length,'в истории'],
    ['База',base.filter(group=>group.base.status==='FEASIBLE').length,`из ${base.length} покрывают условия`],
    ['Стресс',stress.filter(group=>group.stress.status==='FEASIBLE').length,`из ${stress.length} покрывают условия`],
    ['Выбрано',historySelectedKeys.size,'максимум 4 плана']
  ];root.replaceChildren();for(const [label,value,caption]of stats){const item=el('article',undefined,'history-summary-item');item.setAttribute('role','listitem');item.append(el('span',label),el('strong',String(value)),el('small',caption));root.append(item);}
}
function renderHistoryPicker(groups,winnerKey=null){
  const root=$('history-plan-picker'),selected=groups.filter(group=>historySelectedKeys.has(group.key));root.replaceChildren();$('history-selection-count').textContent=`${selected.length} из 4`;
  for(const group of groups){const checked=historySelectedKeys.has(group.key),winner=checked&&group.key===winnerKey,selectedIndex=selected.findIndex(item=>item.key===group.key),item=el('article',undefined,`history-plan-choice${checked?' selected':''}${winner?' winner':''}`),choice=el('label',undefined,'history-plan-select'),input=el('input'),index=el('span',checked?String(selectedIndex+1):'+','history-plan-index'),copy=el('span',undefined,'history-plan-copy'),limitReached=!checked&&historySelectedKeys.size>=4;input.type='checkbox';input.checked=checked;input.disabled=limitReached;if(limitReached)input.dataset.readonly='true';input.setAttribute('aria-label',`Сравнивать план ${historyPlanName(group.name)}`);item.title=historyPlanName(group.name);if(checked){item.style.setProperty('--plan-color',historyPlanColors[selectedIndex]);index.style.setProperty('--plan-color',historyPlanColors[selectedIndex]);}copy.append(el('strong',historyPlanName(group.name)));if(winner)copy.append(el('span','Лучшая стратегия','history-plan-winner'));copy.append(el('small',fmtTime(group.latest?.calculated_at_utc)));choice.append(input,index,copy);input.onchange=()=>{if(input.checked){if(historySelectedKeys.size>=4){input.checked=false;return;}historySelectedKeys.add(group.key);}else historySelectedKeys.delete(group.key);renderHistory();};const tests=el('div',undefined,'history-test-buttons');tests.append(historyTestButton(group.base,'База'),historyTestButton(group.stress,'Стресс'));item.append(choice,tests);root.append(item);}
}
function renderHistoryInsight(decision){
  const root=$('history-insight'),best=decision.winner;root.replaceChildren();
  if(!best){root.className='history-insight warning';root.append(el('strong','Нет расчётов для сравнения'),el('span','Выберите рассчитанные планы.'));return;}
  const score=Math.round(best.score*100),open=el('button','Открыть','quiet compact');open.onclick=()=>openSavedRun(best.run);root.className=`history-insight ${decision.feasibleOnly?'success':'warning'}`;root.title='Итоговый балл считается относительно выбранных планов. PV, инвестиции, дефицит и критический сервис имеют равный вес.';root.append(el('strong',decision.feasibleOnly?'Лучшая стратегия':'Лучший из выбранных'),el('span',`${historyPlanName(best.group.name)} · ${score}/100 по ${decision.criteriaCount} критериям${decision.feasibleOnly?'':' · условия не покрыты'}`),open);
}
function renderHistoryCharts(groups){
  const root=$('history-charts'),selected=groups.filter(group=>historySelectedKeys.has(group.key));root.replaceChildren();if(!selected.length){root.append(el('p','Выберите хотя бы один план.','history-chart-empty'));return;}
  for(const metric of historyMetrics){const chart=el('section',undefined,'history-metric-chart'),heading=el('div',undefined,'history-metric-head'),title=el('div');title.append(el('h4',metric.title),el('span',metric.better));heading.append(title,el('small',metric.unit));chart.append(heading);const items=selected.map((group,index)=>({group,index,run:historyRun(group),value:historyValue(historyRun(group),metric.key)})),values=items.filter(item=>item.value!==null),eligible=values.filter(item=>item.run?.status==='FEASIBLE'),bestValue=eligible.length?(metric.lower?Math.min(...eligible.map(item=>item.value)):Math.max(...eligible.map(item=>item.value))):null,maximum=metric.maximum??Math.max(...values.map(item=>item.value),1),rows=el('div',undefined,'history-metric-rows');
    for(const item of items){const row=el('div',undefined,'history-metric-row'),key=el('span',String(item.index+1),'history-chart-key'),plot=el('span',undefined,'history-metric-plot'),value=el('strong',item.value===null?'Нет данных':metric.format(item.value),'history-metric-value'),isBest=bestValue!==null&&item.run?.status==='FEASIBLE'&&Math.abs(item.value-bestValue)<1e-9;key.style.setProperty('--plan-color',historyPlanColors[item.index]);row.title=`${historyPlanName(item.group.name)}. ${metric.title}: ${item.value===null?'нет данных':metric.format(item.value)}. ${runStatus(item.run).label}.`;row.setAttribute('aria-label',row.title);if(item.value!==null){const bar=el('span',undefined,`history-metric-bar${item.value===0?' zero':''}`);bar.style.width=`${Math.max(item.value===0?0:2,Math.min(100,item.value/Math.max(maximum,1e-9)*100))}%`;bar.style.setProperty('--plan-color',historyPlanColors[item.index]);plot.append(bar);}if(isBest){row.classList.add('best');value.append(el('span','Лучшее','history-best'));}row.append(key,plot,value);rows.append(row);}chart.append(rows);chart.setAttribute('aria-label',`${metric.title}, ${historyScenario==='BASE'?'базовый тест':'стресс-тест'}: ${items.map(item=>`${historyPlanName(item.group.name)}, ${item.value===null?'нет данных':metric.format(item.value)}`).join('; ')}.`);root.append(chart);}
}
function renderHistoryTable(groups){
  const target=$('comparison'),t=el('table',undefined,'comparison-table'),head=t.createTHead().insertRow();target.replaceChildren();for(const heading of ['Сохранённый план','Базовый тест','Стресс-тест','Другие условия','Последний расчёт']){const th=el('th',heading);th.scope='col';head.append(th);}const body=t.createTBody();
  for(const group of groups){const tr=body.insertRow(),states=[runStatus(group.base),runStatus(group.stress)],kind=states.some(state=>state.kind==='error')?'error':states.some(state=>state.kind==='warning')?'warning':states.every(state=>state.kind==='pass')?'pass':'idle',preferred=group.latest;tr.className=`status-${kind}`;tr.tabIndex=preferred?.package?0:-1;tr.setAttribute('aria-label',preferred?.package?`Открыть последний расчёт плана ${group.name}`:`Старая запись ${group.name}`);tr.onclick=event=>{if(!event.target.closest('a,button,input,select'))openSavedRun(preferred);};tr.onkeydown=event=>{if((event.key==='Enter'||event.key===' ')&&event.target===tr){event.preventDefault();openSavedRun(preferred);}};cell(tr,historyPlanName(group.name));cell(tr,statusControl(group.base,'базовый тест'));cell(tr,statusControl(group.stress,'стресс-тест'));const other=group.other.length?group.other.map(run=>`${scenarioLabels[run.scenario_id]||run.scenario_id}: ${runStatus(run).label}`).join('; '):'Нет';cell(tr,other);const meta=el('span',undefined,'history-meta');meta.append(el('strong',preferred?.data_version||'Версия данных неизвестна'),el('span',preferred?.policy_version||'Политика неизвестна'),el('time',fmtTime(preferred?.calculated_at_utc)),el('span',preferred?.package?'Строка открывает последний расчёт':'Доступен только отчёт','history-open-hint'));if(preferred?.input_sha256)meta.title=`Хеш входов: ${preferred.input_sha256}`;const report=group.runs.find(run=>run.run_url);if(report){const a=el('a','Отчёт','history-report-link');a.href=report.run_url+'report.html';a.target='_blank';a.rel='noopener';meta.append(a);}cell(tr,meta);}target.append(t);$('history-table-count').textContent=`${groups.length} планов`;
}
function renderHistory(){
  const groups=historyGroups();$('history-count').textContent=groups.length;$('history-empty').hidden=!!groups.length;$('history-dashboard').hidden=!groups.length;if(!groups.length){$('comparison').replaceChildren();historySelectedKeys.clear();return;}chooseHistoryScenario(groups);chooseHistoryPlans(groups);const decision=historyDecision(groups);document.querySelectorAll('[data-history-scenario]').forEach(button=>{const active=button.dataset.historyScenario===historyScenario;button.setAttribute('aria-pressed',String(active));button.onclick=()=>{historyScenario=button.dataset.historyScenario;renderHistory();};});renderHistorySummary(groups);renderHistoryInsight(decision);renderHistoryPicker(groups,decision.winner?.group.key);renderHistoryCharts(groups);renderHistoryTable(groups);
}
function csvCell(value){const text=String(value??'');return /[";,\n]/.test(text)?'"'+text.replaceAll('"','""')+'"':text;}
function downloadText(filename,text,type='text/csv;charset=utf-8'){const blob=new Blob(['\uFEFF'+text],{type}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportHistory(){const columns=[['name','plan'],['plan_id','plan_id'],['scenario_id','scenario'],['status','status'],['worst_total_service','worst_total_service'],['worst_critical_service','worst_critical_service'],['shortage_t','shortage_t'],['critical_shortage_t','critical_shortage_t'],['minimum_inventory_t','minimum_inventory_t'],['final_inventory_t','final_inventory_t'],['minimum_reserve_margin_t','minimum_reserve_margin_t'],['capex_mln','capex_mln'],['total_mln','total_mln'],['pv_mln','pv_mln'],['key_violation','key_violation'],['data_version','data_version'],['policy_version','policy_version'],['calculated_at_utc','calculated_at_utc'],['input_sha256','input_sha256'],['run_url','run_url']];const lines=[columns.map(([,label])=>csvCell(label)).join(';'),...runs.map(run=>columns.map(([key])=>csvCell(run[key])).join(';'))];downloadText('cosmo-comparison-history.csv',lines.join('\n'));}
function renderDataActions(){for(const wrap of document.querySelectorAll('.data-calc-actions')){wrap.replaceChildren();const recalc=el('button','Пересчитать текущий план','primary recalculate');recalc.onclick=()=>startCalculation('evaluate');wrap.append(recalc);if(wrap.dataset.rebuild==='true'){const rebuild=el('button','Перестроить график','secondary rebuild');rebuild.onclick=()=>$('build').click();wrap.append(rebuild);}}}
function renderAll(syncBuilder=false,preserveMatrix=false){
  if(syncBuilder&&!preserveMatrix)matrixDirty=false;ensureCounters();selectedOrderIds=new Set([...selectedOrderIds].filter(id=>pkg.plan.orders.some(order=>order.id===id)));updateIdentity();const years=[['','Все годы']];for(let y=2034;y<=pkg.plan.last_year;y++)years.push([String(y),String(y)]);
  filterOptions('contract-year',years);filterOptions('order-year',years);filterOptions('order-source',[['','Все поставщики'],...Object.keys(pkg.dataset.sources).map(k=>[k,k])]);
  if(syncBuilder&&!$('order-year').value)$('order-year').value=String(pkg.plan.first_year);
  syncAnnualSupplyDraft(syncBuilder&&!preserveMatrix);renderDemand();renderSources();renderContracts();renderOrders();renderInvestments();renderSupplyMatrix();renderHistory();renderDataActions();
  if(syncBuilder){builderDirty=false;$('build-hint').textContent='';$('strategy').value=F.strategy(pkg.plan);$('reserve').value=pkg.plan.construction?.reserve_days||45;$('reserve').setAttribute('aria-valuetext',`${$('reserve').value} дней`);$('profile').value=pkg.plan.construction?.planning_profile||'BASE';$('zbo').checked=pkg.plan.investments.some(i=>i.id==='ZBO');$('e-insurance').checked=pkg.plan.contracts.some(c=>c.source==='E'&&c.role==='contingent_backup');}
  $('json').value=JSON.stringify(pkg,null,2);rawDirty=false;updateCalculationStatus();controls();
}
const violations={
  OPENING_RESERVE_SHORTFALL:['Не хватает запаса к началу года','Увеличение страхового запаса с новым графиком либо перенос поставки на более ранний срок.'],
  TOTAL_SERVICE_SHORTFALL:['План не покрывает общий спрос','Более ранние поставки. Для стресса и высокого спроса доступна проверка реакции B/E.'],
  CRITICAL_SERVICE_SHORTFALL:['Не покрыт критический спрос','Более ранние поставки или увеличение запаса топлива.'],
  STORAGE_OVERFLOW:['Склад переполняется','Перенос или сокращение поставок с учётом даты и действующего хранилища.'],
  LOSS_CEILING_EXCEEDED:['Потери топлива выше допустимых','ZBO либо перенос поставок на период после его ввода.'],
  EMERGENCY_BASE_STREAK:['Источник E используется слишком долго','Новый график без использования источника E три года подряд.'],
  EARLY_DELIVERY:['Поставка приходит раньше допустимого срока','Более позднее прибытие либо более ранний заказ с учётом срока доставки.'],
  SOURCE_NOT_COMMISSIONED:['Поставщик ещё не введён','Согласование поставки с инвестициями и датой ввода источника.'],
  CONTRACT_BEFORE_AVAILABILITY:['Контракт начинается слишком рано','Начало контракта с даты доступности поставщика.'],
  ACTUAL_ANNUAL_CAPACITY_EXCEEDED:['Превышена мощность поставщика','Снижение годового объёма либо распределение поставок между источниками.'],
  CAPACITY_EXCEEDED:['Зарезервировано больше мощности, чем доступно','Снижение резерва в контрактах этого поставщика.'],
  ORDER_VOLUME_EXCEEDED:['Заказано больше, чем разрешает контракт','Сокращение партий либо увеличение резерва мощности по контракту.'],
  ORDER_BEFORE_CONTRACT:['Заказ сделан до заключения контракта','Более поздняя дата заказа либо более раннее заключение контракта.'],
  ORDER_BEFORE_COMMISSION:['Заказ сделан до ввода мощности','Дата заказа после ввода проекта.'],
  ZBO_NOT_AVAILABLE:['ZBO оплачена раньше разрешённого срока','Оплата ZBO в допустимый период.'],
  EARLY_COMMISSION:['Проект введён раньше допустимого срока','Дата ввода с учётом срока подготовки проекта.'],
  UNFUNDED_COMMISSION:['Проект введён до полной оплаты','Более поздний ввод либо более раннее финансирование.'],
  MISSED_FINANCING_DEADLINE:['Проект не профинансирован вовремя','Перенос платежей на более ранний срок.'],
  CAPEX_OPTION_OVERPAID:['Инвестиция оплачена сверх требуемой суммы','Проверка платежей проекта и исключение повторной оплаты.'],
  CAPEX_BUDGET_EXCEEDED:['Превышен инвестиционный бюджет','Сокращение инвестиций либо перенос части платежей за контрольную дату.']
};
const resultStates={
  FEASIBLE:['План покрывает выбранные условия','Дефицита нет, а запас, мощности и бюджет находятся в заданных пределах.'],
  INFEASIBLE:['Текущий план не покрывает выбранные условия',''],
  TARGETS_MISSED:['Сервис текущего плана ниже целевого уровня',''],
  INVALID_PLAN:['Полный прогноз для текущего графика недоступен','Противоречие во входных данных не позволяет надёжно рассчитать стоимость, дефицит и годовой баланс.'],
  STOPPED_OVERFLOW:['Прогноз ограничен моментом переполнения склада','После достижения вместимости дальнейший баланс недостоверен, поэтому итоговые показатели не рассчитаны.']
};
const badgeStates={FEASIBLE:['Спрос покрыт','success'],INFEASIBLE:['Есть дефицит','warning'],TARGETS_MISSED:['Сервис ниже цели','warning'],INVALID_PLAN:['Нет полного прогноза','danger'],STOPPED_OVERFLOW:['Прогноз ограничен','danger']};
function humanDate(value){const [year,month,day]=F.modelDate(value).split('-');return `${day}.${month}.${year}`;}
function ceilFmt(value,digits=2){const power=10**digits;return fmt(Math.ceil((Number(value)+Number.EPSILON)*power)/power,digits);}
function overflowDiagnostic(r){return r.diagnostics?.storage_overflow;}
function planningMismatch(r){const scenario=r.summary.scenario_id,planned=pkg.plan.construction?.planning_profile;return profileLabels[scenario]&&profileLabels[planned]&&scenario!==planned?{scenario,planned}:null;}
function earthOnlyHighPlan(){return F.strategy(pkg.plan)==='EARTH_ONLY'&&pkg.plan.construction?.planning_profile==='HIGH';}
function earthOnlyHighAdvice(){return 'Для высокого спроса подходит стратегия с поставщиком C или лунным производством D и новым графиком. Ручное увеличение E не устраняет ограничение мощности.';}
function overflowDeliveries(diagnostic){return (diagnostic?.deliveries||[]).map(d=>`${d.id} (${fmt(d.planned_t)} т)`).join(', ');}
function violationFact(v,r){
  if(v.code==='EMERGENCY_BASE_STREAK')return `В графике источник E используется ${fmt(v.actual,0)} года подряд. Допустимо не более ${fmt(v.limit,0)} лет подряд.`;
  if(v.code==='STORAGE_OVERFLOW'){
    const diagnostic=overflowDiagnostic(r),arrivals=overflowDeliveries(diagnostic);
    const storage=diagnostic?.active_storage==='ZBO'?'ZBO':'склада';
    return diagnostic&&arrivals?`${humanDate(diagnostic.at)} после одновременного поступления партий ${arrivals} запас вырос до ${fmt(v.actual)} т при вместимости ${storage} ${fmt(v.limit)} т.`:`Запас вырос до ${fmt(v.actual)} т при вместимости склада ${fmt(v.limit)} т.`;
  }
  if(v.code==='OPENING_RESERVE_SHORTFALL')return `На начало ${v.subject} года в запасе ${fmt(v.actual)} т при необходимом минимуме ${fmt(v.limit)} т.`;
  if(v.code==='TOTAL_SERVICE_SHORTFALL'||v.code==='CRITICAL_SERVICE_SHORTFALL')return `В ${v.subject} году обслужено ${fmt(Number(v.actual)*100)}% спроса при цели не ниже ${fmt(Number(v.limit)*100)}%.`;
  if(v.code==='LOSS_CEILING_EXCEEDED')return `В ${v.subject} году потери составили ${fmt(Number(v.actual)*100)}% при пределе ${fmt(Number(v.limit)*100)}%.`;
  const units={t:' т','t/year':' т/год',mln:' млн',years:' года',share:''};
  const unit=units[v.unit]??` ${v.unit||''}`;
  return `${v.subject||'План'}: фактическое значение ${fmt(v.actual)}${unit}, допустимый предел ${fmt(v.limit)}${unit}.`;
}
function violationHelp(v,r){
  if(earthOnlyHighPlan()&&['OPENING_RESERVE_SHORTFALL','TOTAL_SERVICE_SHORTFALL','CRITICAL_SERVICE_SHORTFALL'].includes(v.code))return earthOnlyHighAdvice();
  if(v.code!=='STORAGE_OVERFLOW')return (violations[v.code]||['Нарушено правило модели','Проверка входных данных и подробного отчёта.'])[1];
  const diagnostic=overflowDiagnostic(r),mismatch=planningMismatch(r),hasZbo=pkg.plan.investments.some(i=>i.id==='ZBO');
  if(mismatch)return `${diagnostic?.active_storage==='ZBO'?'ZBO уже работает, его вместимость в этой модели фиксирована. ':''}Предпочтительный путь: допустимый вариант, рассчитанный для выбранных условий. Для сохранения текущего графика возможен перенос одной из указанных партий либо сокращение их суммарного объёма минимум на ${ceilFmt(diagnostic?.required_planned_reduction_t||v.excess)} т.`;
  if(diagnostic?.active_storage==='ZBO')return `Вместимость работающего ZBO ограничена ${fmt(v.limit)} т. Возможен перенос одной из указанных партий либо сокращение их суммарного объёма минимум на ${ceilFmt(diagnostic.required_planned_reduction_t)} т.`;
  if(hasZbo)return `На эту дату ZBO ещё не введено. Возможен перенос поставки на период после ввода ZBO либо сокращение ближайших партий минимум на ${ceilFmt(diagnostic?.required_planned_reduction_t||v.excess)} т.`;
  return `Варианты: перенос одной из ближайших партий, сокращение их суммарного объёма минимум на ${ceilFmt(diagnostic?.required_planned_reduction_t||v.excess)} т либо добавление ZBO в план.`;
}
function resultSummaryText(s,r,rows,defaultText){
  const mismatch=planningMismatch(r);
  if(['INFEASIBLE','TARGETS_MISSED'].includes(s.status)&&earthOnlyHighPlan())return 'Расчёт выполнен. При высоком спросе суммарной мощности A, B и допустимого использования E недостаточно, поэтому в 2039-2040 годах возникает нехватка запаса и топлива.';
  if(s.status==='STOPPED_OVERFLOW'&&rows.length){const v=rows[0],diagnostic=overflowDiagnostic(r),fact=`Запас ${fmt(v.actual)} т при вместимости ${fmt(v.limit)} т.`;return mismatch?`${fact} График построен для ${profileLabels[mismatch.planned]}, а проверяется в условиях ${profileLabels[mismatch.scenario]}.`:fact;}
  if(s.status==='INVALID_PLAN'&&rows.length)return `${violationFact(rows[0],r)} Поэтому стоимость, дефицит и годовой баланс не рассчитаны.`;
  return defaultText;
}
function overflowSummaryTitle(r){const diagnostic=overflowDiagnostic(r);return diagnostic?.at===undefined?'Склад переполнится':`Склад переполнится ${humanDate(diagnostic.at)}`;}
function problemPartiesLabel(count){if(count===1)return 'Показать партию';const last=count%10,lastTwo=count%100,word=last>=2&&last<=4&&(lastTwo<12||lastTwo>14)?'партии':'партий';return `Показать ${count} ${word}`;}
function appendOverflowDetails(summary,r,v){
  const diagnostic=overflowDiagnostic(r),arrivals=overflowDeliveries(diagnostic),details=el('details',undefined,'result-overflow-details'),copy=el('div',undefined,'result-overflow-detail-copy');
  details.append(el('summary','Причина и возможные решения'));
  if(arrivals)copy.append(el('p',`Одновременно поступают: ${arrivals}.`));
  copy.append(el('p',violationHelp(v,r)));
  details.append(copy);summary.append(details);
}
function openResultPanel(name,source,year,orders=[]){
  if(name==='orders'){
    attentionOrderIds=new Set(orders);
    if(source===null)$('order-source').value='';else if(source!==undefined)$('order-source').value=source;
    if(year!==undefined&&year!==null)$('order-year').value=String(year);
    renderOrders();
  }
  switchPanel(name);
  if(name==='orders'&&orders.length)requestAnimationFrame(()=>document.querySelector('#orders-form .attention-row')?.scrollIntoView({block:'center',behavior:'auto'}));
}
function configureResultActions(rows,r){
  const wrap=$('result-actions'),primary=$('result-primary-action'),secondary=$('result-secondary-action'),first=rows[0];
  wrap.hidden=true;primary.hidden=true;secondary.hidden=true;primary.textContent='';secondary.textContent='';primary.onclick=null;secondary.onclick=null;
  if(!first)return;
  if(first.code==='EMERGENCY_BASE_STREAK'){
    if(pkg.reference_plan){primary.textContent='Вернуться к исходному плану';primary.onclick=()=>$('back-base').click();}
    else if(pkg.plan.construction){primary.textContent='Перестроить график';primary.onclick=()=>$('build').click();}
    else{primary.textContent='Построить новый график';primary.onclick=()=>$('build').click();}
    secondary.textContent='Открыть поставки E';secondary.onclick=()=>openResultPanel('orders','E');secondary.hidden=false;
  }else if(earthOnlyHighPlan()){
    primary.textContent='Выбрать другую стратегию';primary.onclick=()=>{switchPanel('overview');$('strategy').focus();};
  }else if(first.code==='STORAGE_OVERFLOW'){
    const diagnostic=overflowDiagnostic(r),ids=(diagnostic?.deliveries||[]).map(d=>d.id);
    primary.textContent=ids.length?problemPartiesLabel(ids.length):'Открыть поставки';primary.onclick=()=>openResultPanel('orders',null,diagnostic?.year,ids);
  }
  if(primary.onclick)primary.hidden=false;
  if(primary.onclick||secondary.onclick)wrap.hidden=false;
}
function alternativeIsBetter(candidate,current={}){
  if(candidate?.status!=='FEASIBLE'||candidate.pv_mln===null||candidate.pv_mln===undefined)return false;
  if(current.status!=='FEASIBLE'||current.pv_mln===null||current.pv_mln===undefined)return true;
  const candidatePv=Number(candidate.pv_mln),currentPv=Number(current.pv_mln);if(!Number.isFinite(candidatePv))return false;if(!Number.isFinite(currentPv))return true;if(candidatePv!==currentPv)return candidatePv<currentPv;
  return Number.isFinite(Number(candidate.capex_mln))&&Number.isFinite(Number(current.capex_mln))&&Number(candidate.capex_mln)<Number(current.capex_mln);
}
function rankedAlternatives(r){
  const mode=$('scenario').value;
  return (r.alternatives||[]).map(alternative=>({alternative,evaluation:alternative.evaluation||alternative.comparison?.find(item=>item.scenario_mode===mode)||alternative.comparison?.[0]})).filter(({evaluation})=>alternativeIsBetter(evaluation?.summary,r.summary)).sort((left,right)=>Number(left.evaluation.summary.pv_mln)-Number(right.evaluation.summary.pv_mln)||Number(left.evaluation.summary.capex_mln)-Number(right.evaluation.summary.capex_mln));
}
const SVG_NS='http://www.w3.org/2000/svg';
function svgNode(name,attributes={},text){const node=document.createElementNS(SVG_NS,name);for(const [key,value]of Object.entries(attributes))node.setAttribute(key,String(value));if(text!==undefined)node.textContent=text;return node;}
function trendInventoryAt(points,at){
  if(at<=points[0].at)return points[0].inventory_t;
  for(let index=1;index<points.length;index++){
    const current=points[index];if(at>current.at)continue;const previous=points[index-1],share=(at-previous.at)/Math.max(1,current.at-previous.at);return previous.inventory_t+(current.inventory_t-previous.inventory_t)*share;
  }
  return points.at(-1).inventory_t;
}
function renderInventoryChart(r){
  const card=$('inventory-chart-card'),root=$('inventory-chart'),timeline=r.inventory_timeline||{},points=(timeline.points||[]).map(point=>({...point,at:Number(point.at),inventory_t:Number(point.inventory_t),capacity_t:Number(point.capacity_t),arrival_t:Number(point.arrival_t),deliveries:(point.deliveries||[]).map(delivery=>({...delivery,gross_t:Number(delivery.gross_t)}))})).filter(point=>Number.isFinite(point.at)&&Number.isFinite(point.inventory_t)&&Number.isFinite(point.capacity_t));
  const arrivals=points.filter(point=>point.kind==='arrival'&&point.arrival_t>0),trendPoints=[...new Map(points.filter(point=>point.kind==='sample'||point.kind==='boundary').map(point=>[point.at,point])).values()];
  root.replaceChildren();card.hidden=true;if(points.length<2||trendPoints.length<2)return;
  const reserves=(timeline.reserve_markers||[]).map(point=>({...point,at:Number(point.at),required_reserve_t:Number(point.required_reserve_t)})).filter(point=>Number.isFinite(point.at)&&Number.isFinite(point.required_reserve_t));
  const capacityChanges=[];let previousCapacity=points[0].capacity_t;for(const point of points.slice(1)){if(point.capacity_t!==previousCapacity){capacityChanges.push({at:point.at,from:previousCapacity,to:point.capacity_t,storageId:point.storage_id});previousCapacity=point.capacity_t;}}
  const emergencyArrivals=arrivals.filter(point=>point.deliveries.some(delivery=>delivery.source==='E'));
  card.hidden=false;const width=Math.max(320,root.clientWidth||900),height=width<520?270:300,pad={left:width<520?48:58,right:width<520?12:22,top:18,bottom:42},plotWidth=width-pad.left-pad.right,plotHeight=height-pad.top-pad.bottom,minX=Math.min(...points.map(point=>point.at)),maxX=Math.max(...points.map(point=>point.at)),maxValue=Math.max(...points.flatMap(point=>[point.inventory_t,point.capacity_t]),...reserves.map(point=>point.required_reserve_t),1),tickStep=Math.max(10,Math.ceil(maxValue/40)*10),axisMax=tickStep*4,domainMax=axisMax*1.055;
  const x=value=>pad.left+(value-minX)/Math.max(1,maxX-minX)*plotWidth,y=value=>pad.top+(1-value/domainMax)*plotHeight;
  const legend=el('div',undefined,'chart-legend'),legendItems=[['Запас на конец месяца','inventory'],['Вместимость склада','capacity'],['Норматив на начало года','reserve'],['Событие поставки','arrival']];if(emergencyArrivals.length)legendItems.push(['Канал E','emergency']);for(const [label,kind]of legendItems){const item=el('span',undefined,'chart-legend-item'),mark=el('i',undefined,`chart-legend-mark ${kind}`);mark.setAttribute('aria-hidden','true');item.append(mark,document.createTextNode(label));legend.append(item);}
  const svg=svgNode('svg',{viewBox:`0 0 ${width} ${height}`,'aria-hidden':'true',focusable:'false'}),frame=svgNode('g',{class:'chart-frame'});
  const defs=svgNode('defs'),gradient=svgNode('linearGradient',{id:'inventory-area-gradient',x1:'0',x2:'0',y1:'0',y2:'1'});gradient.append(svgNode('stop',{offset:'0%','stop-color':'#2f63a8','stop-opacity':'.17'}),svgNode('stop',{offset:'100%','stop-color':'#2f63a8','stop-opacity':'.015'}));defs.append(gradient);svg.append(defs);
  for(let index=0;index<=4;index++){const value=tickStep*index,py=y(value);frame.append(svgNode('line',{x1:pad.left,y1:py,x2:width-pad.right,y2:py,class:'chart-grid-line'}),svgNode('text',{x:pad.left-10,y:py+4,class:'chart-axis-label','text-anchor':'end'},fmt(value,0)));}
  const firstYear=Number(pkg?.plan?.first_year||2035),lastYear=Number(pkg?.plan?.last_year||2040),yearStep=width<520?2:1;for(let year=firstYear;year<=lastYear;year+=yearStep){const at=(year-2035)*365;if(at<minX||at>maxX)continue;const px=x(at);frame.append(svgNode('line',{x1:px,y1:pad.top,x2:px,y2:height-pad.bottom,class:'chart-year-line'}),svgNode('text',{x:px,y:height-16,class:'chart-axis-label','text-anchor':year===firstYear?'start':'middle'},String(year)));}
  frame.append(svgNode('text',{x:16,y:pad.top+plotHeight/2,class:'chart-axis-title',transform:`rotate(-90 16 ${pad.top+plotHeight/2})`,'text-anchor':'middle'},'Запас, т'));
  const inventoryPath=trendPoints.map((point,index)=>`${index?'L':'M'}${x(point.at).toFixed(2)},${y(point.inventory_t).toFixed(2)}`).join(' '),inventoryArea=`${inventoryPath} L${x(trendPoints.at(-1).at).toFixed(2)},${y(0).toFixed(2)} L${x(trendPoints[0].at).toFixed(2)},${y(0).toFixed(2)} Z`;
  let capacityPath=`M${x(points[0].at).toFixed(2)},${y(points[0].capacity_t).toFixed(2)}`;for(const change of capacityChanges)capacityPath+=` H${x(change.at).toFixed(2)} V${y(change.to).toFixed(2)}`;capacityPath+=` H${x(maxX).toFixed(2)}`;
  frame.append(svgNode('path',{d:inventoryArea,class:'chart-inventory-area'}),svgNode('path',{d:capacityPath,class:'chart-capacity-line'}),svgNode('path',{d:inventoryPath,class:'chart-inventory-line'}));
  for(const change of capacityChanges){const px=x(change.at),py=y(change.to),anchor=px>width-210?'end':'start',tx=px+(anchor==='end'?-8:8),label=`Ввод ${change.storageId}: ${fmt(change.from)} → ${fmt(change.to)} т`,dot=svgNode('circle',{cx:px,cy:py,r:3.5,class:'chart-storage-point'});dot.append(svgNode('title',{},`${humanDate(change.at)}: ${label.toLowerCase()}`));frame.append(dot,svgNode('text',{x:tx,y:Math.min(height-pad.bottom-8,Math.max(pad.top+13,py+16)),class:'chart-storage-label','text-anchor':anchor},label));}
  for(const marker of reserves){if(marker.at<minX||marker.at>maxX)continue;const dot=svgNode('circle',{cx:x(marker.at),cy:y(marker.required_reserve_t),r:4.5,class:'chart-reserve-point'});dot.append(svgNode('title',{},`${marker.year}: норматив ${fmt(marker.required_reserve_t)} т`));frame.append(dot);}
  for(const point of arrivals){const sources=[...new Set(point.deliveries.map(delivery=>delivery.source))],emergency=sources.includes('E'),dot=svgNode('circle',{cx:x(point.at),cy:y(trendInventoryAt(trendPoints,point.at)),r:emergency?4:2.3,class:`chart-arrival-point${emergency?' emergency':''}`}),sourceText=sources.length?` по каналам ${sources.join(', ')}`:'';dot.append(svgNode('title',{},`${humanDate(point.at)}: поставка${sourceText}, ${fmt(point.arrival_t)} т; запас после поступления ${fmt(point.inventory_t)} т`));frame.append(dot);}
  const stoppedAt=timeline.stopped_at===null||timeline.stopped_at===undefined||timeline.stopped_at===''?NaN:Number(timeline.stopped_at);if(Number.isFinite(stoppedAt)){const candidates=points.filter(point=>Math.abs(point.at-stoppedAt)<1e-6),stopped=candidates.sort((a,b)=>b.inventory_t-a.inventory_t)[0];if(stopped){const px=x(stopped.at),py=y(stopped.inventory_t),anchor=px>width-190?'end':'start',tx=px+(anchor==='end'?-10:10);frame.append(svgNode('circle',{cx:px,cy:py,r:6,class:'chart-stop-point'}),svgNode('text',{x:tx,y:Math.max(pad.top+12,py-12),class:'chart-stop-label','text-anchor':anchor},`Переполнение ${humanDate(stopped.at)}`));}}
  const storageSummary=capacityChanges.map(change=>` ${humanDate(change.at)} введено ${change.storageId}, вместимость ${fmt(change.from)} → ${fmt(change.to)} тонн.`).join('');svg.append(frame);root.append(legend,svg);root.setAttribute('aria-label',`Запас на конец месяца: от ${fmt(trendPoints[0].inventory_t)} до ${fmt(trendPoints.at(-1).inventory_t)} тонн. Событий поставки: ${arrivals.length}. Поставок по каналу E: ${emergencyArrivals.length}.${storageSummary}${Number.isFinite(stoppedAt)?` Расчёт остановлен ${humanDate(stoppedAt)} из-за переполнения.`:''}`);
}
function renderAlternativesChart(r,visible){
  const root=$('alternatives-chart');root.replaceChildren();root.hidden=true;
  const rows=[],current=r.summary||{},hasCurrentPv=current.pv_mln!==null&&current.pv_mln!==undefined&&current.pv_mln!==''&&Number.isFinite(Number(current.pv_mln));if(hasCurrentPv)rows.push({label:'Текущий план',pv:Number(current.pv_mln),summary:current,current:true,recommended:false});
  for(const [index,{alternative,evaluation}]of visible.entries()){const summary=evaluation.summary;if(Number.isFinite(Number(summary.pv_mln)))rows.push({label:alternative.label,pv:Number(summary.pv_mln),summary,current:false,recommended:index===0});}
  if(!rows.length)return;const max=Math.max(...rows.map(row=>row.pv),1),axis=el('p','PV, млн — меньше лучше','pv-chart-axis');root.append(axis);
  for(const row of rows){const item=el('div',undefined,`pv-chart-row${row.recommended?' recommended':''}${row.current?' current':''}`),copy=el('div',undefined,'pv-chart-copy'),title=el('strong',row.label),meta=[];if(row.recommended)meta.push('Рекомендуемый');if(row.current&&Number(row.summary.shortage_t)>0)meta.push(`Дефицит ${fmt(row.summary.shortage_t)} т`);else if(row.current&&row.summary.status!=='FEASIBLE')meta.push('Есть ограничения');copy.append(title);if(meta.length)copy.append(el('span',meta.join(', ')));const plot=el('div',undefined,'pv-chart-plot'),bar=el('span',undefined,'pv-chart-bar');bar.style.width=`${Math.max(2,row.pv/max*100)}%`;plot.append(bar);item.append(copy,plot,el('strong',`${fmt(row.pv)} млн`,'pv-chart-value'));root.append(item);}
  root.setAttribute('aria-label',`Сравнение PV: ${rows.map(row=>`${row.label}, ${fmt(row.pv)} млн`).join('; ')}.`);root.hidden=false;
}
function renderAlternatives(r){
  const root=$('alternatives'),card=$('alternatives-card'),items=r.alternatives||[];root.replaceChildren();card.hidden=true;if(!items.length)return;
  const search=r.alternatives_search||{},visible=rankedAlternatives(r);
  card.hidden=!visible.length;
  renderAlternativesChart(r,visible);
  if(visible.length){const count=Number(search.screened_candidates),feasible=Number(search.feasible_candidates),shown=visible.length===1?'Показан лучший.':`Показаны ${visible.length} лучших.`;$('alternatives-summary').textContent=Number.isFinite(count)&&count>0&&Number.isFinite(feasible)?`${feasible} из ${count} вариантов допустимы. ${shown}`:'Лучшие допустимые планы для выбранных условий.';}
  const hasNumber=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value));
  for(const [index,{alternative,evaluation}] of visible.entries()){
    const s=evaluation.summary,d=alternative.delta||{},isFeasible=s.status==='FEASIBLE',row=el('article',undefined,`alternative${isFeasible?' alternative-feasible':''}`),intro=el('div'),metrics=el('div',undefined,'alternative-metrics'),apply=el('button','Использовать','secondary compact');
    const added=Array.isArray(d.added_sources)?d.added_sources.filter(Boolean):[],removed=Array.isArray(d.removed_sources)?d.removed_sources.filter(Boolean):[];
    intro.append(el('h4',alternative.label),el('p',index===0?'Рекомендуемый':'Допустимый',isFeasible?'alternative-state feasible':'alternative-state'));
    const values=[];
    if(hasNumber(s.pv_mln))values.push(['PV',`${fmt(s.pv_mln)} млн`]);
    if(hasNumber(s.capex_mln))values.push(['CAPEX',`${fmt(s.capex_mln)} млн`]);
    if(added.length||removed.length)values.push(['Состав',[added.length?`+${added.join(', ')}`:'',removed.length?`−${removed.join(', ')}`:''].filter(Boolean).join('  ')]);
    for(const [label,value]of values){const metric=el('div',undefined,'alternative-metric');metric.append(el('small',label),el('strong',value));metrics.append(metric);}
    apply.onclick=async()=>{if(!await confirmAction('Заменить текущий план выбранной альтернативой? Спрос, цены и CASE_INPUT останутся без изменений.'))return;pkg=clone(alternative.package);dirtySections=new Set(['contracts','orders','investments']);calculationAcknowledged=false;lastCalculatedSections=[];builderDirty=false;matrixDirty=false;renderAll(true);refreshResultFreshness();saveDraft();message('Альтернативный состав загружен. После пересчёта показатели станут текущими.','warning');};
    row.append(intro);if(values.length)row.append(metrics);row.append(apply);root.append(row);
  }
}
function kpiSignal(key,s){
  const raw=s[key],value=Number(raw),epsilon=1e-9;if(raw===null||raw===undefined||!Number.isFinite(value))return null;
  if(key==='worst_total_service'||key==='worst_critical_service'){
    if(value>=1-epsilon)return {state:'ideal',label:'Идеал'};
    const target=key==='worst_total_service'?.97:.99;
    return value>=target-epsilon?{state:'good',label:'Цель выполнена'}:{state:'warning',label:`Ниже цели ${pct(target)}`};
  }
  if(key==='shortage_t'||key==='critical_shortage_t')return Math.abs(value)<=epsilon?{state:'ideal',label:'Без дефицита'}:{state:'warning',label:'Есть дефицит'};
  if(key==='minimum_reserve_margin_t')return value>=-epsilon?{state:'good',label:'Норма выполнена'}:{state:'warning',label:'Ниже норматива'};
  return null;
}
function showResult(r){
  lastResult=r;lastResultInputHash=currentResultInputHash();attentionOrderIds=new Set((overflowDiagnostic(r)?.deliveries||[]).map(d=>d.id));$('result').hidden=false;$('result-empty').hidden=true;const s=r.summary,rows=r.violations||[];
  $('result-title').textContent=labels[s.status]||'Результат расчёта';$('result-meta').textContent=`${scenarioLabels[s.scenario_id]||s.scenario_id} / ${planLabel()}`;$('result-meta-details').open=false;$('result-meta-technical').textContent=`Данные: ${s.data_version||pkg.dataset.dataset_id}. Политика: ${s.policy_version||pkg.plan.policy.policy_id}. Рассчитано: ${fmtTime(s.calculated_at_utc)}.`;
  const [badge,badgeClass]=badgeStates[s.status]||['Проверьте результат','warning'];$('result-badge').textContent=badge;$('result-badge').className=`badge ${badgeClass}`;
  let [summaryTitle,summaryText]=resultStates[s.status]||['Проверьте результат','Посмотрите подробности расчёта ниже.'];if(s.status==='STOPPED_OVERFLOW')summaryTitle=overflowSummaryTitle(r);
  const summary=$('result-explanation'),summaryBody=resultSummaryText(s,r,rows,summaryText);summary.replaceChildren(el('h3',summaryTitle));if(summaryBody)summary.append(el('p',summaryBody));
  configureResultActions(rows,r);if(s.status==='STOPPED_OVERFLOW'&&rows[0]?.code==='STORAGE_OVERFLOW')appendOverflowDetails(summary,r,rows[0]);
  summary.className=`result-summary ${s.status==='FEASIBLE'?'success':s.status==='INVALID_PLAN'||s.status==='STOPPED_OVERFLOW'?'danger':'warning'}`;
  renderInventoryChart(r);
  const metrics=[['total_mln','Общие затраты','млн у.е.',fmt],['pv_mln','Приведённая стоимость','млн у.е. / PV',fmt],['capex_mln','Инвестиции','млн у.е. / CAPEX',fmt],['shortage_t','Общий дефицит','тонн',fmt],['critical_shortage_t','Критический дефицит','тонн',fmt],['worst_total_service','Худший общий сервис','доля спроса',pct],['worst_critical_service','Худший критический сервис','доля критического спроса',pct],['minimum_inventory_t','Минимальный запас','тонн',fmt],['final_inventory_t','Конечный запас','тонн',fmt],['minimum_reserve_margin_t','Минимум сверх норматива','тонн',fmt]];
  const hasMetrics=metrics.some(([key])=>s[key]!==null&&s[key]!==undefined);$('kpis').hidden=!hasMetrics;$('kpis').replaceChildren();
  if(hasMetrics)for(const [key,title,unit,formatter]of metrics){const card=el('div',undefined,'kpi'),signal=kpiSignal(key,s);card.dataset.metric=key;if(signal){card.dataset.state=signal.state;card.setAttribute('aria-label',`${title}: ${formatter(s[key])}. ${signal.label}`);}card.append(el('small',title),el('strong',s[key]===null||s[key]===undefined?'Не рассчитано':formatter(s[key])),el('em',unit));if(signal)card.append(el('span',signal.label,'kpi-status'));$('kpis').append(card);}
  $('annual-card').hidden=!r.annual.length;if(r.annual.length)table($('annual'),['Год','Начало, т','Норматив, т','Пришло, т','Потери, т','Выдано, т','Остаток, т','Дефицит, т','Крит. дефицит, т','Общий сервис','Крит. сервис'],r.annual,(tr,a)=>{cell(tr,String(a.year));for(const key of ['opening_t','required_reserve_t','gross_t','losses_t','served_t','closing_t','shortage_t','shortage_critical_t'])cell(tr,fmt(a[key]));cell(tr,pct(a.total_service));cell(tr,pct(a.critical_service));});else $('annual').replaceChildren();
  const components=r.components_mln||{},costRows=[['procurement','Закупки / TOP'],['reservation','Резервирование мощности'],['holding','Хранение'],['fixed_opex','OPEX'],['capex','CAPEX']].map(([key,label])=>({label,value:components[key]}));$('cost-card').hidden=!Object.keys(components).length;if(Object.keys(components).length)table($('cost-breakdown'),['Статья','Стоимость, млн у.е.'],costRows,(tr,row)=>{cell(tr,row.label);cell(tr,fmt(row.value));});else $('cost-breakdown').replaceChildren();
  renderAlternatives(r);const compactOverflow=s.status==='STOPPED_OVERFLOW'&&rows.length===1&&rows[0].code==='STORAGE_OVERFLOW',severity={INVALID_PLAN:'Нет полного прогноза',STOPPED_OVERFLOW:'Прогноз ограничен',INFEASIBLE:'Влияет на результат',TARGETS_MISSED:'Сервис ниже цели'}[s.status]||'Требует внимания';$('violations-card').hidden=!rows.length||compactOverflow;$('violations-title').textContent='Ограничения текущего плана';$('violations-summary').textContent=severity;$('violations-summary').className=`violation-severity severity-${s.status==='INVALID_PLAN'||s.status==='STOPPED_OVERFLOW'?'stopped':s.status==='TARGETS_MISSED'?'target':'failed'}`;$('violations').replaceChildren();
  for(const v of rows){const [title]=violations[v.code]||['Ограничение модели'];const item=el('article',undefined,'violation'),copy=el('div',undefined,'violation-copy'),fix=el('p',undefined,'violation-fix'),details=el('details',undefined,'violation-technical');copy.append(el('span',severity,'violation-level'),el('strong',title),el('p',violationFact(v,r)));fix.append(el('strong','Возможное решение: '),document.createTextNode(violationHelp(v,r)));details.append(el('summary','Технические детали'),el('code',v.code),el('span',`Факт: ${fmt(v.actual)}. Предел: ${fmt(v.limit)}.`));item.append(copy,fix,details);$('violations').append(item);}
  $('downloads').replaceChildren();for(const [file,title]of [['run-package.zip','Единый пакет ZIP'],['manifest.json','Метаданные и единицы JSON'],['report.html','Отчёт HTML'],['input-package.json','Входные данные JSON'],['annual.csv','Годовой баланс CSV'],['payments.csv','Платежи CSV'],['deliveries.csv','Поставки CSV'],['contracts.csv','Контракты CSV'],['violations.csv','Нарушения CSV'],['inventory.csv','Запасы CSV (компактно)']]){const a=el('a',title),downloadUrl=r.download_urls?.[file];if(downloadUrl)a.href=downloadUrl;else if(r.run_url)a.href=r.run_url+file;else{a.setAttribute('aria-disabled','true');a.title='Для автоматической сравнительной проверки отдельный файл не создавался';}a.target='_blank';a.rel='noopener';if(downloadUrl)a.download=file;$('downloads').append(a);}refreshResultFreshness();controls();
}
function scenarioHelp(){const texts={BASE:'Проверяет текущий график при базовом спросе и исходных ценах. Поставки автоматически не перестраиваются.',MANDATORY_STRESS:'С 2038 спрос +15%; цены A/B +25% в 2038-2039; выпуск D составляет 55% и 75%. Ограничение потерь: 2%.',LOW:'Проверяет текущий график при низком спросе. Топливо расходуется медленнее, поэтому склад может переполниться.',HIGH:'Проверяет текущий график при высоком спросе. Поставки автоматически не перестраиваются.',SAVED:'Использует точные условия из загруженного пакета, включая исследовательские сценарии.'};$('scenario-help').textContent=texts[$('scenario').value];refreshResultFreshness();controls();}
function orderFloor(c){const source=pkg.dataset.sources[c.source],investment=source?.investment_id&&pkg.plan.investments.find(i=>i.id===source.investment_id);return investment?.commissioned_at===undefined?null:F.number(investment.commissioned_at);}
function validOrderDates(order,c){const bounds=contractBounds(c),ordered=F.number(order.ordered_at),arrival=F.number(order.arrival_at),decision=F.number(c.decision_at??order.ordered_at),floor=orderFloor(c),earliest=Math.max(ordered+contractLead(c).days,floor??-Infinity);if(ordered<decision)return 'Заказ раньше решения по контракту';if(floor!==null&&ordered<floor)return 'Заказ раньше ввода источника';if(arrival<earliest-1e-9)return 'Поступление раньше допустимого lead time';if(arrival<bounds.start||arrival>=bounds.end)return 'Поступление вне периода контракта';return '';}
function newOrderForContract(c){const bounds=contractBounds(c),lead=contractLead(c).days,decision=F.number(c.decision_at??bounds.start-lead),floor=orderFloor(c),ordered=Math.ceil(Math.max(decision,floor??-Infinity,bounds.start-lead)),arrival=Math.ceil(Math.max(bounds.start,ordered+lead));if(arrival>=bounds.end)throw Error(`Для ${c.id} нет допустимой даты поступления после решения и lead time. Измените период контракта.`);return {id:'ORDER-'+Date.now(),contract_id:c.id,ordered_at:String(ordered),arrival_at:String(arrival),planned_t:'0',role:['contingent_backup','emergency'].includes(c.role)?'emergency':'planned'};}
async function loadDefault(){pkg=(await request('/api/default')).package;lastResult=null;lastResultInputHash=null;attentionOrderIds=new Set();dirtySections.clear();builderDirty=false;matrixDirty=false;rawDirty=false;calculationAcknowledged=false;lastCalculatedSections=[];$('result').hidden=true;$('result').classList.remove('result-stale');delete $('result').dataset.state;$('result-empty').hidden=false;$('scenario').value='BASE';renderAll(true);scenarioHelp();saveDraft();message('Готовый план загружен. Нажмите «Рассчитать план» или настройте данные.');}
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
$('mobile-section-nav').onchange=()=>switchPanel($('mobile-section-nav').value);
$('scenario').onchange=()=>{dirtySections.add('conditions');calculationAcknowledged=false;scenarioHelp();updateCalculationStatus();saveDraft();};
for(const id of ['strategy','reserve','profile','zbo','e-insurance'])$(id).addEventListener('input',()=>{builderDirty=true;dirtySections.add('overview');calculationAcknowledged=false;$('build-hint').textContent='Новые настройки ещё не применены. Нажмите «Построить план».';refreshResultFreshness();updateCalculationStatus();saveDraft();controls();});
function validateReserve(show=false){const input=$('reserve'),value=Number(input.value.trim().replace(',','.')),valid=Number.isInteger(value)&&value>=45&&value<=120;input.setCustomValidity(valid?'':'Введите целое число от 45 до 120');input.toggleAttribute('aria-invalid',!valid);if(valid)input.setAttribute('aria-valuetext',`${value} дней`);else input.removeAttribute('aria-valuetext');if(show&&!valid)input.reportValidity();return valid;}
$('reserve').addEventListener('input',()=>validateReserve(false));
for(const [id,delta]of [['reserve-minus',-1],['reserve-plus',1]])$(id).onclick=()=>{const input=$('reserve'),min=Number(input.min),max=Number(input.max),current=Number(input.value),next=Math.min(max,Math.max(min,(Number.isFinite(current)?current:min)+delta));input.value=next;input.dispatchEvent(new Event('input',{bubbles:true}));};
$('order-bulk-shift').addEventListener('input',()=>{const value=Number($('order-bulk-shift').value.trim().replace(',','.'));if(Number.isInteger(value))$('order-bulk-shift').setAttribute('aria-valuetext',`${value} дней`);else $('order-bulk-shift').removeAttribute('aria-valuetext');});
function orderFiltersChanged(){orderPage=1;try{valid();renderOrders();controls();}catch(e){message(e.message,'error');}}
$('contract-year').onchange=()=>{try{valid();renderContracts();controls();}catch(e){message(e.message,'error');}};
for(const id of ['order-year','order-source','order-group','order-page-size'])$(id).onchange=orderFiltersChanged;
$('order-search').oninput=orderFiltersChanged;
$('order-prev').onclick=()=>{orderPage--;renderOrders();};$('order-next').onclick=()=>{orderPage++;renderOrders();};
$('order-bulk-apply').onclick=()=>task(async()=>{valid();const selected=pkg.plan.orders.filter(o=>selectedOrderIds.has(o.id));if(!selected.length)throw Error('Сначала выберите поставки.');const contractId=$('order-bulk-contract').value,shift=Number($('order-bulk-shift').value.replace(',','.'));if(!Number.isFinite(shift)||!Number.isInteger(shift))throw Error('Сдвиг дат должен быть целым числом дней.');const drafts=selected.map(order=>{const next={...order,contract_id:contractId||order.contract_id,ordered_at:String(F.number(order.ordered_at)+shift),arrival_at:String(F.number(order.arrival_at)+shift)},contract=pkg.plan.contracts.find(c=>c.id===next.contract_id),problem=contract&&validOrderDates(next,contract);if(!contract)throw Error(`Для ${order.id} не найден контракт.`);if(problem)throw Error(`${order.id}: ${problem}. Массовое изменение отменено.`);return [order,next];});for(const [order,next]of drafts)Object.assign(order,next);changed();renderOrders();message(`Обновлено поставок: ${drafts.length}.`,'success');});
$('order-bulk-delete').onclick=()=>task(async()=>{valid();const selected=pkg.plan.orders.filter(o=>selectedOrderIds.has(o.id));if(!selected.length)throw Error('Сначала выберите поставки.');if(!await confirmAction(`Удалить выбранные поставки (${selected.length})?`))return;pkg.plan.orders=pkg.plan.orders.filter(o=>!selectedOrderIds.has(o.id));selectedOrderIds.clear();changed();renderOrders();message(`Удалено поставок: ${selected.length}.`,'success');});
$('apply-supply-matrix').onclick=async()=>{const bad=document.querySelector('#supply-matrix [aria-invalid="true"]');if(bad){bad.focus();bad.reportValidity();message('Исправьте объёмы в годовом плане поставок.','error');return;}if(!matrixDirty){message('Годовой план поставок не изменён.','warning');return;}if(!await confirmAction('Применить годовой план поставок? Ручные плановые контракты и партии будут заменены. Начальный запас и оплаченный резерв E сохранятся.'))return;task(async()=>{buildPlanFromMatrix();matrixDirty=false;changed(false,'annual_supply');syncAnnualSupplyDraft(true);renderAll();message('Годовой план применён. Подробные контракты и партии сформированы; выполните пересчёт.','success');});};
$('export-history').onclick=()=>{if(!runs.length){message('История пуста. Сначала выполните расчёт.','warning');return;}exportHistory();message('История сравнения передана браузеру для сохранения.','success');};
$('cleanup-runs').onclick=async()=>{if(!await confirmAction('Удалить сохранённые сервером каталоги ручных расчётов? Ссылки старой истории перестанут работать. Текущий план не изменится.'))return;task(async()=>{const result=await request('/api/cleanup',{});runs=[];saveDraft();renderHistory();message(`Удалено каталогов: ${result.removed}. Освобождено ${fmt(result.reclaimed_bytes/1024/1024)} МБ.`,'success');});};
$('reset').onclick=async()=>{if(await confirmAction('Вернуть базовый план? Текущие правки будут заменены. История расчётов останется.'))task(loadDefault);};
$('back-base').onclick=()=>task(async()=>{pkg.plan=clone(pkg.reference_plan);pkg.reference_plan=null;changed();renderAll(true);message('Исходный план восстановлен. Можно менять данные или повторить реакцию.');});
$('build').onclick=async()=>{
  try{valid();if(!validateReserve(true))return;}catch(e){message(e.message,'error');return;}
  task(async()=>{const r=await request('/api/run',{action:'build',package:pkg,strategy:$('strategy').value,reserve_days:$('reserve').value,profile:$('profile').value,zbo:$('zbo').checked,e_insurance:$('e-insurance').checked});pkg=r.package;$('scenario').value=$('profile').value;builderDirty=false;changed(false,'overview');renderAll(true);scenarioHelp();$('build-hint').textContent='Начальный график построен. Его можно сочетать и править вручную, затем рассчитать.';message('Шаблон создал начальный график. Нажмите «Рассчитать план» или уточните годовую таблицу.','success');});
};
function startCalculation(action='evaluate'){try{valid();if(builderDirty)throw Error('Настройки шаблона изменены. Сначала нажмите «Построить план».');if(matrixDirty)throw Error('Годовая таблица изменена. Сначала нажмите «Применить таблицу».');}catch(e){message(e.message,'error');return;}const pendingSections=[...new Set([...dirtySections].map(key=>sectionLabels[key]||key))];task(async()=>{message(action==='adapt'?'Добавляем реакцию и проверяем ограничения…':'Считаем поставки, запасы и затраты…');const r=await request('/api/run',{action,package:pkg,scenario:$('scenario').value});pkg=r.package;markCalculated(pendingSections);renderAll();showResult(r);const name=planLabel(),comparisonKey=rememberComparison(r.comparison||[],pkg,name);if(!['BASE','MANDATORY_STRESS'].includes(r.summary.scenario_id)){const primary={summary:r.summary,annual:r.annual,violations:r.violations,diagnostics:r.diagnostics,components_mln:r.components_mln,run_url:r.run_url,scenario_mode:r.scenario_mode};runs.unshift(runRecord(primary,pkg,name,'user',comparisonKey));}for(const alternative of r.alternatives||[])rememberComparison(alternative.comparison,alternative.package,`Альтернатива: ${alternative.label}`,'assistant');renderHistory();saveDraft();const stopped=['INVALID_PLAN','STOPPED_OVERFLOW'].includes(r.summary.status),needsWork=['INFEASIBLE','TARGETS_MISSED'].includes(r.summary.status),changedText=pendingSections.length?`Пересчитаны изменения: ${joinRussian(pendingSections)}. `:'';message(stopped?`${changedText}Прогноз ограничен текущим графиком поставок.`:needsWork?`${changedText}Расчёт показывает ограничения текущего плана.`:action==='adapt'?`${changedText}Реакция рассчитана. Исходный план доступен по кнопке сверху.`:`${changedText}Расчёт выполнен для текущего плана.`,stopped||needsWork?'warning':'success');$('result').scrollIntoView({block:'start',behavior:'auto'});});}
$('evaluate').onclick=()=>startCalculation('evaluate');$('adapt').onclick=()=>startCalculation('adapt');
$('add-source').onclick=()=>task(async()=>{valid();F.research(pkg);const id=nextSourceId();pkg.dataset.sources[id]={source_id:id,name:'Новый поставщик',capacity_t_per_year:'40',variable_cost_mln_per_t:'8',reservation_rate_mln_per_t_year_capacity:'0.2',take_or_pay_share:'0',lead_time_min_value:'3',lead_time_max_value:'3',lead_time_unit:'month',reliability_profile:'unknown:user_assumption',available_from_year:'2035',status:'RESEARCH_INPUT',notes:'',include_in_research_planner:true};changed(false,'sources');renderAll();message(`Поставщик ${id} добавлен. Заполните комментарий и допущение надёжности; оно не применяется к BASE автоматически.`,'warning');});
$('add-contract').onclick=()=>task(async()=>{valid();const year=Number($('contract-year').value||2035),source=Object.keys(pkg.dataset.sources)[0],id=nextContractId();pkg.plan.contracts.push({id,source,year,reserved_annual:'0',decision_at:String((year-2035)*365-365),role:'planned'});changed(false,'contracts');renderAll();message(`Контракт ${id} добавлен. Выберите поставщика и резерв мощности.`);});
$('add-order').onclick=()=>task(async()=>{valid();const year=$('order-year').value||String(pkg.plan.first_year),source=$('order-source').value,candidates=pkg.plan.contracts.filter(c=>String(c.year)===year&&(!source||c.source===source)&&c.role!=='opening_inventory');if(!candidates.length)throw Error('Нет подходящего контракта. Добавьте его в разделе «Контракты» или измените фильтры.');if(!source&&candidates.length>1)throw Error('Выберите поставщика: в этом году доступно несколько совместимых контрактов.');const order=newOrderForContract(candidates[0]);pkg.plan.orders.push(order);orderPage=1;changed();renderOrders();message(`Поставка добавлена по ${candidates[0].id}. Даты уже учитывают решение, ввод источника и lead time.`,'success');});
$('research').onclick=()=>task(async()=>{valid();F.research(pkg);changed(false,'investments');renderAll();message('Исследовательская копия создана. Сроки можно изменять свободно; режим отмечен бейджем.','success');});
$('extension').onclick=async()=>{if(!await confirmAction('Открыть отдельный пример 2041 + источник X? Текущий черновик будет заменён.'))return;task(async()=>{pkg=(await request('/api/run',{action:'build',extension:true,strategy:'EARTH_NEW',reserve_days:45})).package;changed();renderAll(true);$('scenario').value='BASE';scenarioHelp();switchPanel('overview');message('Открыт исследовательский пример с синтетическими данными 2041 года.');});};
$('json').oninput=()=>{rawDirty=true;dirtySections.add('json');calculationAcknowledged=false;$('save-status').textContent='JSON не применён';refreshResultFreshness();updateCalculationStatus();controls();};
$('apply').onclick=()=>task(async()=>{const next=F.validatePackage(JSON.parse($('json').value));pkg=next;rawDirty=false;changed(false,'json');renderAll(true);message('Пакет применён. Полная проверка ограничений выполняется при расчёте.');});
$('save').onclick=()=>task(async()=>{valid();const blob=new Blob([JSON.stringify(pkg,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='cosmo-input-package.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Файл передан браузеру для сохранения. Его можно открыть здесь позже.');});
$('open-button').onclick=()=>$('open').click();
$('open').onchange=async()=>{const file=$('open').files[0];if(!file)return;if(!await confirmAction('Открыть сохранённый план вместо текущего черновика?')){$('open').value='';return;}task(async()=>{try{if(file.size>4000000)throw Error('Файл больше 4 МБ');const next=F.validatePackage(JSON.parse(await file.text()));pkg=next;rawDirty=false;dirtySections=new Set(['json']);calculationAcknowledged=false;lastCalculatedSections=[];builderDirty=false;matrixDirty=false;renderAll(true);$('scenario').value='SAVED';scenarioHelp();saveDraft();message('План открыт. Нажмите «Рассчитать план» для воспроизведения результата.');}finally{$('open').value='';}});};
window.addEventListener('beforeunload',e=>{if(rawDirty||matrixDirty||dirtySections.size||document.querySelector('[aria-invalid=true]')){e.preventDefault();e.returnValue='';}});
task(async()=>{let saved;try{saved=JSON.parse(localStorage.getItem(STORAGE));if([2,3].includes(saved?.version))F.validatePackage(saved.package);else saved=null;}catch{saved=null;}
  if(saved){pkg=saved.package;runs=Array.isArray(saved.runs)?saved.runs.slice(0,36):[];dirtySections=new Set(saved.version===3&&Array.isArray(saved.dirty_sections)?saved.dirty_sections:[]);calculationAcknowledged=!!saved.calculation_acknowledged;lastCalculatedSections=Array.isArray(saved.last_calculated_sections)?saved.last_calculated_sections:[];annualSupplyDraft=saved.annual_supply_draft||{};matrixDirty=!!saved.matrix_dirty;$('scenario').value=['BASE','MANDATORY_STRESS','LOW','HIGH','SAVED'].includes(saved.scenario)?saved.scenario:'BASE';renderAll(true,matrixDirty);if(saved.version===3&&saved.builder_dirty&&saved.builder_state){builderDirty=true;$('strategy').value=saved.builder_state.strategy;$('reserve').value=saved.builder_state.reserve;$('profile').value=saved.builder_state.profile;$('zbo').checked=!!saved.builder_state.zbo;$('e-insurance').checked=!!saved.builder_state.e_insurance;$('build-hint').textContent='Новые настройки ещё не применены. Нажмите «Построить план».';}scenarioHelp();updateCalculationStatus();message('Восстановлен ваш черновик. Чтобы начать заново, нажмите «Сбросить к базовому плану».');$('save-status').textContent='';}else await loadDefault();
});
