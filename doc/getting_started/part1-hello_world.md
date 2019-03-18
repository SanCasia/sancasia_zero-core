# Part 1: Hello World
The very first thing you probably want to do is to write a "hello world", the most simple way to have the words "hello world" printed.  
To accomplish this we need two separate parts and have them cooparate with each other.

The first class is will be a new System, responsible to do the actual printing of our message:
``` typescript
// we can extend from system base
export class HelloWorldSystem extends SystemBase implements System
{
  public constructor(eventBus: EventBus)
  {
    // pass the event bus and the event type "Render" to the super constructor.
    // SystemBase will register to the specified event and
    // start the execution at the apporprate time.
    // don't worry about the "[]" yet.
    super([], eventBus, EngineEvent.Render);
  }

  // this function is an indirect callback to the regsitered event.
  // the deltaTime tells us how much time has passed since the last call
  // you can again see "[]".
  public processEntity(_deltaTime: number, []: Array<Component>)
  {
    // log "hello world" to the console
    console.log("Hello World!")
  }
}
```

Now for the second and last part, the creation of the actual game engine is key. We have to initialise a new Engine and activate it as well as the before created system.
``` typescript
public static main()
{
  // create a new event bus
  // the event bus is used for communication between
  // the game engine, systems etc
  let eventBus = new EventBus();
  // create a new engine
  let engine = new Engine(eventBus);
  // initialise our System
  let system = new HelloWorldSystem(eventBus);

  // we need to add at least one entity for the system to actually compute
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
That's it! We have created a simple HelloWorld based on SanCasia Zero.
