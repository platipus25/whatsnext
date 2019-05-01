!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.whatsnext=t():e.whatsnext=t()}(window,function(){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(s,r,function(t){return e[t]}.bind(null,r));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){
/**
 * @license countdown.js v2.6.0 http://countdownjs.org
 * Copyright (c)2006-2014 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
!function(e){"use strict";var t=1,n=2,s=4,r=8,i=16,o=32,u=64,a=128,l=256,d=512,h=1024,c=a|u|i|r|s|n,f=1e3,m=60,y=60,w=24,p=w*y*m*f,g=7,D=12,v=10,M=10,b=10,N=Math.ceil,S=Math.floor;function x(e,t){var n=e.getTime();return e.setMonth(e.getMonth()+t),Math.round((e.getTime()-n)/p)}function O(e){var t=e.getTime(),n=new Date(t);return n.setMonth(e.getMonth()+1),Math.round((n.getTime()-t)/p)}function T(e,t){if(t=t instanceof Date||null!==t&&isFinite(t)?new Date(+t):new Date,!e)return t;var n=+e.value||0;return n?(t.setTime(t.getTime()+n),t):((n=+e.milliseconds||0)&&t.setMilliseconds(t.getMilliseconds()+n),(n=+e.seconds||0)&&t.setSeconds(t.getSeconds()+n),(n=+e.minutes||0)&&t.setMinutes(t.getMinutes()+n),(n=+e.hours||0)&&t.setHours(t.getHours()+n),(n=+e.weeks||0)&&(n*=g),(n+=+e.days||0)&&t.setDate(t.getDate()+n),(n=+e.months||0)&&t.setMonth(t.getMonth()+n),(n=+e.millennia||0)&&(n*=b),(n+=+e.centuries||0)&&(n*=M),(n+=+e.decades||0)&&(n*=v),(n+=+e.years||0)&&t.setFullYear(t.getFullYear()+n),t)}var C,_,k,j,F,P,E,L;function Y(e,t){return E(e)+(1===e?C[t]:_[t])}function H(){}function W(e,t,n,s,r,i){return e[n]>=0&&(t+=e[n],delete e[n]),(t/=r)+1<=1?0:e[s]>=0?(e[s]=+(e[s]+t).toFixed(i),function(e,t){switch(t){case"seconds":if(e.seconds!==m||isNaN(e.minutes))return;e.minutes++,e.seconds=0;case"minutes":if(e.minutes!==y||isNaN(e.hours))return;e.hours++,e.minutes=0;case"hours":if(e.hours!==w||isNaN(e.days))return;e.days++,e.hours=0;case"days":if(e.days!==g||isNaN(e.weeks))return;e.weeks++,e.days=0;case"weeks":if(e.weeks!==O(e.refMonth)/g||isNaN(e.months))return;e.months++,e.weeks=0;case"months":if(e.months!==D||isNaN(e.years))return;e.years++,e.months=0;case"years":if(e.years!==v||isNaN(e.decades))return;e.decades++,e.years=0;case"decades":if(e.decades!==M||isNaN(e.centuries))return;e.centuries++,e.decades=0;case"centuries":if(e.centuries!==b||isNaN(e.millennia))return;e.millennia++,e.centuries=0}}(e,s),0):t}function I(e,t){var n,s,r,i=W(e,0,"milliseconds","seconds",f,t);if(i&&((i=W(e,i,"seconds","minutes",m,t))&&(i=W(e,i,"minutes","hours",y,t))&&(i=W(e,i,"hours","days",w,t))&&(i=W(e,i,"days","weeks",g,t))&&(i=W(e,i,"weeks","months",O(e.refMonth)/g,t))&&(i=W(e,i,"months","years",(n=e.refMonth,s=n.getTime(),(r=new Date(s)).setFullYear(n.getFullYear()+1),Math.round((r.getTime()-s)/p)/O(e.refMonth)),t))&&(i=W(e,i,"years","decades",v,t))&&(i=W(e,i,"decades","centuries",M,t))&&(i=W(e,i,"centuries","millennia",b,t))))throw new Error("Fractional unit overflow")}function A(e,c,p,O,T,C){var _=new Date;if(e.start=c=c||_,e.end=p=p||_,e.units=O,e.value=p.getTime()-c.getTime(),e.value<0){var k=p;p=c,c=k}e.refMonth=new Date(c.getFullYear(),c.getMonth(),15,12,0,0);try{e.millennia=0,e.centuries=0,e.decades=0,e.years=p.getFullYear()-c.getFullYear(),e.months=p.getMonth()-c.getMonth(),e.weeks=0,e.days=p.getDate()-c.getDate(),e.hours=p.getHours()-c.getHours(),e.minutes=p.getMinutes()-c.getMinutes(),e.seconds=p.getSeconds()-c.getSeconds(),e.milliseconds=p.getMilliseconds()-c.getMilliseconds(),function(e){var t;for(e.milliseconds<0?(t=N(-e.milliseconds/f),e.seconds-=t,e.milliseconds+=t*f):e.milliseconds>=f&&(e.seconds+=S(e.milliseconds/f),e.milliseconds%=f),e.seconds<0?(t=N(-e.seconds/m),e.minutes-=t,e.seconds+=t*m):e.seconds>=m&&(e.minutes+=S(e.seconds/m),e.seconds%=m),e.minutes<0?(t=N(-e.minutes/y),e.hours-=t,e.minutes+=t*y):e.minutes>=y&&(e.hours+=S(e.minutes/y),e.minutes%=y),e.hours<0?(t=N(-e.hours/w),e.days-=t,e.hours+=t*w):e.hours>=w&&(e.days+=S(e.hours/w),e.hours%=w);e.days<0;)e.months--,e.days+=x(e.refMonth,1);e.days>=g&&(e.weeks+=S(e.days/g),e.days%=g),e.months<0?(t=N(-e.months/D),e.years-=t,e.months+=t*D):e.months>=D&&(e.years+=S(e.months/D),e.months%=D),e.years>=v&&(e.decades+=S(e.years/v),e.years%=v,e.decades>=M&&(e.centuries+=S(e.decades/M),e.decades%=M,e.centuries>=b&&(e.millennia+=S(e.centuries/b),e.centuries%=b)))}(e),function(e,c,p,N){var O=0;!(c&h)||O>=p?(e.centuries+=e.millennia*b,delete e.millennia):e.millennia&&O++,!(c&d)||O>=p?(e.decades+=e.centuries*M,delete e.centuries):e.centuries&&O++,!(c&l)||O>=p?(e.years+=e.decades*v,delete e.decades):e.decades&&O++,!(c&a)||O>=p?(e.months+=e.years*D,delete e.years):e.years&&O++,!(c&u)||O>=p?(e.months&&(e.days+=x(e.refMonth,e.months)),delete e.months,e.days>=g&&(e.weeks+=S(e.days/g),e.days%=g)):e.months&&O++,!(c&o)||O>=p?(e.days+=e.weeks*g,delete e.weeks):e.weeks&&O++,!(c&i)||O>=p?(e.hours+=e.days*w,delete e.days):e.days&&O++,!(c&r)||O>=p?(e.minutes+=e.hours*y,delete e.hours):e.hours&&O++,!(c&s)||O>=p?(e.seconds+=e.minutes*m,delete e.minutes):e.minutes&&O++,!(c&n)||O>=p?(e.milliseconds+=e.seconds*f,delete e.seconds):e.seconds&&O++,c&t&&!(O>=p)||I(e,N)}(e,O,T,C)}finally{delete e.refMonth}return e}function R(e,o,u,a,l){var d;u=+u||c,a=a>0?a:NaN,l=l>0?l<20?Math.round(l):20:0;var h=null;"function"==typeof e?(d=e,e=null):e instanceof Date||(null!==e&&isFinite(e)?e=new Date(+e):("object"==typeof h&&(h=e),e=null));var p=null;if("function"==typeof o?(d=o,o=null):o instanceof Date||(null!==o&&isFinite(o)?o=new Date(+o):("object"==typeof o&&(p=o),o=null)),h&&(e=T(h,o)),p&&(o=T(p,e)),!e&&!o)return new H;if(!d)return A(new H,e,o,u,a,l);var D,v=function(e){return e&t?f/30:e&n?f:e&s?f*m:e&r?f*m*y:e&i?f*m*y*w:f*m*y*w*g}(u),M=function(){d(A(new H,e,o,u,a,l),D)};return M(),D=setInterval(M,v)}H.prototype.toString=function(e){var t=L(this),n=t.length;if(!n)return e?""+e:F;if(1===n)return t[0];var s=k+t.pop();return t.join(j)+s},H.prototype.toHTML=function(e,t){e=e||"span";var n=L(this),s=n.length;if(!s)return(t=t||F)?"<"+e+">"+t+"</"+e+">":t;for(var r=0;r<s;r++)n[r]="<"+e+">"+n[r]+"</"+e+">";if(1===s)return n[0];var i=k+n.pop();return n.join(j)+i},H.prototype.addTo=function(e){return T(this,e)},L=function(e){var t=[],n=e.millennia;return n&&t.push(P(n,10)),(n=e.centuries)&&t.push(P(n,9)),(n=e.decades)&&t.push(P(n,8)),(n=e.years)&&t.push(P(n,7)),(n=e.months)&&t.push(P(n,6)),(n=e.weeks)&&t.push(P(n,5)),(n=e.days)&&t.push(P(n,4)),(n=e.hours)&&t.push(P(n,3)),(n=e.minutes)&&t.push(P(n,2)),(n=e.seconds)&&t.push(P(n,1)),(n=e.milliseconds)&&t.push(P(n,0)),t},R.MILLISECONDS=t,R.SECONDS=n,R.MINUTES=s,R.HOURS=r,R.DAYS=i,R.WEEKS=o,R.MONTHS=u,R.YEARS=a,R.DECADES=l,R.CENTURIES=d,R.MILLENNIA=h,R.DEFAULTS=c,R.ALL=h|d|l|a|u|o|i|r|s|n|t;var U=R.setFormat=function(e){if(e){if("singular"in e||"plural"in e){var t=e.singular||[];t.split&&(t=t.split("|"));var n=e.plural||[];n.split&&(n=n.split("|"));for(var s=0;s<=10;s++)C[s]=t[s]||C[s],_[s]=n[s]||_[s]}"string"==typeof e.last&&(k=e.last),"string"==typeof e.delim&&(j=e.delim),"string"==typeof e.empty&&(F=e.empty),"function"==typeof e.formatNumber&&(E=e.formatNumber),"function"==typeof e.formatter&&(P=e.formatter)}},K=R.resetFormat=function(){C=" millisecond| second| minute| hour| day| week| month| year| decade| century| millennium".split("|"),_=" milliseconds| seconds| minutes| hours| days| weeks| months| years| decades| centuries| millennia".split("|"),k=" and ",j=", ",F="",E=function(e){return e},P=Y};R.setLabels=function(e,t,n,s,r,i,o){U({singular:e,plural:t,last:n,delim:s,empty:r,formatNumber:i,formatter:o})},R.resetLabels=K,K(),e&&e.exports?e.exports=R:"function"==typeof window.define&&void 0!==window.define.amd&&window.define("countdown",[],function(){return R})}(e)},function(e,t,n){"use strict";n.r(t);var s=function(){function e(e,t,n,s,r,i){void 0===n&&(n=0),void 0===s&&(s=null),void 0===r&&(r=null),void 0===i&&(i=null),this.hour=e,this.minute=t,this.second=0|n,this.year=s,this.month=r,this.day=i}return e.fromDate=function(t){return new e(t.getHours(),t.getMinutes(),t.getSeconds())},e.fromTs=function(t){return new e(t.hour,t.minute,t.second)},e.prototype.setDate=function(t){return new e(this.hour,this.minute,this.second,t.getFullYear(),t.getMonth(),t.getDate())},e.prototype.toDate=function(e){void 0===e&&(e=new Date);var t=this.year?new Date(e.setFullYear(this.year)):e,n=this.month?new Date(t.setMonth(this.month)):t,s=this.day?new Date(n.setDate(this.day)):n,r=new Date(s.setHours(this.hour)),i=new Date(r.setMinutes(this.minute));return new Date(i.setSeconds(this.second))},e.prototype.toString=function(){return(this.hour>12?this.hour-12:this.hour)+":"+(this.minute<10?"0"+this.minute:this.minute)},e.prototype.toStringSeconds=function(){return this.toString()+":"+(this.second<10?"0"+this.second:this.second)},e.prototype.toCompare=function(){return 100*this.hour+this.minute+.01*this.second},e}();var r=class{constructor(e){this.name=e.name,this.start=e.start,this.end=e.end,this.class=Object.assign({name:e.name},e.class)}};function i(e){for(let t in e){let n=e[t],o=n.hasOwnProperty("hour")&&n.hasOwnProperty("minute"),u=n.hasOwnProperty("year")&&n.hasOwnProperty("month")&&n.hasOwnProperty("day"),a=n.hasOwnProperty("start")&&n.hasOwnProperty("end")&&n.hasOwnProperty("name");!("object"==typeof n&&null!=n)||o||u||(e[t]=i(n)),o?e[t]=s.fromTs(n):u?e[t]=new s(0,0,0,n.year,n.month,n.day):a&&(e[t]=new r(n))}return e}var o=i;n.d(t,"WhatsnextStatic",function(){return a}),n.d(t,"Whatsnext",function(){return l}),n.d(t,"WhatsnextSim",function(){return d}),n.d(t,"transformFromRaw",function(){return i}),n.d(t,"Time",function(){return s});let u=n(0);class a{constructor(e,t){this.date=t,e instanceof Promise?e.then(e=>{this.schedule_base=o(e)}):this.schedule_base=o(e)}get now(){return this.date}get tomorrow(){return new Date(new Date(new Date(this.now.setDate(this.now.getDate()+1)).setHours(0)).setMinutes(0))}get time(){return s.fromDate(this.now)}setTimeDate(e,t){let n=Object.assign({},e);for(let e in n){let r=n[e],i="object"==typeof r&&null!=r&&Object.getPrototypeOf(r)==Object.prototype,o=r instanceof s;i&&(n[e]=this.setTimeDate(r,t)),o&&(n[e]=r.setDate(t))}return n}_day(){return this.day.slice(0,3).toLowerCase()}get day(){let e="";if(e=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.now.getDay()],this.schedule_base&&this.schedule_base.hasOwnProperty("custom")){let t=this.time;t.hour,t.minute,t.second=0;for(let t in this.schedule_base.custom){if(!this.schedule_base.hasOwnProperty("custom_schedule"))continue;let n=this.schedule_base.custom[t];for(let r of n)(r.hasOwnProperty("date")&&r.date==this.time||r instanceof s&&r==this.time)&&(e=t)}}return e}get schedule(){return this.schedule_base&&this.schedule_base[this._day()]||null}thisClass(){let e=this.schedule;if(!e)return null;for(let t of e.periods){let e=t.start.toCompare(),n=t.end.toCompare(),s=this.time.toCompare();if(e<=s&&n>=s)return t}return null}nextClass(){let e=this.schedule;if(!e)return null;for(let t of e.periods){let e=t.start.toCompare();if(this.time.toCompare()<e)return t}return null}enumerateNextClass(){if(!this.schedule_base)return null;let e=this.nextClass();if(e)e=this.setTimeDate(e,this.now);else{let t=this.tomorrow;e=new a(this.schedule_base,t).enumerateNextClass()}return e}nextWeekend(){if(!this.schedule_base)return null;let e=this.now,t=e=>new Date(e.setDate(e.getDate()+1));for(;5!=e.getDay();)e=t(e);let n=new a(this.schedule_base,e).schedule;return n?n.end.setDate(e):null}enumerateNextTime(){let e=this.thisClass();if(!e)return null;let t=null,n=!1,s=e.name,r=this;for(;!n;){let e=r.tomorrow,i=(r=new a(this.schedule_base,e)).schedule;if(i)for(let e of i.periods){if(e.name===s){t=e,n=!0;break}}}return t?t=this.setTimeDate(t,r.now):null}thisClassCountdown(){let e=this.thisClass(),t=null;return e&&(t=u(this.now,e.end.toDate(this.now))),t}nextClassCountdown(){let e=this.nextClass(),t=null;return e&&(t=u(this.now,e.start.toDate(this.now))),t}enumerateNextClassCountdown(){let e=this.enumerateNextClass(),t=null;return e&&(t=u(this.now,e.start.toDate())),t}endOfSchoolCountdown(){let e=null;if(this.schedule){let t=this.schedule.end.toDate(this.now);this.now<t&&(e=u(this.now,t))}return e}nextWeekendCountdown(){let e=null,t=this.nextWeekend();if(t){let n=t.toDate();this.now&&(e=u(this.now,n))}return e}nextTimeCountdown(){let e=null,t=this.enumerateNextTime();if(t){let n=t.start.toDate();this.now&&(e=u(this.now,n))}return e}}class l extends a{get now(){return new Date}}class d extends l{constructor(e,t=0,n=new Date){super(e,n),this.multiplier=t,this.start=new Date}get now(){let e=(60*this.multiplier||1)*((new Date).valueOf()-this.start.valueOf());return new Date(this.date.valueOf()+e)}}t.default=a}])});