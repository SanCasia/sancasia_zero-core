# SanCasia Zero: Core
SanCasia Version Zero Core: The Core of SanCasia Zero

SanCasia Zero is based on the principles Entity Component Systems[1].
SCZ is by far not the only game engine which is based upon an ECS and that's okay. It also relays on en EventBus for communication further decoupling dependencies. These two concepts combined allow an interesting degree of independence between the software components.

SanCasia Zero is a Proof of Concept and performance is none of its concerns.

## Implementation

### Event Bus
An Event Bus is a software component which provides a communication channel. The concept is based on publishers and subscribers. The publisher publishes events through the event bus which will be received by all subscribers currently subscribed to this event type. Since nether publisher nor subscriber need to know each other, decoupled communication is achieved.

### Entity Component System
In an entity component system objects are expressed through entities and there components. Changes are achieved through Systems.

#### Entity
Entities consist of a list of components and an id. The entities components describe the current state of there entity. Entities hold no information other then there identity by them self.

Implementations vary from approach to approach. Some choose to use as little as a list to represent there entities others like to give entities more responsibility. I choose to try a data driven approach and implemented my entities with a list of components and some supporting functions.

We use components to represent all objects.

#### Component
A component is basically a data container and holds most of the relevant data needed by the application. Components are value object meaning that they have no identity by them self. They only have meaning if they are part of an Entity.

Implementations vary from approach to approach. Some choose to use plain old structs others like to give components more responsibility. I choose to try a data driven approach and implemented my components as an abstract class with methods to clone and to assign.

We use components to store the properties of an entity.

#### System
Systems hold most of the games logic. They act on entities and there components and change there values. Systems should only have one responsibility (single responsibility principle) and thus there are typically not just a few systems involved in one application.

To further decouple software components I choose to make systems subscribers of events on the event bus. The his enables easy activation and deactivation of systems.

We use systems to define our applications logic.

### Scene
A scene is a collection of game logic. It is most commonly used to model independent parts of a games world because scenes handle activation and deactivation of the relevant systems via events for you.

### Engine
The term engine was probably chosen due to the responsibility of the game engien to drive the game. It is the engines job to tell the correct systems at the right time to start there computation. It is usually also the part which has knowledge over everything within the game.

Due to the loose coupling in this implementation it was possible to have the engine do its job with out any knowledge of any other software component.

## Decisions
In this section I collect some of the decision I made for this project.

### How does the engine start the computation of systems?
Systems subscribe on events like "engine_prerender" or "engine_render" which in return get called by the engine. It is the systems responsibility to subscribe to the correct event. This enables easy activation and deactivation of systems as well as the implementation of a general purpose engine.

### Can entities share components?
Example: If the player enters another part of the world (aka changes scenes) will he be the same entity?

If not it would be convenient for those two entities to share some components like maybe the health component, inventory etc.

Else if he continues to be the same entity, the entity has to be shared between systems of different scenes. Thought this is not as much of a problem since entities are uniquely identifiable.

Entities cannot share components. Components are value objects.

Related decisions:
Can scenes share systems?

### Can scenes share systems?
Example: If the player enters another part of the world (aka changes scenes) will his entity (provided it stays the same) switch instances of systems?

If systems are shared (reused) the same system would have to be able to handle multiple entries for the same entity (see "Can systems handle multiple registrations by the same entity?")

However this is extremely unpractical when it comes to activation and deactivation of scenes them self. This will not be explicitly supported.

Related decisions:
Can entities share components?
Can systems handle multiple registrations by the same entity?

### Can systems handle multiple registrations by the same entity?
Use case: The entity is in some kind of superposition (two places at once). The two superposition share some properties (components).

The entity could register two translate components with possibly the same render component (different position, same view model) to the render system. It would have to do the same with many other system as well (damage system etc).

This could be solved with "component bags". Basically systems wouldn't act on entities anymore but on these bags of components. Further more the components in these collection do not have to belonging to the same entity.

Implementing this with two entities would ether not be supported (see "Can entities share components?") or would require some kind of superposition system which synchronizes the components.

This is not possible due to serious issues encountered during implementation.

### How do entities and systems connect?
If systems can handle multiple registrations of/by the same entity (see "Can systems handle multiple registrations by the same entity?") the act of registration isn't as straight forward anymore.

The base implementation of the system requests the creation of a cache (or components bag) from the registered entity. The entity is in full control of this cache and thus capable of creating differing caches for repeated registrations.

### Should the engine control everything?
Should I be able to access the whole game via the engine?
``` typescript
engine.addScene(scene);
engine.getActiveScenes();
engine.addEntity(scene.getId(), systemType, entity);
engine.getEntity(entityId);
```
This could be very convenient for the developers but goes - in my eyes - against the single responsibility principal. I would prefer to have this structure in a separated class. This class, lets call it game, could be used as follows.
``` typescript
// this already creates an engine including event bus
let game = new Game();

// adds inter-scene entities to the game
game.addEntity(PlayerFactory.create(000));

// creates a scene
game.addScene(new DesertScene(100));
// add systems
game.addSystem(100, new RenderSystem(game.getEventBus()));
game.addSystem(100, new PlayerSystem(game.getEventBus()));
game.addSystem(100, new DoorSystem(game.getEventBus()));
// create and add entities
game.registerEntity(100, RenderSystem, 000);
game.registerEntity(100, PlayerSystem, 000);
game.addEntity(PyramidFactory.create(101, ...));
game.registerEntity(100, RenderSystem, 101);
game.addEntity(DoorFactory.create(102, ...));
game.registerEntity(100, RenderSystem, 102);
game.registerEntity(100, DoorSystem, 102);

// next scene
...

// and finally
game.activateScene(100);
game.start();

```
This is officially approved.


## Sources
[1] Wikipedia, Entity-component-system, 18/02 2017,  https://en.wikipedia.org/wiki/Entity_component_system
