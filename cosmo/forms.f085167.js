'use strict';
// Pure, separately tested conversions. Original decimal/fraction values are never
// rounded back into the package merely because a control was rendered.
const CosmoForms = (() => {
  const months = [31,28,31,30,31,30,31,31,30,31,30,31];
  function number(value) {
    const parts=String(value).split('/');
    return parts.length===2 ? Number(parts[0])/Number(parts[1]) : Number(value);
  }
  function modelDate(value) {
    if(value===undefined||value===null||value==='')return '';
    const n=Math.floor(number(value)), year=2035+Math.floor(n/365);
    let day=((n%365)+365)%365, month=0;
    while(day>=months[month])day-=months[month++];
    return `${year}-${String(month+1).padStart(2,'0')}-${String(day+1).padStart(2,'0')}`;
  }
  function modelDay(value) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('Укажите дату полностью');
    const [year,month,day]=value.split('-').map(Number);
    if(month<1||month>12||day<1||day>months[month-1])throw Error('В модельном календаре нет этой даты (365 дней в году)');
    return String((year-2035)*365+months.slice(0,month-1).reduce((a,b)=>a+b,0)+day-1);
  }
  function research(pkg) {
    if(pkg.reference_plan)throw Error('Сначала вернитесь к исходному плану');
    if(pkg.dataset.scope==='RESEARCH_INPUT')return;
    const id='research-'+Date.now();
    pkg.dataset.scope='RESEARCH_INPUT';pkg.dataset.dataset_id=id;
    pkg.dataset.research_notes=[...(pkg.dataset.research_notes||[]),'Пользовательские изменения через формы; не данные организатора.'];
    pkg.plan.scope='RESEARCH_PLAN';pkg.plan.dataset_id=id;
    pkg.plan.plan_id+='-RESEARCH';
  }
  function validatePackage(pkg) {
    if(!pkg?.plan||!pkg?.dataset||!pkg?.scenario||!Array.isArray(pkg.plan.orders)||!Array.isArray(pkg.plan.contracts)||!Array.isArray(pkg.plan.investments)||!pkg.plan.policy||!pkg.dataset.sources||!pkg.dataset.demand)throw Error('Откройте пакет входных данных input-package.json, а не файл результата');
    return pkg;
  }
  function parsePackageText(text) {
    let pkg;
    try { pkg=JSON.parse(text); }
    catch (_) { throw Error('Файл не является корректным JSON'); }
    return validatePackage(pkg);
  }
  function strategy(plan) {
    const ids=new Set(plan.investments.map(x=>x.id));
    return ids.has('EARTH_NEW')?(ids.has('LUNAR_ISRU')?'HYBRID':'EARTH_NEW'):(ids.has('LUNAR_ISRU')?'LUNAR':'EARTH_ONLY');
  }
  function strategySources(value) {
    return ({
      EARTH_ONLY:['A','B','E'],
      EARTH_NEW:['A','B','C','E'],
      LUNAR:['A','B','D','E'],
      HYBRID:['A','B','C','D','E']
    }[value]||[]).slice();
  }
  function selectedSources(plan) {
    const saved=plan?.construction?.selected_sources;
    return Array.isArray(saved)&&saved.length?saved.slice():strategySources(strategy(plan));
  }
  function stableJson(value) {
    if(value===undefined)return '"__undefined__"';
    if(value===null||typeof value!=='object')return JSON.stringify(value);
    if(Array.isArray(value))return '['+value.map(stableJson).join(',')+']';
    return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+stableJson(value[key])).join(',')+'}';
  }
  function hash128(value) {
    const text=typeof value==='string'?value:stableJson(value);
    let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;
    for(let i=0,k;i<text.length;i++){
      k=text.charCodeAt(i);
      h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);
      h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);
    }
    h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);
    h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);
    h1^=h2^h3^h4;h2^=h1;h3^=h1;h4^=h1;
    return [h1,h2,h3,h4].map(n=>(n>>>0).toString(16).padStart(8,'0')).join('');
  }
  function resultInputHash(pkg,scenarioMode) {
    const scenario=scenarioMode==='SAVED'?pkg?.scenario:{scenario_id:scenarioMode};
    return hash128({
      plan:{current:pkg?.plan??null,reference:pkg?.reference_plan??null},
      dataset:pkg?.dataset??null,
      scenario,
      policy:pkg?.plan?.policy??null
    });
  }
  function planInputHash(pkg) {
    return hash128({
      plan:{current:pkg?.plan??null,reference:pkg?.reference_plan??null},
      dataset:pkg?.dataset??null,
      policy:pkg?.plan?.policy??null
    });
  }
  return {number,modelDate,modelDay,research,validatePackage,parsePackageText,strategy,strategySources,selectedSources,resultInputHash,planInputHash};
})();
if(typeof module!=='undefined')module.exports=CosmoForms;
