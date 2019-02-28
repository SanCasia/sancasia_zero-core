/// <reference path="../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part3
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
    public processEntity(_deltaTime: number, [component]: [HelloWorldComponent])
    {
      // log "hello world" to the console
      console.log(`Hello ${ component.name }!`)
    }
  }


  export class Part3
  {
    public static main()
    {
      // create the new game object
      // this is initializing a new event bus as well as a new engine
      let game = new Game();
      let eventBus = game.getEventBus();

      let ellasId = 0;
      let ellasSceneId = 0;
      let ellasName = "Ella";
      // define the first scene
      // scene base suffice for this example
      let ellasScene = new SceneBase(ellasSceneId, eventBus);
      game.addScene(ellasScene);
      // define the first system
      let ellasSystem = new HelloWorldSystem(eventBus)
      // add a system to the scene
      ellasScene.addProp(ellasSystem);
      // register an entity in a system
      ellasSystem.registerEntity(
        HelloWorldEntityFactory.create(ellasId, ellasName));

      let stevesId = 1;
      let stevesSceneId = 1;
      let stevesName = "Steve"
      // define the first scene
      // scene base suffice for this example
      let stevesScene = new SceneBase(stevesSceneId, eventBus);
      game.addScene(stevesScene);
      // define the first system
      let stevesSystem = new HelloWorldSystem(eventBus)
      // add a system to the scene
      stevesScene.addProp(stevesSystem);
      // register an entity in a system
      stevesSystem.registerEntity(
        HelloWorldEntityFactory.create(stevesId, stevesName));

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
  }
}
