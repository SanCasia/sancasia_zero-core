/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestActionEvent implements ActionEvent
  {
    public static Name = "ACTION_EVENT::TEST_ACTION_EVENT";
    name = TestActionEvent.Name;
    occurrenceTime = new Date();
  }

  class TestInterpreter extends ActionInterpreter
  {
    public publishEventDelegate(actionEvent: ActionEvent)
    {
      this.publishEvent(actionEvent);
    }
  }

  export class ActionInterpreterTests
  {
    public static canActivate()
    {
      let eventBus = new EventBus();
      let interpreter = new TestInterpreter(eventBus);

      if(interpreter.isActive)
      {
        throw new Error("interpreter activated system early");
      }

      interpreter.activate();

      if(!interpreter.isActive)
      {
        throw new Error("interpreter did not activate system");
      }
    }

    public static canDeactivate()
    {
      let eventBus = new EventBus();
      let interpreter = new TestInterpreter(eventBus);

      if(interpreter.isActive)
      {
        throw new Error("interpreter activated system early");
      }

      interpreter.activate();
      interpreter.deactivate();

      if(interpreter.isActive)
      {
        throw new Error("interpreter did not deactivate system");
      }
    }

    public static canPublishEvent()
    {
      let eventBus = new EventBus();
      let interpreter = new TestInterpreter(eventBus);
      let actionEvent = new TestActionEvent();
      let wasPublished = false;

      eventBus.subscribe(TestActionEvent.Name, (event) => {
        wasPublished = true;
        if(event != actionEvent)
        {
          throw new Error("action event not published correctly");
        }
      });

      interpreter.publishEventDelegate(actionEvent);
      if(!wasPublished)
      {
        throw new Error("aciton event not published");
      }
    }


  }
}
