/// <reference path="../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part4
{

  class HelloWorldComponent extends Component
  {
    public name: string;
  }

  class HelloWorldEntityFactory
  {
    public static create(id: number, name: string): Entity
    {
      let entity = new Entity(id);
      let component = new HelloWorldComponent();
      component.name = name;
      entity.addComponent(component);

      return entity;
    }
  }

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
    public processEntity(
      _deltaTime: number,
      [component]: [HelloWorldComponent])
    {
      // log "hello world" to the console
      console.log(`Hello ${ component.name }!`)
    }
  }

  class HelloWorldActionEvent implements ActionEvent
  {
    static EventName = "ACTION_EVENT::HELLO_WORLD";
    readonly name = HelloWorldActionEvent.EventName;
    readonly occurrenceTime = new Date();
  }

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
      super.publishEvent(new HelloWorldActionEvent())
    }
  }

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
        [HelloWorldComponent],
        [HelloWorldActionEvent.EventName],
        eventBus)
      this.game = game;

      this.currentSceneId = currentSceneId;
      this.nextSceneId = nextSceneId;
    }

    protected processEntity(
      _deltaTime: number,
      _components: Component[],
      _actionEvent: ActionEvent): void
    {
      this.game.deactivateScene(this.currentSceneId);
      this.game.activateScene(this.nextSceneId);
    }
  }

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

      // create the entity
      let person = HelloWorldEntityFactory.create(personId, personName);

      // define the frist system
      let system = new HelloWorldSystem(eventBus);
      // register an entity in a system
      system.registerEntity(person);

      // define the action system
      let actionSystem = new HelloWorldActionSystem(
        sceneId, nextSceneId,
        game, eventBus);

      // register entity to system (workaround)
      actionSystem.registerEntity(person);

      // add a hello world system to the scene
      this.addProp(system);
      // add a hello world action system to the scene
      this.addProp(actionSystem);
      // add a hello world actiton interpreter
      this.addProp(new HelloWorldActionInterpreter(eventBus))
    }
  }


  export class Part4
  {
    public static main()
    {
      // create the new game object
      // this is initializing a new event bus as well as a new engine
      let game = new Game();
      let eventBus = game.getEventBus();

      // define ella and steve
      // ella:
      let ellasId = 0;
      let ellasSceneId = 0;
      let ellasName = "Ella"
      // steve:
      let stevesId = 1;
      let stevesSceneId = 1;
      let stevesName = "Steve"

      // create the first scene
      let ellasScene = new HelloWorldScene(
        ellasSceneId, stevesSceneId,
        ellasId, ellasName,
        game, eventBus)
      // register the scene in the game
      game.addScene(ellasScene);


      // create the second scene
      let stevesScene = new HelloWorldScene(
        stevesSceneId, ellasSceneId,
        stevesId, stevesName,
        game, eventBus)
      game.addScene(stevesScene);

      // starting the game
      game.start();
      // activating the first scene, Ellas scene
      game.activateScene(ellasSceneId);
    }
  }
}
