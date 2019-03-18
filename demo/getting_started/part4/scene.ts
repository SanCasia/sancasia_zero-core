/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part4
{
  export class HelloWorldScene extends SceneBase
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

}
