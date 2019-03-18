/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part2
{

  export class HelloWorldComponent extends Component
  {
    // the entity describing attribute
    public name: string;
  }

  export class HelloWorldEntityFactory
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
}
