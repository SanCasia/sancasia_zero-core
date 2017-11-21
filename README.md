# SanCasia Zero: Core
SanCasia Version Zero Core: The Core of SanCasia Zero

SanCasia Zero is based on the principles Entity Component Systems[1].
SCZ is by far not the only game engine which is based upon an ECS. It relays on an EventBus for communication and to further decouple dependencies. These two concepts combined allow an interesting degree of independence between the software components.

SanCasia Zero is a proof of concept and therefore performance is currently not a concern.

## npm
SanCasia Zero: Core is available via npm.

``` bash
npm install --save sancasia_zero-core
```

## Getting Started
SanCasia Zero: Core only consists of the most essential parts of the SanCasia game engine. If you want to develop your own games with SanCasia consider building on top of [SanCasia Zero: Base](https://github.com/SanCasia/sancasia_zero-base).

If on the other hand, you are willing to understand how the SanCasia game engine works, I recommend you to continue reading this article, as well as the source code and the associated test cases.

All examples can be found under `demo/hello_world`.

### Hello World
The very first thing you probably want to do is to write a little hello world.

The first step is to create a new system:
``` typescript
// we can extend from system base
class HelloWorldSystem extends SystemBase implements System
{
  public constructor(eventBus: EventBus)
  {
    // pass the event bus and the event type "Render" to the super constructor.
    // the super constructor will automatically register on the specified event.
    // don't worry about the "[]" yet.
    super([], eventBus, EngineEvent.Render);
  }

  // this function will get called by the game engine.
  // you can see "[]" again.
  // the deltaTime tells us how much time has passed since the last call
  public processEntity(deltaTime: number, []: Array<Component>)
  {
    // log "hello world" to the console
    console.log("Hello World!")
  }
}
```

We are almost done. Let's create and start the game engine:
``` typescript
public static main()
{
  // create a new event bus
  // the event bus is used for communication between the objects
  let eventBus = new EventBus();
  // create a new engine
  let engine = new Engine(eventBus);
  let system = new HelloWorldSystem(eventBus);
  // we need to add at least one entity for the system to compute
  system.registerEntity(new Entity(0));

  // lets start the engine!
  engine.start();
  // ... and activate the system!
  system.activate();
}

> Hello World!
> Hello World!
> ...
```
That's it! We have created our first little game based on SanCasia Zero.

### Part 2: Entities and Components
Now, let's change the example above and add some entities which contain components:
``` typescript
class HelloWorldComponent extends Component
{
  public name: string;
}
```
We also need to change a few lines in the system
``` typescript
class HelloWorldSystem extends SystemBase implements System
{
  public constructor(eventBus: EventBus)
  {
    // the first argument tells the system base class
    // which components the entities need to provide
    // if they should be processed by it.
    super([HelloWorldComponent], eventBus, EngineEvent.Render);
  }

  // the requested components are then passed to this method
  // and we can access and process them with ease.
  public processEntity(deltaTime: number, [component]: [HelloWorldComponent])
  {
    // log "hello world" to the console
    console.log(`Hello ${ component.name }!`)
  }
}
```
Now that our system requests a "complex" entity, it seems to be the right time to write an entity factory:
``` typescript
class HelloWorldEntityFactory
{
  public static create(id: number, name: string): Entity
  {
    // create the entity
    let entity = new Entity(id);
    // create the relevant component
    let component = new HelloWorldComponent();
    // initialise the component
    component.name = name;
    // add the component to the entity
    entity.addComponent(component);

    return entity;
  }
}
```
Lets adapt our main function to these changes:
``` typescript
public static main()
{
  let eventBus = new EventBus();
  let engine = new Engine(eventBus);
  let system = new HelloWorldSystem(eventBus);
  // utilise the factory to create the entities
  let ella = HelloWorldEntityFactory.create(0, "Ella");
  let steve = HelloWorldEntityFactory.create(1, "Steve");
  system.registerEntity(ella);
  system.registerEntity(steve);

  engine.start();
  system.activate();
}

> Hello Ella!
> Hello Steve!
> Hello Ella!
> ...
```
### Part 3: Scenes and the Game
That's nice and all but what about scene changes?

For changing the scene it is recommended to utilize the game object. It implements and hides the necessary logic and offers an interface for most of the things you will need to do, including the handling of systems and entities.
``` typescript
public static main()
{
  // create the new game object
  // this is initializing a new event bus as well as a new engine
  let game = new Game();

  let ellasId = 0;
  let ellasSceneId = 0;
  // define the first scene
  // scene base is sufficent for this example
  game.addScene(new SceneBase(ellasSceneId, game.getEventBus()));
  // add a system to the scene
  game.addSystem(ellasSceneId, new HelloWorldSystem(game.getEventBus()));
  // add en entity to the game
  game.addEntity(HelloWorldEntityFactory.create(ellasId, "Ella"));
  // register an entity in a system
  game.registerEntity(ellasSceneId, HelloWorldSystem, ellasId);

  let stevesId = 1;
  let stevesSceneId = 1;
  // define the second scene
  game.addScene(new SceneBase(stevesSceneId, game.getEventBus()));
  // add a system to the scene
  game.addSystem(stevesSceneId, new HelloWorldSystem(game.getEventBus()));
  // add en entity to the game
  game.addEntity(HelloWorldEntityFactory.create(stevesId, "Steve"));
  // register an entity in a system
  game.registerEntity(stevesSceneId, HelloWorldSystem, stevesId);

  // here we use a local variable to know which scene is currently active
  let activeSceneIndicator = ellasSceneId;

  // define the scene change to happen on the keydown event
  document.addEventListener("keydown", () =>
  {
    // switching based on active scene
    if(activeSceneIndicator == ellasSceneId)
    {
      // deactivate Ellas scene
      game.deactivateScene(ellasSceneId);
      // activate Steves scene
      game.activateScene(stevesSceneId);
      // update our indicator
      activeSceneIndicator = stevesSceneId;
    }
    else
    {
      // deactivating Steves scene
      game.deactivateScene(stevesSceneId);
      // activating Ellas scene
      game.activateScene(ellasSceneId);
      // updating our indicator
      activeSceneIndicator = ellasSceneId;
    }
  });

  // starting the game
  game.start();
  // activating the first scene, Ellas scene
  game.activateScene(ellasSceneId);
}

> Hello Ella!
> Hello Ella!
< <key-stroke>
> Hello Steve!
< <key-stroke>
> Hello Ella!
> ...
```

## Implementation

### Event Bus
An Event Bus is a software component which provides a communication channel. The concept is based on publishers and subscribers. The publisher publishes events through the event bus which will be received by all subscribers, currently subscribed to this event type. Since neither publisher nor subscriber needs to know each other, decoupled communication is achieved.

### Entity Component System
In an entity component system, objects are expressed through entities and their components. Updates are achieved through Systems.

#### Entity
Entities consist of a list of components and an id. The components describe the current state of their entity.

Implementations vary between different approaches. Some may choose to use as little as a list to represent their entities, others decide to give entities more responsibility. I choose to try a data-driven approach and implemented the entities so that they store a list of components and some utility functions.

Components are used to represent all objects.

#### Component
A component is basically a data container and holds most of the relevant data needed by the application. Components are value-object, meaning that they have no identity by them self. They are only relevant if they are part of an entity.

Again, different people choose to implement components differently. Some may choose to use structs, others decide to give components more responsibility. I choose to try a data-driven approach and implemented my components as an abstract class with methods to clone and to assign.

We use components to store the properties of an entity.

#### System
Systems hold most of the logic of the game. They access entities and their components in order to change their values. Systems should have at most one responsibility (single responsibility principle) and thus there are typically a lot of systems in a game.

To further decouple software components I choose to make systems subscribe to events on the event bus. This enables to easily activate and deactivate the systems.

We use systems to define the logic of our game.

### Scene
A scene is a collection of game logic. It is commonly used to represent independent parts of the world of a game. This is because scenes handle activation and deactivation of the relevant systems via events for you.

### Engine
The term engine was probably chosen due to the responsibility of the game engine to drive the game. It is the engines job to tell the correct systems at the right time to start the computation. It is usually also the part which has knowledge of everything from the game.

Due to the loose coupling in SanCasia Zero, it was possible to have the engine do its job without any knowledge of any other software component.

## Sources
[1] Wikipedia, Entity-component-system, 18/02 2017,  https://en.wikipedia.org/wiki/Entity_component_system
