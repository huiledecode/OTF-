/**
 * noty.js
 * @author Alexandre Ogé
 * @version 1.0
 *
 *
 */


function showNotificationPopup(msg, type, timeout){
    var n = noty({
        layout: 'centerLeft',
        theme: 'defaultTheme',
        type: type,
        text: msg, // can be html or string
        dismissQueue: true, // If you want to use queue feature set this true
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500 // opening & closing animation speed
        },
        timeout: timeout, // delay for closing event. Set false for sticky notifications
        force: false, // adds notification to the beginning of queue when set to true
        modal: false,
        maxVisible: 10, // you can set max visible notification for dismissQueue true option,
        killer: false, // for close all notifications before show
        closeWith: ['click'], // ['click', 'button', 'hover']
        callback: {
            onShow: function() {},
            afterShow: function() {},
            onClose: function() {},
            afterClose: function() {}
        },
        buttons: false // an array of buttons
    });
}

function showAlertNotificationPopup(msg, timeout){
    showNotificationPopup(msg, "alert", timeout);
}
function showWarningNotificationPopup(msg, timeout){
    showNotificationPopup(msg, "warning", timeout);
}
function showInformationNotificationPopup(msg, timeout){
    showNotificationPopup(msg, "information", timeout);
}
function showSuccessNotificationPopup(msg, timeout){
    showNotificationPopup(msg, "success", timeout);
}
function showErrorNotificationPopup(msg, timeout){
    showNotificationPopup(msg, "error", timeout);
}
function showConfirmNotificationPopup(msg){
    showNotificationPopup(msg, "confirm");
}
