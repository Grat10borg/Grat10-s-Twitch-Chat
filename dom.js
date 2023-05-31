"use strict";
const $ = document;
const $$ = {
    dom: document,
    id: $.getElementById.bind($),
    class: $.getElementsByClassName.bind($),
    make: $.createElement.bind($),
    query: $.querySelector.bind($),
    query_all: $.querySelectorAll.bind($),
    wait: wait.bind($),
    log: console.log,
};
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
