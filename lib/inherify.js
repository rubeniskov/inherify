const extend = require('util-extend');
module.exports = function(superCtor, struct) {
    var ctor = function() {
        this.__constructor && this.__constructor.apply(this, arguments);
    };
    ctor.super_ = ctor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    ctor.prototype = extend(ctor.prototype, struct)
    ctor.prototype.__super = function() {
        return superCtor.apply(this, arguments)
    }
    ctor.prototype.__superApply = function(args) {
        return superCtor.apply(this, args)
    }
    return ctor;
}
