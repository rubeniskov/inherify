module.exports = (function() {

    var ctorCUID = 0,
        ctorOUID = 0,
        ctorRegExp = {
            regexp_constructor: /constructor/,
            regexp_magic_fn: /^__/,
            regexp_private_fn: /^_/,
            regexp_has_super_fn: /xyz/.test(function() {
                xyz;
            }) ? (/\b\_super(Apply)?\b/) : false
        },
        ctorHash = function(uid) {
            return uid.toString(16).toUpperCase();
        },
        ctorHasSuper = function(fn) {
            return ctorRegExp.regexp_has_super_fn === false ||  ctorRegExp.regexp_has_super_fn.test(fn);
        },
        ctorSuper = function(_sproto, name, context, args) {
            name = ctorRegExp.regexp_constructor.test(name) && !Object.hasOwnProperty.call(_sproto, name) ? 'constructor' : name;
            if (!Object.hasOwnProperty.call(_sproto, name))
                throw new Error("Super Method [ " + name + " ] doesn't exists");
            if (!_sproto[name].apply)
                throw new Error("Super Method [ " + name + " ] is not a function");
            return _sproto[name].apply(context, args);
        },
        ctorExtend = function(_source, _prototype, _super, _constructor) {
            for (var pname in _source)
                _prototype[pname] = Object.hasOwnProperty.call(_source, pname) && (function(pname, pvalue, ptype) {
                    if (/Function/.test(ptype)) {
                        if (!_super || !ctorHasSuper(pvalue))
                            return pvalue;

                        return (function(fn, fn_super, fn_superApply, __self, __super, __superApply, __value) {
                            return function() {
                                __self = this._self;
                                this._self = _constructor;
                                __super = this._super;
                                this._super = fn_super;
                                __superApply = this._superApply;
                                this._superApply = fn_superApply;

                                _value = fn.apply(this, arguments);

                                (this._self = __self) === undefined && delete this._self;
                                (this._super = __super) === undefined && delete this._super;
                                (this._superApply = __superApply) === undefined && delete this._superApply;

                                return _value;
                            }
                        })(pvalue,
                            function() {
                                return ctorSuper(_super, pname, this, arguments);
                            },
                            function(name, args) {
                                return ctorSuper(_super, name, this, args);
                            });
                    }
                    if (/Object/.test(ptype))
                        return Object.create(pvalue); //ctorExtend(pvalue, Object.create(pvalue), _super, _constructor);
                    return pvalue;
                })(pname, _source[pname], Object.prototype.toString.call(_source[pname]));
            return _constructor;
        },
        ctorContructor = function() {
            return function() {
                this.__hash = [this.constructor.__hash, ctorHash(++ctorOUID)].join(':');
                this.__constructor && this.__constructor.apply && this.__constructor.apply(this, arguments);
                return this;
            }
        };

    return function ctorCreate(_super, _source, _static) {
        if (_super && typeof(_super) === 'object')
            return ctorCreate(null, _super, _source || false);

        var __init = true,
            __constructor = ctorContructor(),
            __super = (_super || __constructor).prototype,
            __prototype = Object.create(__super);

        __constructor.extend = function(source) {
            return ctorExtend(source, __prototype, __super, __constructor); // && __constructor;
        };
        __constructor.static = function(source) {
            return ctorExtend(source, __constructor, __super.constructor, __constructor); // && __constructor;
        };
        __constructor.create = function(source, static) {
            return ctorCreate(__constructor, source, static || false);
        };
        __constructor.new = function() {
            return new(Function.prototype.bind.apply(__constructor, arguments));
        };

        __prototype._parent = _super;
        __prototype.constructor = __constructor;
        __constructor.prototype = __prototype;
        __constructor._super = __super.constructor;
        __constructor.__hash = ctorHash(++ctorCUID);
        _source && __constructor.extend(_source);
        _static && __constructor.static(_static);
        __init = false;

        return __constructor;
    };
})();
