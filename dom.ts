// Shorthand Dom versions
const $ = document;
const $$ = {
dom: document,

// document methods
id: $.getElementById.bind($),
class: $.getElementsByClassName.bind($),
make: $.createElement.bind($),
query: $.querySelector.bind($),
query_all: $.querySelectorAll.bind($),

// custome methods bellow this
// none yet!
wait: wait.bind($),

// just here to help me out when working.
log: console.log,
}

// misc function, make javascript wait
function wait(ms: number) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}