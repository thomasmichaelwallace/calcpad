

define([], function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"math":3,"exp":4,"term":5,"OP":6,"CON":7,"NUM":8,"ROP":9,"SYM":10,"fnc":11,"prm":12,"SOP":13,"DOP":14,"arg":15,"XABS":16,"XROT":17,"opt":18,"XOVR":19,"XLGN":20,"pnt":21,"VO":22,"VC":23,"AO":24,"AC":25,"BO":26,"BC":27,"$accept":0,"$end":1},
terminals_: {2:"error",6:"OP",7:"CON",8:"NUM",9:"ROP",10:"SYM",13:"SOP",14:"DOP",16:"XABS",17:"XROT",19:"XOVR",20:"XLGN",22:"VO",23:"VC",24:"AO",25:"AC",26:"BO",27:"BC"},
productions_: [0,[3,0],[3,1],[4,1],[4,2],[4,3],[4,3],[5,1],[5,1],[5,1],[5,1],[5,1],[11,2],[11,3],[11,3],[11,3],[11,3],[11,3],[12,1],[12,1],[12,1],[15,3],[18,3],[21,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:this.$ = 0.0; return this.$;
break;
case 2:this.$ = $$[$0]; return this.$;
break;
case 3:this.$ = $$[$0];
break;
case 4:this.$ = $$[$0-1] + '*' + $$[$0];
break;
case 5:this.$ = $$[$0-2] + $$[$0-1] + $$[$0];
break;
case 6:this.$ = $$[$0-2] + $$[$0-1] + $$[$0];
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:
    // TMW: Injected code.
    this.$ = '_model("' + $$[$0] + '")';
    _global.latexSymbols.push($$[$0]);
    _global.latexPosition.push(this._$.first_column);
break;
case 10:this.$ = $$[$0];
break;
case 11:this.$ = $$[$0];
break;
case 12:this.$ = $$[$0-1].replace(/[$]1/, $$[$0]);
break;
case 13:this.$ = $$[$0-2].replace(/[$]1/, $$[$0-1]).replace(/[$]2/, $$[$0]); 
break;
case 14:this.$ = 'abs(' + $$[$0-1] + ')';
break;
case 15:this.$ = 'pow(' + $$[$0] + ', 1.0/' + $$[$0-1] + ')';
break;
case 16:this.$ = '((' + $$[$0-2] + ')/(' + $$[$0] + '))';
break;
case 17:this.$ = 'log(' + $$[$0-1] + ', ' + $$[$0] + ')';
break;
case 18:this.$ = $$[$0];
break;
case 19:this.$ = $$[$0];
break;
case 20:this.$ = $$[$0];
break;
case 21:this.$ = '(' + $$[$0-1] + ')';
break;
case 22:this.$ = '(' + $$[$0-1] + ')';
break;
case 23:this.$ = '(' + $$[$0-1] + ')';
break;
}
},
table: [{1:[2,1],3:1,4:2,5:3,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{1:[3]},{1:[2,2],5:20,6:[1,21],7:[1,22],8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{1:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[2,3],10:[2,3],13:[2,3],14:[2,3],16:[2,3],17:[2,3],20:[2,3],22:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3]},{1:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],13:[2,7],14:[2,7],16:[2,7],17:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7]},{1:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],13:[2,8],14:[2,8],16:[2,8],17:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8]},{1:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9]},{1:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],13:[2,10],14:[2,10],16:[2,10],17:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10]},{1:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],13:[2,11],14:[2,11],16:[2,11],17:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11]},{5:23,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{15:24,22:[1,17]},{5:25,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{18:26,24:[1,18]},{1:[2,18],6:[2,18],7:[2,18],8:[2,18],9:[2,18],10:[2,18],13:[2,18],14:[2,18],16:[2,18],17:[2,18],19:[1,27],20:[2,18],22:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18]},{15:28,22:[1,17]},{1:[2,19],6:[2,19],7:[2,19],8:[2,19],9:[2,19],10:[2,19],13:[2,19],14:[2,19],16:[2,19],17:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[2,19],27:[2,19]},{1:[2,20],6:[2,20],7:[2,20],8:[2,20],9:[2,20],10:[2,20],13:[2,20],14:[2,20],16:[2,20],17:[2,20],20:[2,20],22:[2,20],23:[2,20],24:[2,20],25:[2,20],26:[2,20],27:[2,20]},{4:29,5:3,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{4:30,5:3,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{4:31,5:3,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{1:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],13:[2,4],14:[2,4],16:[2,4],17:[2,4],20:[2,4],22:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4]},{5:32,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{5:33,8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19]},{1:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],13:[2,12],14:[2,12],16:[2,12],17:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12]},{15:34,22:[1,17]},{16:[1,35]},{15:36,22:[1,17]},{15:37,22:[1,17]},{15:38,22:[1,17]},{5:20,6:[1,21],7:[1,22],8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],23:[1,39],24:[1,18],26:[1,19]},{5:20,6:[1,21],7:[1,22],8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],25:[1,40],26:[1,19]},{5:20,6:[1,21],7:[1,22],8:[1,4],9:[1,5],10:[1,6],11:7,12:8,13:[1,9],14:[1,10],15:13,16:[1,11],17:[1,12],18:15,20:[1,14],21:16,22:[1,17],24:[1,18],26:[1,19],27:[1,41]},{1:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],13:[2,5],14:[2,5],16:[2,5],17:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5]},{1:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],13:[2,6],14:[2,6],16:[2,6],17:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6]},{1:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],13:[2,13],14:[2,13],16:[2,13],17:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13]},{1:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],13:[2,14],14:[2,14],16:[2,14],17:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14]},{1:[2,15],6:[2,15],7:[2,15],8:[2,15],9:[2,15],10:[2,15],13:[2,15],14:[2,15],16:[2,15],17:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15]},{1:[2,16],6:[2,16],7:[2,16],8:[2,16],9:[2,16],10:[2,16],13:[2,16],14:[2,16],16:[2,16],17:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16]},{1:[2,17],6:[2,17],7:[2,17],8:[2,17],9:[2,17],10:[2,17],13:[2,17],14:[2,17],16:[2,17],17:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17],25:[2,17],26:[2,17],27:[2,17]},{1:[2,21],6:[2,21],7:[2,21],8:[2,21],9:[2,21],10:[2,21],13:[2,21],14:[2,21],16:[2,21],17:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21]},{1:[2,22],6:[2,22],7:[2,22],8:[2,22],9:[2,22],10:[2,22],13:[2,22],14:[2,22],16:[2,22],17:[2,22],20:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22]},{1:[2,23],6:[2,23],7:[2,23],8:[2,23],9:[2,23],10:[2,23],13:[2,23],14:[2,23],16:[2,23],17:[2,23],20:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23]}],
defaultActions: {},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 22;
break;
case 2:return 23;
break;
case 3:return 24;
break;
case 4:return 25;
break;
case 5:return 26;
break;
case 6:return 27;
break;
case 7:return 8;
break;
case 8:return 6;
break;
case 9:return 'XPOW';
break;
case 10:return 9;
break;
case 11:yy_.yytext = '*'; return 6;
break;
case 12:yy_.yytext = '*'; return 6;
break;
case 13:yy_.yytext = '/'; return 6;
break;
case 14:yy_.yytext = '/'; return 6;
break;
case 15:yy_.yytext = '_model("' + yy_.yytext.substr(9,yy_.yyleng-11) + '")'; return 9;
break;
case 16:yy_.yytext = 'pi'; return 9;
break;
case 17:yy_.yytext = '('; return 9;
break;
case 18:yy_.yytext = ')'; return 9;
break;
case 19:yy_.yytext = '=='; return 7;
break;
case 20:yy_.yytext = '<'; return 7;
break;
case 21:yy_.yytext = '>'; return 7;
break;
case 22:yy_.yytext = '<='; return 7;
break;
case 23:yy_.yytext = '>='; return 7;
break;
case 24:yy_.yytext = 'log($1)'; return 13;
break;
case 25:yy_.yytext = 'log10($1)'; return 13;
break;
case 26:yy_.yytext = 'sqrt($1)'; return 13;
break;
case 27:yy_.yytext = 'sin($1)'; return 13;
break;
case 28:yy_.yytext = 'cos($1)'; return 13;
break;
case 29:yy_.yytext = 'tan($1)'; return 13;
break;
case 30:yy_.yytext = 'tan($1)'; return 13;
break;
case 31:yy_.yytext = 'cos($1)'; return 13;
break;
case 32:yy_.yytext = 'sin($1)'; return 13;
break;
case 33:yy_.yytext = 'asin($1)'; return 13;
break;
case 34:yy_.yytext = 'acos($1)'; return 13;
break;
case 35:yy_.yytext = 'atan($1)'; return 13;
break;
case 36:yy_.yytext = '(($1)/($2))'; return 14;
break;
case 37:yy_.yytext = '(($1)/($2))'; return 14;
break;
case 38:yy_.yytext = '(($1)/($2))'; return 14;
break;
case 39:yy_.yytext = '(($1)/($2))'; return 14;
break;
case 40:return 16;
break;
case 41:return 17;
break;
case 42:return 19;
break;
case 43:return 'XLGB';
break;
case 44:return 10;
break;
}
},
rules: [/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\d+)/,/^(?:[+-/^])/,/^(?:\^)/,/^(?:e)/,/^(?:\\cdot)/,/^(?:\\times)/,/^(?:\\div)/,/^(?:\\backslash)/,/^(?:\\symbol[{]["][^"]+["][}])/,/^(?:\\pi)/,/^(?:\\{)/,/^(?:\\})/,/^(?:=)/,/^(?:<)/,/^(?:>)/,/^(?:\\leq)/,/^(?:\\geq)/,/^(?:\\ln)/,/^(?:\\log)/,/^(?:\\sqrt)/,/^(?:\\sin)/,/^(?:\\cos)/,/^(?:\\tan)/,/^(?:\\cot)/,/^(?:\\sec)/,/^(?:\\csc)/,/^(?:\\arcsin)/,/^(?:\\arccos)/,/^(?:\\arctan)/,/^(?:\\frac)/,/^(?:\\tfrac)/,/^(?:\\dfrac)/,/^(?:\\cfrac)/,/^(?:\\vert)/,/^(?:\\sqrt)/,/^(?:\\over)/,/^(?:\\log_)/,/^(?:([A-Za-z]|\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\zeta)(_(\{[^}]+}|[\w]))?)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
return parser;
});