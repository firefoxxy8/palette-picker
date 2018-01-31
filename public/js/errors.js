window.onerror = (msg, url, lineNo, columnNo, error) => {
    const string = msg.toLowerCase();
    const substring = "script error";
    if (string.indexOf(substring) > -1){
        console.log('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        console.log({ message });
    }
    return false;
};

const perfData = window.performance.timing; 
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log({ pageLoadTime });

const connectTime = perfData.responseEnd - perfData.requestStart;
console.log({ connectTime });

const renderTime = perfData.domComplete - perfData.domLoading;
console.log({ renderTime });
