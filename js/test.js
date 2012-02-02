// this supports trigger native events such as 'onchange'
// whereas prototype.js Event.fire only supports custom events
function trigger(element, eventName) {
    // safari, webkit, gecko
    if (document.createEvent)
    {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, true);
 
        return element.dispatchEvent(evt);
    }
 
    // Internet Explorer
    if (element.fireEvent) {
        return element.fireEvent('on' + eventName);
    }
}

// Removes given song from playlist
// Give it the row element that the song is in
// Example: select a song and then run "removeSong($$("tr.selectedSong")[0])" in
// the console (enter in functions first though).
function removeSong(rowElement) {
    var a = rowElement.getElementsByClassName('fade-out-with-menu')[0];
    trigger(a, 'mouseover');
    var b = a.children[0];
    trigger(b, 'click');
    var c = document.getElementById(":2f")
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

    for (n = 0; n < duplicateSongs.length; n++) {
        duplicateSongs[n].element.className = "selectedSong " + duplicateSongs[n].element.className;
    }
}


