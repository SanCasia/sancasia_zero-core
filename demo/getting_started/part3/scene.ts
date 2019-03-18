/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part3
{
  export class HelloWorldScene extends SceneBase
  {
    constructor(
      sceneId: number,
      personId: number, personName: string,
      eventBus: EventBus)
    {
      super(sceneId, eventBus);

      // create the entity
      let person = HelloWorldEntityFactory.create(personId, personName);

      // define the system
      let system = new HelloWorldSystem(eventBus);
      // register an entity in a system
      system.registerEntity(person);

      // add a hello world system to the scene
      this.addProp(system);
    }
  }
}
