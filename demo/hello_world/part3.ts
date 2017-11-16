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
    public processEntity(deltaTime: number, [component]: [HelloWorldComponent])
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
  }
}
