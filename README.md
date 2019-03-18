# SanCasia Zero: Core
SanCasia Version Zero Core: The Core of SanCasia Zero

SanCasia Zero is based on the Entity Component Systems[1] principle.
SCZ is by far not the only game engine which is based upon an ECS. It relays on an EventBus for communication and to further decouple dependencies. These two concepts combined allow an interesting degree of independence between the software components.

SanCasia Zero is a proof of concept and therefore performance is currently not a concern.

## npm
SanCasia Zero: Core is available via npm.

``` bash
npm install --save sancasia_zero-core
```

## Getting Started
SanCasia Zero: Core only consists of the most essential parts of the SanCasia game engine. If you want to develop your own games with SanCasia consider building on top of [SanCasia Zero: Base](https://github.com/SanCasia/sancasia_zero-base).

If on the other hand, you are willing to understand how the SanCasia game engine works, we recommend you to continue reading this article, as well as the source code and the associated test cases.

The `hello_world` series is a great starting point.

The source for all examples can be found under `demo/getting_started`.

## Sources
[1] Wikipedia, Entity-component-system, 18/02 2017,  https://en.wikipedia.org/wiki/Entity_component_system
