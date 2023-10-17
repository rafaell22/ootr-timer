"use strict";let tinyduration={};tinyduration.serialize=tinyduration.parse=tinyduration.MultipleFractionsError=tinyduration.InvalidDurationError=void 0;let DEFAULT_PARSE_CONFIG={allowMultipleFractions:!0},units=[{unit:"years",symbol:"Y"},{unit:"months",symbol:"M"},{unit:"weeks",symbol:"W"},{unit:"days",symbol:"D"},{unit:"hours",symbol:"H"},{unit:"minutes",symbol:"M"},{unit:"seconds",symbol:"S"},],r=(i,t)=>`((?<${i}>-?\\d*[\\.,]?\\d+)${t})?`,durationRegex=RegExp(["(?<negative>-)?P",r("years","Y"),r("months","M"),r("weeks","W"),r("days","D"),"(T",r("hours","H"),r("minutes","M"),r("seconds","S"),")?"].join(""));function parseNum(i){if(""!==i&&null!=i)return parseFloat(i.replace(",","."))}function parse(i,t=DEFAULT_PARSE_CONFIG){let n=durationRegex.exec(i);if(!n||!n.groups)throw tinyduration.InvalidDurationError;let e=!0,o=0,u={};for(let{unit:a}of units)if(n.groups[a]&&(e=!1,u[a]=parseNum(n.groups[a]),!t.allowMultipleFractions&&!Number.isInteger(u[a])&&++o>1))throw tinyduration.MultipleFractionsError;if(e)throw tinyduration.InvalidDurationError;let l=u;return n.groups.negative&&(l.negative=!0),l}tinyduration.InvalidDurationError=Error("Invalid duration"),tinyduration.MultipleFractionsError=Error("Multiple fractions specified"),tinyduration.parse=parse;let s=(i,t)=>{if(!i)return;let n=i.toString(),e=n.indexOf("e");if(e>-1){let o=parseInt(n.slice(e+2),10);n=i.toFixed(o+e-2)}return n+t};function serialize(i){return i.years||i.months||i.weeks||i.days||i.hours||i.minutes||i.seconds?[i.negative&&"-","P",s(i.years,"Y"),s(i.months,"M"),s(i.weeks,"W"),s(i.days,"D"),(i.hours||i.minutes||i.seconds)&&"T",s(i.hours,"H"),s(i.minutes,"M"),s(i.seconds,"S"),].filter(Boolean).join(""):"PT0S"}tinyduration.serialize=serialize;export default tinyduration;