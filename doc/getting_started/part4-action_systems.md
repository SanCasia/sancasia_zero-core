# Part 4: Action Systems
Now that we have to `Scenes` we probably want to access them both.  
In many cases this involves user interaction: opening a door to another room, accessing the settings to save the current state etc.

In our example we will simply change to the other `Scene` every time any key is pressed. For this we need two things. First, an `ActionInterpreter` and `ActionEvent` which are responsible to interpret input from a specific medium - in our case the keyboard - and then publish the result. For example, in a classic jump'n'run the interpreter would map the pressing of the space bar to the jump action and send an `ActionEvent` to everyone listening that the player wants to jump.


A simple `ActionEvent` usually looks something like this:
``` typescript
class HelloWorldActionEvent implements ActionEvent
{
  static EventName = "ACTION_EVENT::HELLO_WORLD";
  readonly name = HelloWorldActionEvent.EventName;
  readonly occurrenceTime = new Date();
}
```

And our `ActionInterpreter`:
``` typescript
class HelloWorldActionInterpreter extends ActionInterpreter
{
  constructor(eventBus: EventBus)
  {
    super(eventBus);
  }

  public activate(): void
  {
    super.activate();

    // add event listener to keydown event
    document.addEventListener("keydown", this.keydownEventListener);
  }

  public deactivate(): void
  {
    super.deactivate();

    // remove event listener for keydown event
    document.removeEventListener("keydown", this.keydownEventListener)
  }

  private keydownEventListener = (): void =>
  {
    // publish our ActionEvent on every key press
    super.publishEvent(new HelloWorldActionEvent())
  }
}
```
And second an `ActionSystem` which handles the `ActionEvent` and manipulates the `Components` of some `Entities`.  
All we want to do is to change from one `Scene` to another:
``` typescript
class HelloWorldActionSystem extends ActionSystem
{
  private game: Game;
  private currentSceneId: number;
  private nextSceneId: number;

  constructor(
    currentSceneId: number, nextSceneId: number,
    game: Game, eventBus: EventBus)
  {
    super(
      [],
      // the action event we care about
      [HelloWorldActionEvent.EventName],
      eventBus)
    this.game = game;

    // the scene we want to deactivate...
    this.currentSceneId = currentSceneId;
    // and the scene we want to switch to
    this.nextSceneId = nextSceneId;
  }

  protected processEvent(
    _deltaTime: number,
    _components: Component[],
    _actionEvent: ActionEvent): void
  {
    // deactivate scene via game object by id
    this.game.deactivateScene(this.currentSceneId);
    // activate scene via game object by id
    this.game.activateScene(this.nextSceneId);
  }
}
```

Done! Almost.. few lines need to be added in our `Scene` class.  
We need to create and register our `ActionInterpreter` and `ActionSystem`:

``` typescript
class HelloWorldScene extends SceneBase
{
  constructor(
    sceneId: number,
    nextSceneId: number,
    personId: number, personName: string,
    game: Game,
    eventBus: EventBus)
  {
    super(sceneId, eventBus);

    let person = HelloWorldEntityFactory.create(personId, personName);
    let system = new HelloWorldSystem(eventBus);
    system.registerEntity(person);
    this.addProp(system);

    // define the action system
    let actionSystem = new HelloWorldActionSystem(
      sceneId, nextSceneId,
      game, eventBus);
    // register entity to system (workaround)
    actionSystem.registerEntity(new Entity(999));
    // add a hello world action system to the scene
    this.addProp(actionSystem);

    // define action interpreter
    let actionInterpreter = new HelloWorldActionInterpreter(eventBus);
    // add hello world actiton interpreter
    this.addProp(actionInterpreter)
  }
}
```
