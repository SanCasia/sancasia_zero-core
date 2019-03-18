/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part3
{
  export class HelloWorldComponent extends Component
  {
    public name: string;
  }

  export class HelloWorldEntityFactory
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
}
