// ------------------------------------------------------------------------------
// The following custom elements module is a PROTOTYPE. It is not heavily tested.
// ------------------------------------------------------------------------------

(function(global, undefined) {
    function attachToKo(ko) {
        ko.componentBindingProvider = function(providerToWrap) {
            this._providerToWrap = providerToWrap;
            this._nativeBindingProvider = new ko.bindingProvider();
        };

        ko.componentBindingProvider.prototype.nodeHasBindings = function(node) {
            if (this.nodeIsCustomComponentElement(node)) {
                return true;
            }

            return this._providerToWrap.nodeHasBindings.apply(this._providerToWrap, arguments);
        };

        ko.componentBindingProvider.prototype.getBindingAccessors = function(node, bindingContext) {
            var bindings = this._providerToWrap.getBindingAccessors.apply(this._providerToWrap, arguments);

            if (this.nodeIsCustomComponentElement(node)) {
                bindings = bindings || {};
                if (bindings.component) {
                    throw new Error("Disallowed binding 'component' on element " + node);
                }

                // Wrap the data extraction inside a ko.computed purely to suppress dependency detection.
                // We don't want the component to be torn down and rebuilt whenever any of the observables
                // read to supply its data changes. Instead we wrap any such observables and pass them
                // onto the component itself, so it can react to changes without being completely replaced.
                ko.computed(function() {
                    var valueForComponentBindingHandler = {
                        name: node.tagName.toLowerCase(),
                        params: this._getComponentDataObjectFromAttributes(node, bindingContext)
                    };
                    bindings.component = function () { return valueForComponentBindingHandler; };
                }, this);
            }

            return bindings;
        };

        ko.componentBindingProvider.prototype.nodeIsCustomComponentElement = function(node) {
            return node && (node.nodeType === 1) && ko.components.isRegistered(node.tagName.toLowerCase());
        }

        ko.componentBindingProvider.prototype._getComponentDataObjectFromAttributes = function(elem, bindingContext) {
            var attributes = elem.attributes || [],
                result = {};

            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                if (attribute.specified === false) {
                    // IE7 returns about a hundred "unspecified" attributes on every element. Skip them.
                    continue;
                }

                var attributeName = attribute.name,
                    propertyName = toCamelCase(attributeName),
                    valueText = attribute.value || "";

                if (valueText.substring(0, 2) === "{{" && valueText.substring(valueText.length - 2) === "}}") {
                    // Dynamic expressions are converted to writable computeds
                    // TODO: Handle "{{abc}} some string {{def}}", i.e., proper interpolation
                    valueText = valueText.substring(2, valueText.length - 2);

                    var valueDummyBinding = "value: " + valueText,
                        valueAccessors = this._nativeBindingProvider.parseBindingsString(valueDummyBinding, bindingContext, elem, {
                            'valueAccessors': true
                        }),
                        valueReader = valueAccessors.value,
                        valueReaderInitialValue = valueReader();

                    if (ko.isObservable(valueReaderInitialValue)) {
                        // If it's just an observable instance, pass it straight through without wrapping
                        result[propertyName] = valueReaderInitialValue;
                    } else {
                        // If it's not an observable instance, but is evaluated with reference to observables,
                        // then we promote the parameter to an observable so the receiving component can
                        // observe changes without us having to tear down and replace the component on each change.
                        //
                        // We differentiate between "a function of some observables" and "a function of no observables"
                        // by testing whether or not the wrapped computed has any active dependencies.
                        var valueWriter = valueAccessors._ko_property_writers ? valueAccessors._ko_property_writers().value : undefined,
                            valueWrappedAsObservable = ko.computed({
                                read: valueReader,
                                write: valueWriter
                            }, null, { disposeWhenNodeIsRemoved: elem });
                        result[propertyName] = valueWrappedAsObservable.isActive() ? valueWrappedAsObservable : valueReaderInitialValue;
                    }
                } else {
                    // Everything else is interpreted as a string, and is passed literally
                    result[propertyName] = valueText;
                }
            }

            return result;
        }

        function toCamelCase(str) {
            return str.replace(/-([a-z])/g, function(a, capture) {
                return capture.toUpperCase();
            });
        }


        ko.bindingProvider.instance = new ko.componentBindingProvider(ko.bindingProvider.instance);

        supportOldIE();
    }

    // Note that since refactoring to build on KO's native components feature, none of the
    // following old-IE code has been tested or even run on an old IE instance, so might
    // have stopped working. The real implementation will be tested properly, of course.
    function supportOldIE() {
        var oldIeVersion = document && (function() {
            var version = 3,
                div = document.createElement('div'),
                iElems = div.getElementsByTagName('i');

            // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
            while (
                div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
                iElems[0]
            ) {}
            return version > 4 ? version : undefined;
        }());

        if (oldIeVersion < 9) {
            // Support old IE by patching ko.components.register to ensure that we have called
            // document.createElement(componentName) at least once before trying to parse any
            // markup that might use a custom element with that name
            var allCustomComponentNames = [];
            ko.components.register = (function(underlyingRegisterFunc) {
                return function(componentName) {
                    allCustomComponentNames.push(componentName);
                    underlyingRegisterFunc.apply(this, arguments);
                    document.createElement(componentName);
                };
            })(ko.components.register);

            // Also to enable custom elements on old IE, we have to call document.createElement(name)
            // on every document fragment that ever gets created. This is especially important
            // if you're also using jQuery, because its parseHTML code works by setting .innerHTML
            // on some element inside a temporary document fragment.
            // It would be nicer if jQuery exposed some API for registering custom element names,
            // but it doesn't.
            document.createDocumentFragment = (function(originalDocumentCreateDocumentFragment) {
                return function() {
                    // Note that you *can't* do originalDocumentCreateDocumentFragment.apply(this, arguments)
                    // because IE6/7 complain "object doesn't support this method". Fortunately the function
                    // doesn't take any parameters, and doesn't need a "this" value.
                    var docFrag = originalDocumentCreateDocumentFragment();
                    if (docFrag.createElement) {
                        for (var i = 0; i < allCustomComponentNames.length; i++) {
                            if (componentConfigRegistry.hasOwnProperty(allCustomComponentNames[i])) {
                                docFrag.createElement(allCustomComponentNames[i]);
                            }
                        }
                    }
                    return docFrag;
                };
            })(document.createDocumentFragment);
        }
    }

    // Determines which module loading scenario we're in, grabs dependencies, and attaches to KO
    function prepareExports() {
        if (typeof define === 'function' && define.amd) {
            // AMD anonymous module
            define(["knockout"], attachToKo);
        } else if ('ko' in global) {
            // Non-module case - attach to the global instance, and assume
            // knockout-components.js is already loaded.
            attachToKo(global.ko);
        } else {
            throw new Error('Couldn\'t find an instance of ko to attach to');
        }
    }

    prepareExports();
})(this);