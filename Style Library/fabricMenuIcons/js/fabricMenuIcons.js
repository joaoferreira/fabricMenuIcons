//Get script location to inject the css file
var scripts = document.getElementsByTagName("script");
var pathIcons = "";
if (scripts && scripts.length > 0) {
    for (var i in scripts) {
        if (scripts[i].src && scripts[i].src.match(/fabricmenuicons\.js$/)) {
            pathIcons = scripts[i].src.replace(/(.*)fabricmenuicons\.js$/, "$1");
            pathIcons = pathIcons.replace("/js/", "/");
            break;
        }
    }
};


function injectCSS() {
    try {
        if (pathIcons) {
            var style = document.createElement("link");
            style.href = pathIcons + 'css/fabricMenuIcons.css';
            style.type = "text/css";
            style.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }
    catch (ex) {

    }
}


function injectIconsMenu() {
    if (document.location.href.toLowerCase().indexOf('/_layouts/15/areanavigationsettings.aspx') != -1) {
        $('#DeltaPlaceHolderMain .propertysheet tbody').first().append(getNavigationPageHTML());
    } else if (document.location.href.toLowerCase().indexOf('/_layouts/15/quiklnch.aspx') != -1) {
        $('#DeltaPlaceHolderMain .ms-v4propertysheetspacing tbody').first().append(getNavigationPageHTML());
    }
}

function getNavigationPageHTML() {
    var html = '';
    html += '<tr id="ctl00_PlaceHolderMain_iconsNavSection"></tr>';
    html += '<td class="ms-formdescriptioncolumn-wide" valign="top">';
    html += '<table border="0" cellpadding="1" cellspacing="0" width="100%" summary="" role="presentation">';
    html += '<tbody>';
    html += '<tr>';
    html += '<td class="ms-sectionheader" style="padding-top: 4px;" height="22" valign="top">';
    html += '<h3 class="ms-standardheader ms-inputformheader">Menu Icons</h3>';
    html += '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td class="ms-descriptiontext ms-inputformdescription">';
    html += 'Your site has the custom menu Icons enabled!<br>';
    html += '<p class="menu-item-text"><i class="ms-Icon ms-Icon--Emoji2" aria-hidden="true" style="font-size: 30px;"></i></p>';
    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += '</td>';
    html += '<td class="ms-authoringcontrols ms-inputformcontrols" valign="top" align="left">';
    html += '<a href="' + pathIcons + 'pages/menuicons.aspx" target="_blank" style="margin-left: 24px;"><i class="ms-Icon ms-Icon--Edit" aria-hidden="true" style="margin-right: 7px;"></i>Manage Menu Icons</a>';
    html += '</td>';
    html += '</tr>';
    return html;
}


injectCSS();



$(document).ready(function () {

    // links to the source lists

    injectIconsMenu();

    (function () {
        var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
        var colInfoList = null;
        var horizontalMenuIcons = new Array();
        var verticalMenuIcons = new Array();

        $(document).ready(function () {
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveListItems);
        });

        function retrieveListItems() {
            var clientContext = new SP.ClientContext(siteUrl);
            var oLists = clientContext.get_web().get_lists();
            var oInfoList = oLists.getByTitle('Menu Icons');

            var infoQuery = new SP.CamlQuery();

            // sets caml query 
            infoQuery.set_viewXml("<View><Query></Query></View>");

            // adds caml query to the request
            colInfoList = oInfoList.getItems(infoQuery);

            // loads the content from each list
            clientContext.load(colInfoList);

            // executes the query and call onQuerySucceeded if successful
            clientContext.executeQueryAsync(onQuerySucceeded, onQueryFailed);
        }

        function onQuerySucceeded(sender, args) {
            var infoEnumerator = colInfoList.getEnumerator();


            // reads the information from the menu list
            while (infoEnumerator.moveNext()) {
                var oListItem = infoEnumerator.get_current();
                var menu = oListItem.get_item('Menu');

                var menuItem = {
                    meunItemId: oListItem.get_item('ID'),
                    menuItemName: oListItem.get_item('Title'),
                    menuIconType: oListItem.get_item('IconType'),
                    menuIcon: oListItem.get_item('Icon'),
                    menu: oListItem.get_item('Menu'),
                    hideMenuText: oListItem.get_item('HideText')
                };

                if (menu == 'Horizontal Menu') {
                    horizontalMenuIcons.push(menuItem);
                } else if (menu == 'Vertical Menu') {
                    verticalMenuIcons.push(menuItem);
                }
            }
            processIcons();
        }


        function processIcons() {
            //#DeltaTopNavigation for Seattle MasterPage and #DeltaHorizontalQuickLaunch for Oslo MasterPage
            var horizontalMenuItemsText = ($('#DeltaTopNavigation .menu-item-text').length == 0 ? $('#DeltaHorizontalQuickLaunch .menu-item-text') : $('#DeltaTopNavigation .menu-item-text'));
            var verticalMenuItemsText = $('#DeltaPlaceHolderLeftNavBar .menu-item-text');
            appendIcons(horizontalMenuIcons, horizontalMenuItemsText);
            appendIcons(verticalMenuIcons, verticalMenuItemsText);

        }

        function appendIcons(iconArray, menuItemText) {
            $.each(menuItemText, function (index, value) {
                for (var i = 0; i < iconArray.length; i++) {
                    if ($(this).text() == iconArray[i].menuItemName) {

                        if (iconArray[i].hideMenuText) {
                            $(this).text('');
                        }

                        if (iconArray[i].menuIconType == "Fabric UI Icon") {
                            //Append Icon
                            $(this).prepend('<i class="ms-Icon ms-Icon--' + iconArray[i].menuIcon + '" aria-hidden="true"></i>')
                        } else if (iconArray[i].menuIconType == "Image") {
                            $(this).prepend('<img class="menu-item-text-image" src="' + iconArray[i].menuIcon + '"></i>')
                        }

                    }
                }
            });
        }


        function onQueryFailed(sender, args) {
            console.log('Unable to get data from list')
        }

    })();


});




