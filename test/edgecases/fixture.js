var test1 = _();

var var1, var2, var3, var4;
function dummy() {}
var test2 = _(var1);
var test3 = _(var1, var2);
var test4 = _(var1, var2, var3);
var test5 = _(var1, var2, var3, var4);
var test6 = _(dummy('text here'));