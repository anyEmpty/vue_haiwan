(function(doc, win) {
    var docEl = doc.documentElement,
        oHeight = docEl.offsetHeight,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            nHeight = docEl.offsetHeight;
            var foots = docEl.querySelectorAll('.footPop')
            if (oHeight - nHeight > 50) {
                for (var i = 0; i < foots.length; i++) {
                    foots[i].style.display="none"
                }
            } else {
                for (var i = 0; i < foots.length; i++) {
                    foots[i].style.display="block"
                }
            }
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 50 * (clientWidth / 375) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);