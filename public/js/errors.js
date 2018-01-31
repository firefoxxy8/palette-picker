window.onerror=function(msg,url,lineNo,columnNo,error){var string=msg.toLowerCase();var substring="script error";if(string.indexOf(substring)>-1){}
else{var message=['m='+ msg,'u='+ url,'l='+ lineNo,'c='+ columnNo,'e='+ JSON.stringify(error)].join('&');var xhttp=new XMLHttpRequest();xhttp.open("GET","//influxmon.crosno.net/error.txt?"+message,true);xhttp.send();}
return false;};
