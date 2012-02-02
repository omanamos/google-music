var MAX_SONGS = 500;

// this supports trigger native events such as 'onchange'
// whereas prototype.js Event.fire only supports custom events
function trigger(element, eventName, ctrl) {
    // safari, webkit, gecko
    if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true);
        if (ctrl) {
            evt.ctrlKey = ctrl;
        }

        return element.dispatchEvent(evt);
    }
 
    // Internet Explorer
    if (element.fireEvent) {
        return element.fireEvent('on' + eventName);
    }
}

function getMenuContainer() {
    var menus = document.getElementsByClassName("goog-menu goog-menu-vertical");
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].children.length == 10) {
            return menus[i];
        }
    }
}

function getRemoveButton() {
    return getMenuContainer().getElementsByClassName('goog-menuitem')[6];
}

// Removes given song from playlist
// Give it the row element that the song is in
// Example: select a song and then run "removeSong($$("tr.selectedSong")[0])" in
// the console (enter in functions first though).
function removeSong(rowElement) {
    var a = rowElement.getElementsByClassName('fade-out-with-menu')[0];
    var c = getRemoveButton();
    trigger(a, 'mouseover');
    var b = a.children[0];
    trigger(b, 'click');
    trigger(c, 'mousedown');
    trigger(c, 'mouseup');
}

function buildSong(row) {
    var children = row.children;
    return {
        name: children[0].children[0].title,
        artist: children[2].children[0].title,
        album: children[3].children[0].title,
        count: Number(children[4].innerHTML.trim()),
        element: row
    };
}

function remove(duplicateSongs, init) {
    var element;
    for (var n = init; n < Math.min(init + MAX_SONGS, duplicateSongs.length); n++) {
        if (duplicateSongs[n].element.className.indexOf("selectedSong") == -1) {
            element = duplicateSongs[n].element;
            trigger(element, 'click', true);
        }
    }
    if (element) {
        removeSong(element);
    }
    return Math.min(init + MAX_SONGS, duplicateSongs.length) != duplicateSongs.length
}

function waitForAjax() {
    var hasPending = true;
    while (hasPending) {
        setTimeout("hasPending = ", 1000);
    }
}

function dedup() {
    var x = document.getElementById("0songContainer");
    var rows = x.children[0].children;
    var uniqueSongs = {};
    var duplicateSongs = [];
    var n;
    for(n = 0; n < rows.length; n++) {
        var song = buildSong(rows[n]);
        if (uniqueSongs[song.artist]) {
            if (uniqueSongs[song.artist][song.album]) {
                if (uniqueSongs[song.artist][song.album][song.name]) {
                    console.log("duplicate song: " + song.name);
                    duplicateSongs.push(song);
                } else {
                    uniqueSongs[song.artist][song.album][song.name] = song;
                }
            } else {
                uniqueSongs[song.artist][song.album] = {};
                uniqueSongs[song.artist][song.album][song.name] = song;
            }
        } else {
            console.log("New Artist: " + song.artist);
            uniqueSongs[song.artist] = {};
            uniqueSongs[song.artist][song.album] = {};
            uniqueSongs[song.artist][song.album][song.name] = song;
        }
    }

    var init = 0;
    var keepGoing = remove(duplicateSongs, init);
    while (keepGoing) {
        init += MAX_SONGS;
        setTimeout("keepGoing = remove(duplicateSongs, init)", 200);
    }
}
