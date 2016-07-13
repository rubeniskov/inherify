const
    MAX_SAFE_UID = -1 >>> 1,
    FN_INSPECTOR = /xyz/.test(function() {
        xyz;
    }),
    REGEXP_FN_SUPER = /\b\_super(Apply)?\b/;

var ctorSuper = function(supr, name, context, args) {
        if (!(name in supr))
            throw new Error("Super Method [ " + name + " ] doesn't exists");
        if (!supr[name].apply)
            throw new Error("Super Method [ " + name + " ] is not a function");
        return supr[name].apply(context, args);
    },
    ctorHasSuper = function(fn) {
        return FN_INSPECTOR ? REGEXP_FN_SUPER.test(fn) : true;
    },
    ctorBind = function(supr, name, fn) {
        var fn_super = function() {
                return ctorSuper(supr, name, this, arguments);
            },
            fn_superApply = function(sname, args) {
                if (sname instanceof Array) {
                    args = sname;
                    sname = name;
                }
                return ctorSuper(supr, sname, this, args);
            }
        return function() {
            $$super = this._super;
            this._super = fn_super;
            $$superApply = this._superApply;
            this._superApply = fn_superApply;
            $value = fn.apply(this, arguments);
            (this._self = $$self) === undefined && delete this._self;
            (this._super = $$super) === undefined && delete this._super;
            (this._superApply = $$superApply) === undefined && delete this._superApply;
            return $value;
        }
    },
    ctorUID = function(uid, offset) {
        return (((uid >>> offset) + 1) << offset)
    },
    ctorSlice = function(arr, start, end) {
        return arr && arr.slice ?
            arr.slice(start, end) :
            Array.prototype.slice.call(arr, start, end);
    },
    ctorHop = function(obj, prop) {
        return Object.hasOwnProperty.call(obj, prop);
    },
    ctorType = function(obj) {
        return Object.prototype.toString.call(obj);
    },
    ctorExtend = function(supr, proto, extend) {
        var value, type;
        for (var name in extend) {
            if (!ctorHop(extend, name))
                continue;
            switch ((type = ctorType(value = extend[name]))) {
                case /Function/.test(type) && ctorHasSuper(value):
                    value = ctorBind(supr, name, value);
                    break;
            }
            proto[name.replace(/^((\_){1,2}construct(or)?)$/, '__construct')] = value;
        }
    },
    ctorInherit = function(suprs) {
        var ctor, i = -1,
            suprs = arguments[0] instanceof Array ?
            arguments[0] :
            arguments,
            length = suprs.length;
        for (; i < length; ++i) {
            ctor = ctorBase();
            supr = (suprs[i] || Object).prototype;
            supr.__construct = supr.__construct || suprs[i];
            proto = Object.create(supr);
            proto.constructor = ctor;
            ctor.prototype = proto;

            ctor.extend = function(extend, statc) {
                return ctorExtend(supr, ctor, statc) && ctorExtend(supr, proto, extend) || ctor; // TODO improve methods
            };

            ctor.create = function(proto, statc) {
                return ctorCreate(supr, proto, statc); // TODO multiple super
            };
        }

        return ctor;
    },
    ctorBase = function() {
        return function CBase(c, t, o, r, b, a, s, e) {
            this.__construct && (arguments.length <= 8 ?
                this.__construct.call(this, c, t, o, r, b, a, s, e) :
                this.__construct.apply(this, arguments));
            return this;
        }
    },
    ctorCreate = function() {
        var args = arguments,
            cur = args.length,
            proto, statc, suprs = [];
        for (; cur--;) {
            if (typeof(args[cur]) === 'function') {
                suprs.unshift(args[cur]);
            } else if (proto) {
                statc = proto;
                proto = args[cur];
            } else {
                proto = args[cur]
            }
        }
        return (ctorInherit(suprs).extend(proto, statc));
    }

module.exports = ctorCreate;
