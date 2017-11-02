/// <reference path="../obj/sancasia_zero_core" />


namespace sczCore.tests
{
  export class EventBusTests
  {
    public canRegisterHandler()
    {
      let bus = new sczCore.EventBus();
      let event = "test_event";
      let handler = (message: any) =>
      {
        console.log(message);
      }

      bus.subscribe(
        event,
        handler);

      if(!bus.subscribers.has(event))
      {
        throw new Error("event not registered");
      }
      if(bus.subscribers.get(event).indexOf(handler) == -1)
      {
        throw new Error("handler not registered");
      }

    }

    public canUnregisterHandler()
    {
      let bus = new sczCore.EventBus();
      let event = "test_event";
      let handler = (message: any) =>
      {
        console.log(message);
      }

      bus.subscribe(
        event,
        handler);

      bus.unsubscribe(
        event,
        handler);


      if(!bus.subscribers.get(event).indexOf(handler) == -1)
      {
        throw new Error("handler not unregistered");
      }
    }

    public canSendAndReciveEvent()
    {
      let bus = new sczCore.EventBus();
      let event = "test_event";
      let wasCalled = false;
      let handler = (correctParam: boolean) =>
      {
        wasCalled = correctParam;
      }

      bus.subscribe(
        event,
        handler);

      bus.publish(event, true)

      if(!wasCalled)
      {
        throw new Error("function was not called correctly");
      }
    }
  }
}
