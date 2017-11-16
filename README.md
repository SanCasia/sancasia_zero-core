# SanCasia Zero: Core
SanCasia Version Zero Core: The Core of SanCasia Zero

SanCasia Zero is based on the principles Entity Component Systems[1].
SCZ is by far not the only game engine which is based upon an ECS and that's okay. It also relays on en EventBus for communication further decoupling dependencies. These two concepts combined allow an interesting degree of independence between the software components.

SanCasia Zero is a Proof of Concept and performance is none of its concerns.

## npm
SanCasia Zero: Core is available to you via npm.

``` bash
npm install --save sancasia_zero-core
```

## Getting Started
SanCasia Zero: Core only consists of the most essential parts of the SanCasia game engine. If you want to develop your own games with SanCasia consider building on top of [SanCasia Zero: Base](https://github.com/SanCasia/sancasia_zero-base).

If on the other hand you are willing to understand how the SanCasia game engine works I recommend you to continue reading this paper as well as the source code and the associated test cases.

All examples can be found under `demo/hello_world`

### Hello World
The very first thing you probably want to do is to write a little hello world.

First of all you will need a system:
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
  // you can again see "[]".
  // the deltaTime tells us how much time has passed since the last call
  public processEntity(deltaTime: number, []: Array<Component>)
  {
    // log "hello world" to the console
    console.log("Hello World!")
  }
}
```

We are almost done. Lets create and start the game engine:
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
That's it! We have created our fist little application based on SanCasia Zero.

### Part 2: Entities and Components
Now lets change the above example and add some entities with components:
``` typescript
class HelloWorldComponent extends Component
{
  public name: string;
}
```
We also want to change a few lines in the system
``` typescript
class HelloWorldSystem extends SystemBase implements System
{
  public constructor(eventBus: EventBus)
  {
    // the first argument tells the system base class
    // which components entities need to provide
    // if they want to be processed by us.
    super([HelloWorldComponent], eventBus, EngineEvent.Render);
  }

  // the requested components are then passed to this function
  // and we can access and process them with ease.
  public processEntity(deltaTime: number, [component]: [HelloWorldComponent])
  {
    // log "hello world" to the console
    console.log(`Hello ${ component.name }!`)
  }
}
```
Now that our system requests a "complex" entity it seems to be the right time to write a entity factory:
``` typescript
class HelloWorldEntityFactory
{
  public static create(id: number, name: string): Entity
  {
    // create the entity
    let entity = new Entity(id);
    // create relevant component
    let component = new HelloWorldComponent();
    // initialise component
    component.name = name;
    // add component to entity
    entity.addComponent(component);

    return entity;
  }
}
```
Lets update our main function to embrace these changes:
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

For scene changes we recommend to utilise the game object. It implements and hides the necessary logic and offers an interface for most of the things you will need to do including the handling of systems and entities.
``` typescript
public static main()
{
  // create the new game object
  // this is initializing a new event bus as well as a new engine
  let game = new Game();

  let ellasId = 0;
  let ellasSceneId = 0;
  // define the first scene
  // scene base suffice for this example
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
The term engine was probably chosen due to the responsibility of the game engine to drive the game. It is the engines job to tell the correct systems at the right time to start there computation. It is usually also the part which has knowledge over everything within the game.

Due to the loose coupling in this implementation it was possible to have the engine do its job with out any knowledge of any other software component.

## Sources
[1] Wikipedia, Entity-component-system, 18/02 2017,  https://en.wikipedia.org/wiki/Entity_component_system
