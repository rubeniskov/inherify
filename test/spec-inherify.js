var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies');

chai.use(spies);

var Inherify = require("../lib/inherify");

describe('Inherify', function() {
    describe('Base constructor', function() {
        var proto, base, stic, cotor, inst, args;

        (new (Inherify({'hola':1}).create({hola: 2}).create({'hola': 3}).create({'hola':4})))
        
        beforeEach(function() {
            proto = stic = cotor = inst = args = base =null;
        })

        it('should create a base contructor', function() {
            cotor = Inherify();
            inst = new cotor();
            expect(inst).to.be.instanceof(cotor);
        });

        it('should create a base contructor with a prototype', function() {
            cotor = Inherify({
                foo: function() {
                    this.wow = true;
                },
                bar: 1
            });
            inst = new cotor();


            expect(inst).to.be.instanceof(cotor);
            expect(inst.__proto__).to.have.ownProperty('foo');
            expect(inst.__proto__).to.have.ownProperty('bar');
            expect(inst.foo).to.be.a('function');
            expect(inst.bar).to.be.a('number');
            expect(inst.bar).to.be.equal(1);
            expect(inst.wow).to.not.exist;
            inst.foo = chai.spy(inst.foo);
            inst.foo('bar');
            expect(inst.wow).to.exist;
            expect(inst.wow).to.be.a('boolean');
            expect(inst.foo).to.have.been.called();
            expect(inst.foo).to.have.been.called.with('bar');
        });

        it('should call the constructor function when instantiante', function() {

            cotor = Inherify(proto = {
                __constructor: chai.spy(function(foo, bar) {
                    expect(foo).to.be.equal('foo');
                    expect(bar).to.be.equal('bar');
                })
            });
            inst = new cotor('foo', 'bar');

            expect(proto.__constructor).to.have.been.called();
            expect(proto.__constructor).to.have.been.called.with('foo', 'bar');
        });

        // it('should call the constructor function when instantiante', function() {
        //
        //     cotor = Inherify(proto = {
        //         __constructor: chai.spy(function(foo, bar) {
        //         })
        //     });
        //     inst = new cotor('foo', 'bar');
        //
        //     expect(proto.__constructor).to.have.been.called();
        //     expect(proto.__constructor).to.have.been.called.with('foo', 'bar');
        // });
    });

    describe('Inherital constructor', function() {

        it('should have a super constructor', function() {

            base = chai.spy(require('events'));

            cotor = Inherify(base, proto = {
                __constructor: function() {
                    expect(this._super).to.be.exist;
                    this._super('foo');
                }
            });
            inst = new cotor();

            expect(base).to.have.been.called();
            expect(base).to.have.been.called.with('foo');
        });
    });
});
