const
    MAX_SAFE_UID = -1 >>> 1,
    FN_INSPECTOR = /xyz/.test(function() {
        xyz;
    }),
    REGEXP_FN_SUPER = /\b\_super(Apply)?\b/;
var guid = 0;
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
    ctorNew = function(ctor, args){
        return new(Function.prototype.bind.apply(ctor, args));
    },
    ctorBind = function(supr, name, fn) {
        var _value, _super, _superApply,
            fn_super = function() {
                return ctorSuper(supr, name, this, arguments);
            },
            fn_superApply = function(sname, args) {
                if (sname instanceof Array) {
                    args = sname;
                    sname = name;
                }
                return ctorSuper(supr, sname, this, args);
            };
        return function() {
            _super = this._super,
            _superApply = this._superApply;
            this._super = fn_super;
            this._superApply = fn_superApply;
            _value = fn.apply(this, arguments);
            (this._super = _super) === undefined && delete this._super;
            (this._superApply = _superApply) === undefined && delete this._superApply;
            return _value;
        }
    },
    ctorApply = function(fn, context, args){
        return fn && fn.apply && fn.apply(context, args);
    },
    ctorUID = function(uid, offset) {
        return (((uid >>> offset) + 1) << offset)
    },
    ctorSlice = function(arr, start, end) {
        return arr && arr.slice ?
            arr.slice(start, end) :
            Array.prototype.slice.call(arr, start, end);
    },
    ctorSet = function(target, prop, value){
        return target[prop] = value;
    },
    ctorHop = function(obj, prop) {
        return Object.hasOwnProperty.call(obj, prop);
    },
    ctorType = function(obj) {
        return Object.prototype.toString.call(obj).match(/\[\w+\s(\w+)\]/)[1].toLowerCase();
    },
    ctorExtend = function(target, source, resolve) {
        for (var name in source)
            if(ctorHop(source, name)){
                !resolve
                  ? ctorSet(target, name, source[name])
                  : resolve(name, source[name], ctorType(source[name]), function(value){
                    ctorSet(target, name, value);
                })
            }
    },
    ctorStatic = function(ctor, struct) {
        return ctorExtend(ctor, struct);
    },
    ctorProto = function(supr, proto, struct) {
        return ctorExtend(proto, struct, function(name, value, type, set) {
            switch (type) {
                case 'function':
                    return set(ctorHasSuper(value) ? ctorBind(supr, name, value) : value);
            }
            return set(ctorHasSuper(value) ? ctorBind(supr, name, value) : value);
        });
    },
    ctorInherit = function(supr) {
        var ctor = ctorBase(),
            proto,
            sproto = (supr = supr || ctor).prototype;
        sproto.__constructor = sproto.__constructor || supr;
        proto = Object.create(sproto);
        proto.constructor = ctor;
        ctor.prototype = proto;
        ctor.extend = function(struct, statc) {
            struct && ctorProto(sproto, proto, struct);
            statc && ctorStatic(ctor, statc);
            return ctor;
        };

        ctor.create = function(struct, statc) {
            return ctorCreate(supr, struct, statc);
        };

        ctor.new = function(args){
            return ctorNew(ctor, args);
        };

        ctor.implement = function() {

        };

        return ctor;
    },
    ctorBase = function() {
        var cuid = guid = ctorUID(guid, 12);
        return function CBase(c, t, o, r, b, a, s, e) {
            if(!(this instanceof CBase))
                return ctorNew(CBase, arguments);
            this.__uid__ = cuid = ctorUID(cuid);
            this.__constructor && this.__constructor !== CBase && (arguments.length <= 8 ?
                this.__constructor.call(this, c, t, o, r, b, a, s, e) :
                this.__constructor.apply(this, arguments));
            return this;
        }
    },
    ctorCreate = function() {
        var args = arguments,
            cur = args.length,
            struct, statc, supr;
        for (; cur--;) {
            if (typeof(args[cur]) === 'function') {
                supr = args[cur];
            } else if (struct) {
                statc = struct;
                struct = args[cur];
            } else {
                struct = args[cur]
            }
        }
        return (ctorInherit(supr).extend(struct, statc));
    }

module.exports = ctorCreate;
