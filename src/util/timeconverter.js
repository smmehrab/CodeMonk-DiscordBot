exports.convertTimestamp =  (unixTimestamp) => {
    var date = new Date(unixTimestamp * 1000);
    
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var day = date.getDate();
    var hour = "0" + date.getHours();
    var min = "0" + date.getMinutes();
    var sec = "0" + date.getSeconds();

    return day + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
}

