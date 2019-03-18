/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestActionEvent implements ActionEvent
  {
    public static Name = "ACTION_EVENT::TEST_ACTION_EVENT";
    name = TestActionEvent.Name;
    occurrenceTime = new Date();
    public testValue: string;
  }

  class TestComponent extends Component
  {
    public testValue: string;
  }

  class TestActionSystem extends ActionSystem
  {
    public static readonly event = EngineEvent.Computation;

    constructor(eventBus: EventBus)
    {
      super(
        [TestComponent],
        [TestActionEvent.Name],
        eventBus);
    }

    public queueEventDelegate(actionEvent: ActionEvent)
    {
      this.queueEvent(actionEvent);
    }

    processEvent(
      _: number,
      [component]: [TestComponent],
      actionEvent: TestActionEvent)
    {
      component.testValue = actionEvent.testValue;
    }
  }

  export class ActionSystemTests
  {

    public static canProcessEvents()
    {
      let eventBus = new EventBus();
      let actionSystem = new TestActionSystem(eventBus);

      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);
      actionSystem.registerEntity(entity);

      let event = new TestActionEvent();
      event.testValue = "3.141";

      actionSystem.activate();
      actionSystem.queueEventDelegate(event);
      actionSystem.process(0);


      component = <TestComponent>entity.getComponent(TestComponent);
      if(component.testValue != event.testValue)
      {
        throw new Error(`component value not modified (${component.testValue} vs ${event.testValue})`);
      }
    }

    public static canHandleActionEvents()
    {
      let eventBus = new EventBus();
      let actionSystem = new TestActionSystem(eventBus);
      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);
      actionSystem.registerEntity(entity);
      let event = new TestActionEvent();
      event.testValue = "3.141";

      actionSystem.activate();

      eventBus.publish(TestActionEvent.Name, event);
      eventBus.publish(EngineEvent.Computation, 0);

      component = <TestComponent>entity.getComponent(TestComponent);
      if(component.testValue != event.testValue)
      {
        throw new Error(`component value not modified (${component.testValue} vs ${event.testValue})`);
      }

    }

    public static canBeDeactivated()
    {
      let eventBus = new EventBus();
      let actionSystem = new TestActionSystem(eventBus);
      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);
      actionSystem.registerEntity(entity);
      let event = new TestActionEvent();
      event.testValue = "3.141";

      actionSystem.activate();
      actionSystem.deactivate();

      eventBus.publish(TestActionEvent.Name, event);
      eventBus.publish(EngineEvent.Computation, 0);

      component = <TestComponent>entity.getComponent(TestComponent);
      if(component.testValue == event.testValue)
      {
        throw new Error("component value modified after deactivation");
      }
    }
  }
}
