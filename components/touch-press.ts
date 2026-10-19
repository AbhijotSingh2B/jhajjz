/**
 * Keeps a card in a sideways row (home fleet preview, "Looking at other cars?") pressed for as long as the finger
 * is on it, scrolling included: the browser's own :active ends the moment the row starts to scroll (Nirmal wanted
 * the press held). Runs in <head> like photoScript; the listeners are passive, so they never hold up a scroll.
 * A press on something inside a card (a share button, a car name) doesn't press the card. Styles: globals.css.
 */
export const pressScript = `(function(){var p=[];function up(){for(var i=0;i<p.length;i++)p[i].removeAttribute("data-pressed");p=[]}document.addEventListener("touchstart",function(e){var t=e.target;if(!t.closest)return;var c=t.closest(".snap-x .group");if(!c||!c.querySelector(".card-name"))return;var a=t.closest("a,button");if(a&&a!==c&&c.contains(a))return;up();c.setAttribute("data-pressed","");p.push(c)},{passive:true});document.addEventListener("touchend",up,{passive:true});document.addEventListener("touchcancel",up,{passive:true})})();`;
