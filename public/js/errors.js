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

window.addEventListener('load', (e) => {
  const perfData = window.performance.timing;

  fetch('/api/v1/perf', {
    method: 'POST',
    body: JSON.stringify({ perfData }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.status !== 201) {
      console.log(response);
    }
    return response;
  })
  .catch(error => console.log(error));
});
