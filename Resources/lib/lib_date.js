// usage:
// var now=new Date();
// alert("Today is "+now.customFormat('#DDDD#, #MMMM# #D##th#')+"\nThe time is "+now.customFormat('#h#:#mm##ampm#')+".");
Date.prototype.customFormat=function(formatString){ 
   var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,dMod,th;
   YY = ((YYYY=this.getFullYear())+"").substr(2,2);
   MM = (M=this.getMonth()+1)<10?('0'+M):M;
   MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substr(0,3);
   DD = (D=this.getDate())<10?('0'+D):D;
   DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substr(0,3);
   th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
   formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

   h=(hhh=this.getHours());
   if (h==0) h=24;
   if (h>12) h-=12;
   hh = h<10?('0'+h):h;
   ampm=hhh<12?' AM':' PM';
   mm=(m=this.getMinutes())<10?('0'+m):m;
   ss=(s=this.getSeconds())<10?('0'+s):s;
   return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm);
} 


Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));
 
    var offset = 0;
    var date = new Date(d[1], 0, 1);
 
    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }
 
    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}
 
