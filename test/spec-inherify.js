var chai = require('chai'),
    expect = chai.expect,
    spies = require('chai-spies');

chai.use(spies);

var Inherify = require("../lib/inherify");

describe('Inherify', function() {
    describe('Base constructor', function() {
        var proto, stic, cotor, inst, args;

        beforeEach(function(){
            proto = stic = cotor = inst = args = null;
        })

        it('should create a base contructor', function() {
            cotor = Inherify();
            inst = new cotor();
            expect(inst).to.be.instanceof(cotor);
        });

        it('should create a base contructor with a prototype', function() {
            cotor = Inherify({
                foo: chai.spy(function(){

                }),
                bar: 1
            });
            inst = new cotor();
            //console.dir(inst.__proto__);
            console.log(inst.hasOwnProperty(inst.foo));
            console.log(inst.bar);
            inst.foo('bar')
            expect(inst).to.be.instanceof(cotor);
            expect(inst.__proto__).to.have.ownProperty('foo');
            expect(inst.__proto__).to.have.ownProperty('bar');
            // expect(inst.foo).to.be.a('function');
            // expect(inst.bar).to.be.a('number');
            // expect(inst.foo).to.have.been.called();
            // expect(inst.foo).to.have.been.called.with('bar');
            // expect(inst.bar).to.be.equal(proto);
        });

        it('should call the constructor function when instantiante', function() {

            cotor = Inherify(proto = {
                __constructor: chai.spy(function(foo, bar) {
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
        // this.timeout(15000);
        // it('should print help to stdout', function(done) {});
    });
});
