var i18n = {
    _: function(){}
};

var test1 = _('String 1');
var test2 = _('String 2 ' +
    'Multiline');
var test3 = <Component label={i18n._('String 3')} />;
var test4 = <Component>{i18n._('String 4')}</Component>;
var test5 = _('String 5 ' +
    'Line 2 ' +
    'Line 3');
var test6 = _(`Template literal`);
var test7 = _(`Template literal ${'testing'}`);