# Part 2: Entities and Components
Let's extend the hello world example to learn about `Entities` and `Components`.  
A `Component` is a value object belonging to an entity, describing its current state. If we want for example want to know the name of an `Entity` we could write a `Component` like this:
``` typescript
class HelloWorldComponent extends Component
{
  // the entity describing attribute
  public name: string;
}
```

To use this newly defied property we need to change a few lines in our system:
``` typescript
class HelloWorldSystem extends SystemBase implements System
{
  public constructor(eventBus: EventBus)
  {
    // the first argument tells the system base class
    // which components entities need to provide
    // if they want to be processable by the System.
    super([HelloWorldComponent], eventBus, EngineEvent.Render);
  }

  // the requested components are then passed to this function
  // and we can access and manipulate them.
  public processEntity(
    _deltaTime: number,
    [component]: [HelloWorldComponent])
  {
    // log "hello" + the name of the Entity to the console
    console.log(`Hello ${ component.name }!`)
  }
}
```
Now that our system requests a "complex" entity, it seems fitting to introduce a factory for its creation:
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
  // register the Entities so they get processed
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
