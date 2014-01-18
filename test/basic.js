var assert = require('chai').assert;
var sinon = require('sinon');

var testee = require('../index.js');

describe('Main module', function() {

    it('should be an object with 2 methods', function() {
        assert.isObject(testee);
        assert.isFunction(testee.get);
        assert.isFunction(testee.install);
    });

    describe('.get', function() {

        it('should require at least one argument to function', function() {
            assert.throws(function() { testee.get(); });
        });
    });

    describe('.install', function() {

        it('should require at least one argument to function', function() {
            assert.throws(function() { testee.install(); });
        });
    });



});