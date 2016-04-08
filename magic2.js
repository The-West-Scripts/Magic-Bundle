// ==UserScript==
// @name         The West Magic
// @version      2.0
// @description  Because magic is awesome!
// @author       Alin "xShteff" Olaru
// @website      https://xshteff.github.io
// @include      *.the-west.*/game.php*
// @downloadURL  https://xshteff.github.io/userscripts/magic.user.js
// @updateURL    https://xshteff.github.io/userscripts/magic.user.js
// ==/UserScript==

/*
    COPYRIGHT
    End users are licensed the right to download the code into their web browser(s) for standard and reasonable usage only.
    If you want the script translated, you shall contact the script owner for this.
*/

/*
 * Building an object containing all the features and it's data.
 * @type {Object}
 */
var MagicFeatures = {
    'notifications': {
        'status': '',
        'iconURL': 'https://westzzs.innogamescdn.com/images/interface/chat/chat.gif',
        'releaseDate': '16th September 2014',
        'fullName': 'Better Notifications',
        'description': 'A simple userscript that displays a notification every time you get a new private message. In order for the script to work, you must press the chat bubble that will appear under the settings button, and allow your browser to display notifications for this page.'
    },
    'veteran': {
        'status': '',
        'iconURL': 'https://puu.sh/gdsek/93e29796d4.png',
        'releaseDate': '16th September 2014',
        'fullName': 'Veteran Point Counter',
        'description': 'A simple display of your amount of veteran points, placed conveniently under the top bar.'
    },
    'taskkiller': {
        'status': '',
        'iconURL': 'https://puu.sh/gdsnY/ecb27d9300.png',
        'releaseDate': '21th September 2014',
        'fullName': 'Task Killer',
        'description': 'A perfect script for lazy people (Like the guy that made this userscript). Tired of clicking 9 times to cancel your jobs? No problem! Just press the button placed on the left of the queued jobs, and all your jobs will be gone! It\'s MAGIC!'
    },
    'jobdesign': {
        'status': '',
        'iconURL': 'https://westzzs.innogamescdn.com/images/icons/hammer.png',
        'releaseDate': '31st October 2014',
        'fullName': 'Job Window Re-Design',
        'description': 'An another script for lazy people! This userscript will replace the counter inside the job window, with a custom dropdown! How amazing is that?'
    },
    'multipurchase': {
        'status': '',
        'iconURL': 'https://puu.sh/lfvxl/187895d35c.png',
        'releaseDate': '10th November 2015',
        'fullName': 'Multi-Purchase',
        'description': 'A simple userscript that will allow you to purchase multiple items from the store! Amounts bigger than 27 will suffer a delay, in order to avoid flood protection.</i> <br> Kudos to <a href="https://forum.the-west.net/member.php?u=11236" target="_blank">Slygoxx</a> for helping.'
    },
    'neonxpbar': {
        'status': '',
        'iconURL': 'https://zz1.beta.the-west.net/images/icons/star.png',
        'releaseDate': '9th April 2016',
        'fullName': 'NeonXPBar',
        'description': '#soon'
    }
};

var enableFeature = function(key) {
    switch (key) {
        case "notifications":
            enableNotifications();
            break;
        case "veteran":
            enableVPCounter();
            break;
        case "taskkiller":

            break;
        case "jobdesign":
            enableJobRework();
            break;
        case "multipurchase":

            break;
        case "neonxpbar":
            enableNeonXP();
            break;
    }
}
var enableNeonXP = function() {
    var deg = 10;
    var adder = 5;
    var run = true;
    var hue = function() {
        $('#ui_experience_bar .fill_wrap .fill').css('-webkit-filter', 'hue-rotate(' + deg % 361 + 'deg)');
        deg += adder;
        if (run)
            setTimeout(hue, 50);
    }
    hue();
}
var requestNotification = function() {
    if (!window.Notification)
        new UserMessage("Sorry, notifications are not supported.").show();
    else
        Notification.requestPermission(function(p) {
            if (p === 'denied') {
                new UserMessage("Notifications are disabled!").show();
                requestNotification();
            } else if (p === 'granted') {
                new UserMessage("Notifications have been enabled!").show();
            }

        });
}

var enableVPCounter = function() {
    var valText = $('<span>').css({
        'position': 'absolute',
        'right': '5px',
        'text-shadow': '1px 1px 1px #000'
    }).attr('id', 'magic_vp_value').text('0');

    var vetIcon = $('<span>').attr('class', 'tw-currency curr-veteran').css({
        'position': 'absolute',
        'left': '0px'
    });

    var vetValue = $('<div>').attr('class', 'value').css({
        'position': 'absolute',
        'left': '32px',
        'top': '3px',
        'width': '115px',
        'height': '25px',
        'line-height': '25px',
        'pading': '0 5px',
        'color': '#f8c57c',
        'font-size': '13pt',
        'text-align': 'right',
        'user-select': 'none',
        'background': 'url("https://westzzs.innogamescdn.com/images/interface/custom_unit_counter_sprite.png?2") no-repeat 0 -36px',
        'z-index': '1'
    }).append(valText).prepend(vetIcon);

    var vetCounter = $('<div>').attr({
        'class': 'xsht_custom_unit_counter',
        'id': 'magic_vp_counter',
        'title': '<b>Veteran Points</b> <br>You earn Veteran Points by fighting on Adventures! <br>Veteran points can be spent in the Union Pacific Store.'
    }).css({
        'position': 'absolute',
        'top': '32px',
        'left': '50%',
        'margin-left': '-250px',
        'z-index': '16',
        'width': '180px',
        'height': '36px',
        'text-align': 'left',
        'text-shadow': '1px 1px 1px #000',
        'background': 'url("https://westzzs.innogamescdn.com/images/interface/custom_unit_counter_sprite.png?2") no-repeat 50% 0',
        'cursor': 'pointer'
    }).append(vetValue).click(function() {
        west.window.shop.open();
    });

    $("#ui_topbar").before(vetCounter)
    WestUi.TopBar._redraw($("#magic_vp_value"), Character.veteranPoints);
    EventHandler.listen("veteran_points_changed", function(amount) {
        WestUi.TopBar._redraw($("#magic_vp_value"), Character.veteranPoints);
    });
}

var enableJobRework = function() {
    JobWindow.getJobAmount = function() {
        var amount = parseInt(this.window.$("#tw_work_menu_value").children("option").filter(":selected").text(), 10);
        return isNaN(amount) ? 1 : amount;
    };

    JobWindow.getJobAmountSelector = function() {
        var title = _('How often do you want to start the job?').escapeHTML(),
            cb = this.setJobAmount.bind(this);
        return $(s('<div style="position:relative;top:-50px;left:20px;" title="%1">' +
            '<select id="tw_work_menu_value">' + '      <option value="1">1</option>' + '      <option value="2">2</option>' + '      <option value="3">3</option>' + '      <option value="4">4</option>' + '      <option value="5">5</option>' + '      <option value="6">6</option>' + '      <option value="7">7</option>' + '      <option value="8">8</option>' + '      <option value="9">9</option>' + '    </select> ' +
            '</div>', title)).click(cb).mousewheel(cb);
    };
}

var enableNotifications = function() {
    requestNotification();
    EventHandler.listen("chat_tell_received", function(room) {
        function notify() {
            var regex = /<td(.*)chat_text(.*)>(.*)<\/td>/ig;
            new Notification('New Message from ' + room.client.pname, {
                body: regex.exec(room.history[room.history.length - 1])[3],
                icon: 'http://puu.sh/oaqQS/1c5bbb0c5c.jpg'
            });
        }

        if (Notification.permission !== 'granted')
            new UserMessage("Please enable notifications.").show();
        else
            notify();
    });
}

/*
 * Creating a local storage if it doesn't exist. If there is one, I'm updating the MagicFeatures objects with data from it.
 */
var initialiseStorage = function() {
    $.each(MagicFeatures, function(key) {
        if (localStorage.getItem("magicbundle_feature_" + key) === null) {
            localStorage.setItem("magicbundle_feature_" + key, "deactivated");
            MagicFeatures[key]["status"] = "deactivated";
        } else if (localStorage.getItem("magicbundle_feature_" + key) === "activated") {
            MagicFeatures[key]["status"] = "activated";
            enableFeature(key);
        } else if (localStorage.getItem("magicbundle_feature_" + key) === "deactivated") {
            MagicFeatures[key]["status"] = "deactivated";
        }
    })
}



/*
 * Changing the status of a feature, from deactivated to activated and the other way around.
 * @param {String} key
 */
var changeFeatureStatus = function(key) {
    var s1 = MagicFeatures[key]['status'];
    var s2 = localStorage.getItem('magicbundle_feature_' + key);
    if (s1 != s2) {
        return "Error"; //Should never happen, hopefully.
    } else { 
        if (s1 == "activated") {
            new UserMessage("'" + MagicFeatures[key]["fullName"] + "' is now disabled.").show();
            MagicFeatures[key]['status'] = "deactivated";
            localStorage.setItem('magicbundle_feature_' + key, "deactivated");
        } else {
            new UserMessage("'" + MagicFeatures[key]["fullName"] + "' is now enabled.").show();
            MagicFeatures[key]['status'] = "activated";
            localStorage.setItem('magicbundle_feature_' + key, "activated");
        }
    }
}

/*
 * Building a window object, setting the initial tab to "notifications"
 * @type {Object}
 */
window.MagicWindow = {
    window: null,
    currentTab: "notifications",
};

var styling = '<style>.activated { background-position: -49px !important;  } </style>';
$('head').append(styling);

/*
 * Building a Table Row containing the Toggle Buttom
 * @param {String} key
 * @param {String} status
 * @returns {HTMLTableRow}
 */
var buildToggleTableRow = function(key, status) {
    console.log(status);
    var tColOne = $('<td>').text('Toggle: ').css('font-weight', 'bold');
    var toggleButton = $('<div>').attr({
        'id': 'xsht-toggle-' + key,
        'class': 'xsht-button ' + status
    }).css({
        'width': '50px',
        'height': '17px',
        'border-radius': '20px',
        'background-image': 'url("https://puu.sh/o9HHe/afc2d04137.png")',
        'background-size': '114px 18px',
        'background-position': '-17px',
        'transition': 'background-position 0.5s'
    }).click(function() {
        $(this).toggleClass('activated');
        changeFeatureStatus(key);
    });

    var tColTwo = $('<td>').append(toggleButton);
    var tRow = $('<tr>').append(tColOne).append(tColTwo);
    return tRow;
}

/*
 * Building a Table Row containing the release date of the feature
 * @param {String} date
 * @returns {HTMLTableRow}
 */
var buildReleaseDateRow = function(date) {
    var tColOne = $('<td>').text('Release Date: ').css('font-weight', 'bold');
    var tColTwo = $('<td>').text(date);
    var tRow = $('<tr>').append(tColOne).append(tColTwo);
    return tRow;
}

/*
 * Building a Table Row containing the description of the feature
 * @param {String} data
 * @returns {HTMLTableRow}
 */
var buildDescriptionRow = function(data) {
    var tColOne = $('<td>').attr('colspan', 2).html(data).css({
        'font-style': 'italic',
        'padding-top': '10px'
    });
    var tRow = $('<tr>').append(tColOne);
    return tRow;
}

/*
 * Building a Table Row containing a warning informing the user that he should reload the game
 * @returns {HTMLTableRow}
 */
var buildWarningRow = function() {
    var tColOne = $('<td>').attr('colspan', 2).css({
        'font-weight': 'bold',
        'color': 'red'
    }).text("Please reload the game in order to apply the changes!");
    var tRow = $('<tr>').append(tColOne);
    return tRow;
}

/*
 * Generating and opening the window.
 */
MagicWindow.open = function(tab) {
    if (undefined === tab) tab = this.currentTab;
    var tabclick = function(win, id) {
        MagicWindow.showTab(id);
    }

    MagicWindow.window = wman.open("magicwindow", "Magic Window").setMiniTitle("Magic Window").setSize(420, 370);

    $.each(MagicFeatures, function(key) {
        var contentTable = $('<table>').css('padding-top', '10px');
        contentTable.append(buildToggleTableRow(key, MagicFeatures[key]["status"]));
        contentTable.append(buildReleaseDateRow(MagicFeatures[key]["releaseDate"]));
        contentTable.append(buildDescriptionRow(MagicFeatures[key]["description"]));
        contentTable.append(buildWarningRow());
        var par = $('<div>').attr({
            'class': 'magic-content',
            'id': 'magic-' + key,
            'display': 'none'
        }).html(contentTable);
        MagicWindow.window.addTab('<img src="' + MagicFeatures[key]["iconURL"] + '">', key, tabclick).appendToContentPane(par);
    });

    this.showTab(tab);
};

/*
 * Using this method to change between the active tabs, for the window. Should not be ran unless the window is open.
 * @param {String} id
 */
MagicWindow.showTab = function(id) {
    if (!this.window) return;
    this.currentTab = id;
    this.window.activateTab(id);
    $.each($('#magic-' + id).parent().children(), function() {
        var elID = $(this).attr('id');
        if (elID != "magic-" + id)
            $(this).hide();
        else
            $(this).slideDown('1000');
    });
    this.window.setTitle(MagicFeatures[id]["fullName"]);
    this.window.setMiniTitle(MagicFeatures[id]["fullName"]);

};

/*
 * Creating a button used to open the window.
 */
var initialiseButton = function() {
    var icon = $('<div></div>').attr({
        'title': 'Magic Menu',
        'class': 'menulink'
    }).css({
        'background': 'url("http://puu.sh/gbV7X/4703da6942.png")',
        'background-position': '0px 0px'
    }).mouseleave(function() {
        $(this).css("background-position", "0px 0px");
    }).mouseenter(function(e) {
        $(this).css("background-position", "25px 0px");
    }).click(function() {
        MagicWindow.open('notifications');
    });

    var cap = $('<div></div>').attr({
        'class': 'menucontainer_bottom'
    });

    $("#ui_menubar .ui_menucontainer :last").after($('<div></div>').attr({
        'class': 'ui_menucontainer',
        'id': 'magicbundle_init_button'
    }).append(icon).append(cap));
}

/*
 * Setting up the local storage and opening the window. (WIP)
 */
var initialiseScript = function() {
    initialiseStorage();
    initialiseButton();
}

initialiseScript();