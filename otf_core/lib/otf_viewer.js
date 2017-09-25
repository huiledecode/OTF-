/**
 * Created by epa on 10/12/14.
 */

module.exports = function(app) {
    var exphbs = require('express-handlebars');
    var handlebars = require("handlebars");
    var assemble = require('assemble');
    //var layout_helpers = require("handlebars-helpers/lib/helpers/helpers-layouts");
    var helpers = require("handlebars-helpers");
    var helperPartials = require('handlebars-helper-partial')(handlebars);
    var fs = require("fs");
    var _ = require('underscore');

    var util = require('./otf_util');


    //layout_helpers.register(handlebars);
    helpers.register(handlebars, {}, {
        grunt: {},
        assemble: assemble
    });

    var hbs = exphbs.create({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: [
            'views/partials/',
            'views/'
        ],
        helpers: {
            compare: compare,
            exist2Cond: function(cond_1, cond_2, options) {
                if (arguments.length < 3)
                    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

                var operator = options.hash.operator || "&&";

                var operators = {
                    '&&': function(cond1, cond2) {
                        return cond1 && cond2;
                    },
                    '||': function(cond1, cond2) {
                        return cond1 || cond2;
                    }
                }

                if (!operators[operator])
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

                var result = operators[operator](cond_1, cond_2);

                if (result) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
            exist3Cond: function(cond_1, cond_2, cond_3, options) {
                if (arguments.length < 4)
                    throw new Error("Handlerbars Helper 'compare' needs 3 parameters");

                var operator = options.hash.operator || "&&";

                var operators = {
                    '&&': function(cond1, cond2, cond3) {
                        return cond1 && cond2 && cond3;
                    },
                    '||': function(cond1, cond2, cond3) {
                        return cond1 || cond2 || cond3;
                    }
                }

                if (!operators[operator])
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

                var result = operators[operator](cond_1, cond_2, cond_3);

                if (result) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
            convertIsoDateToString: function(value, format, options) {
                // console.log("### convertIsoDateToString value : ", value);
                if (!value || value === "")
                    return "";
                // console.log("&&&&&&&& format : ", format);
                if (!format || format === "")
                    return util.convertIsoDateToString(value);
                else
                    return util.convertIsoDateToString(value, format);
            },
            convertBooleanToString: function(value, options) {
                if (value)
                    return "Oui";
                return "Non";
            },
            concat: function(lvalue, rvalue) {
                if (!lvalue) lvalue = "";
                if (!rvalue) rvalue = "";
                return lvalue + rvalue;
            },
            replace: function(value, str, replace_str) {
                if (!value)
                    return "";
                return value.replace(new RegExp(str, 'g'), replace_str);
            },
            notnull: function(element, valueOfElement) {
                if (!element)
                    return "";
                if (!valueOfElement)
                    return element;
                return element[valueOfElement];
            },
            length: function(value) {
                //console.log("####### VIEWER LENTGH lvalue :", value);
                if (!value)
                    return 0;
                if (typeof value === "string")
                    return value.length;
                if (typeof value === "object" && _.isArray(value)) {
                    //console.log("####### VIEWER LENTGH lvalue :", value);
                    return value.length;
                }
                return 0;
            },
            partial: function(name, prefix, options) {
                //console.log("########### partial options : ", options);
                var template = handlebars.compile(fs.readFileSync(hbs.partialsDir[0] + prefix + name + ".hbs", 'utf8'));
                return new handlebars.SafeString(template(this));
            },
            contains: function(indexes, prop, value, options) {
                var obj = {};
                obj[prop] = "" + value;
                //console.log("########### contains indexes : ", indexes);
                //console.log("########### contains obj : ", obj);
                //console.log("########### contains _.where(indexes, obj).length : ", _.where(indexes, obj).length);
                if (_.where(indexes, obj).length > 0)
                    return options.fn(this);
                //                  return true;
                //                return false;
                return options.inverse(this);
            },
            returnOptionsSelected: function(list, list_selected, option_text, options) {
                //console.log("000000 ########### returnOptionsSelected list : ", list);
                //console.log("000000 ########### returnOptionsSelected list_selected : ", list_selected);
                //console.log("000000 ########### returnOptionsSelected typeof list_selected : ", typeof list_selected);

                if (typeof list_selected === "string")
                    list_selected = [{
                        _id: list_selected
                    }];
                else if (typeof list_selected === "object" && !_.isArray(list_selected))
                    list_selected = [{
                        _id: String(list_selected)
                    }];

                var html = "";
                if (list) {
                    list = _.sortBy(list, option_text);
                    for (var i = 0; i < list.length; i++) {
                        var selected = false;
                        if (list_selected) {
                            for (var j = 0; j < list_selected.length; j++) {
                                if (String(list[i]._id) === String(list_selected[j]._id)) {
                                    selected = true;
                                    break;
                                }
                            }
                        }
                        if (list[i].actif === false) {} else {
                            if (selected)
                                html += "<option value=" + list[i]._id + " selected>" + list[i][option_text] + "</option>";
                            else
                                html += "<option value=" + list[i]._id + ">" + list[i][option_text] + "</option>";
                        }
                    }
                }
                //console.log("########### returnOptionsSelected html : ", html);
                return html;
            },
            returnOptionsGroupSelected: function(list, optgroup_label, name_pop, list_selected, option_text, options) {
                // console.log("########### returnOptionsGroupSelected list : ", list);
                //console.log("########### returnOptionsGroupSelected list_selected : ", list_selected);
                var html = "";
                if (list) {
                    list = _.sortBy(list, optgroup_label);
                    for (var k = 0; k < list.length; k++) {
                        var listpop = _.sortBy(list[k][name_pop], option_text);
                        if (list[k].actif === false) {} else {
                            if (listpop.length > 0) {
                                html += "<optgroup label='" + list[k][optgroup_label] + "'>";
                                for (var i = 0; i < listpop.length; i++) {
                                    var selected = false;
                                    if (list_selected) {
                                        for (var j = 0; j < list_selected.length; j++) {
                                            if (String(listpop[i]._id) === String(list_selected[j]._id)) {
                                                selected = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (listpop[i].actif === false) {} else {
                                        if (selected)
                                            html += "<option value='" + listpop[i]._id + "' selected>" + listpop[i][option_text] + "</option>";
                                        else
                                            html += "<option value='" + listpop[i]._id + "'>" + listpop[i][option_text] + "</option>";
                                    }
                                }
                                html += "</optgroup>";
                            }
                        }
                    }
                }
                //console.log("########### returnOptionsGroupSelected html : ", html);

                return html;
            },
            withoutOptions: function(list, blacklist, option_text, options) {
                //console.log("########### withoutOptions list : ", list);
                //console.log("########### withoutOptions blacklist : ", list_selected);
                if (typeof blacklist === "string") {
                    var obj = {};
                    obj["_id"] = blacklist;
                    blacklist = [obj];
                } else if (typeof blacklist === "object" && !_.isArray(blacklist)) {
                    //console.log("####### VIEWER LENTGH lvalue :", value);
                    blacklist = [blacklist];
                }

                var html = "";
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var add = true;
                        if (blacklist) {
                            for (var j = 0; j < blacklist.length; j++) {
                                if (String(list[i]._id) === String(blacklist[j]._id)) {
                                    add = false;
                                    break;
                                }
                            }
                        }

                        if (add)
                            html += "<option value=" + list[i]._id + ">" + list[i][option_text] + "</option>";
                    }
                }
                //console.log("########### withoutOptions html : ", html);
                return html;
            },
            toTitleCase: function(str, str_default, options) {
                if (!str_default)
                    str_default = "";

                if (!str) {
                    return str_default;
                }
                return str.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            },
            titlePane: function(str, options) {
                if (!str)
                    return "";

                var str_length = str.length;
                if (str_length > 15) {
                    str_length = 15;
                    str = str.substring(0, str_length) + "...";
                }

                return str.replace('_', ' ');
            },
            toLowerCase: function(str, str_default, options) {
                if (!str_default)
                    str_default = "";

                if (!str)
                    return str_default;

                return str.toLowerCase();
            },
            toUpperCase: function(str, str_default, options) {
                if (!str_default)
                    str_default = "";

                if (!str)
                    return str_default;

                return str.toUpperCase();
            },
            firstLetter: function(mot, options) {
                var _case = options.hash.case || "upper";
                var html = "";
                if (mot) {
                    mot = mot.toUpperCase();
                    if (_case === "lower")
                        mot = mot.toLowerCase();
                    html = mot[0];
                }
                return html;
            },
            splitStringtoArray: function(theString, delimiter, options) {
                var tab = [];
                var tabValues = theString.split(delimiter);
                for (var i = 0; i < tabValues.length; i++) {
                    tab[i] = {
                        "value": tabValues[i]
                    };
                }
                return tab;
            },
            splitString: function(context, options) {
                var ret = "";

                var tempArr = context.trim().split(options.hash["delimiter"]);

                for (var i = 0; i < tempArr.length; i++) {
                    ret = ret + options.fn(tempArr[i]);
                }

                return ret.trim();
            },
            json: function(context, options) {
                return JSON.stringify(context);
            },
            more: function(value, nb, options) {
                if (!value)
                    value = 0;
                return value * 1 + nb * 1;
            },
            base64: function(buffer, options) {
                // console.log("base64 helper : ", buffer);
                // console.log("typeof buffer : ", typeof buffer);
                // return buffer.toString('ascii');
                if (typeof buffer === "string")
                    return buffer.replace(new RegExp(' ', 'g'), '+');
                else
                    return buffer;
            },
            renderPartial: function(partialName, options) {
                if (!partialName) {
                    console.error('No partial name given.');
                    return '';
                }
                var partial = handlebars.compile(fs.readFileSync(hbs.partialsDir[1] + partialName + ".hbs", 'utf8'));
                console.log('******************>  partialName : ' + partial);
                if (!partial) {
                    console.error('Couldnt find the compiled partial: ' + partialName);
                    return '';
                }
                options.hash.str = "";
                options.hash.str = JSON.stringify(options.hash);
                return new handlebars.SafeString(partial(options.hash));
            },
            renderComponent: function(componentName, options) {
                if (!componentName) {
                    console.error('No partial name given.');
                    return '';
                }
                // registering helper compare before to compile the partial, because the partial used #compare to put "selected" attribute
                handlebars.registerHelper('compare', compare);
                var partial = handlebars.compile(fs.readFileSync(hbs.partialsDir[1] + '/components/' + componentName + ".hbs", 'utf8'));
                console.log('******************>  partialName : ' + partial);
                if (!partial) {
                    console.error('Couldn\'t find the compiled partial: ' + componentName);
                    return '';
                }
                options.hash.result = options.data.root.result;
                if (typeof options.hash.values == 'string') options.hash.values = JSON.parse(options.hash.values);
                options.hash.str = "";
                options.hash.str = JSON.stringify(options.hash);
                return new handlebars.SafeString(partial(options.hash));
            }

        }
    });

    function compare(lvalue, rvalue, options) {
        console.log("####### COMPARE lvalue :", lvalue, " et rvalue: ", rvalue);
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        var operator = options.hash.operator || "==";

        var operators = {
            '==': function(l, r) {
                console.log('l == r : ' + (l == r));
                return l == r;
            },
            '===': function(l, r) {
                return l === r;
            },
            'equals': function(l, r) {
                return l.equals(r);
            },
            '!=': function(l, r) {
                return l != r;
            },
            '<': function(l, r) {
                return l < r;
            },
            '>': function(l, r) {
                return l > r;
            },
            '<=': function(l, r) {
                return l <= r;
            },
            '>=': function(l, r) {
                return l >= r;
            },
            'typeof': function(l, r) {
                return typeof l == r;
            },
            'indexof': function(l, r) {
                console.log("#### OTF VIEWER indexof : ", l, " et ", r);
                if (!l)
                    return false;
                console.log("#### l.indexOf(r) : ", l.indexOf(r));
                return l.indexOf(r) != -1;
            },
            'in': function(l, r) {
                if (!l)
                    return false;
                return r.split(',').indexOf(l) != -1;
            },
            'exist': function(obj) {
                if (!obj)
                    return false;
                return true;
            },
            'notexist': function(obj) {
                if (!obj)
                    return true;
                return false;
            },
            'tabempty': function(obj) {
                if (!obj || obj.length == 0)
                    return true;
                return false;
            }
        }

        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

        var result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

};
