/**
 * Created by epa on 10/12/14.
 */
module.exports = function (app) {
    var exphbs = require('express-handlebars');
    var handlebars = require("handlebars");
    var assemble = require('assemble');
//var layout_helpers = require("handlebars-helpers/lib/helpers/helpers-layouts");
    var helpers = require("handlebars-helpers");
//layout_helpers.register(handlebars);
    helpers.register(handlebars, {}, {grunt: {}, assemble: assemble});
    var hbs = exphbs.create({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: [
            'views/partials/'
        ],
        helpers: {
            compare: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

                operator = options.hash.operator || "==";

                var operators = {
                    '==': function (l, r) {
                        return l == r;
                    },
                    '===': function (l, r) {
                        return l === r;
                    },
                    '!=': function (l, r) {
                        return l != r;
                    },
                    '<': function (l, r) {
                        return l < r;
                    },
                    '>': function (l, r) {
                        return l > r;
                    },
                    '<=': function (l, r) {
                        return l <= r;
                    },
                    '>=': function (l, r) {
                        return l >= r;
                    },
                    'typeof': function (l, r) {
                        return typeof l == r;
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
            },
            json: function (context) {
                return JSON.stringify(context);
            }

        }
    });

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

};