/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  export class EventBusTests
  {
    public static canRegisterHandler()
    {
      let bus = new EventBus();
      let event = "test_event";
      let handler = (message: any) =>
      {
        console.log(message);
      }

      bus.subscribe(
        event,
        handler);

      // @ts-ignore: Property 'subscribers' is private and only accessible within class 'EventBus'.
      if(!bus.subscribers.has(event))
      {
        throw new Error("event not registered");
      }

      // @ts-ignore: Property 'subscribers' is private and only accessible within class 'EventBus'.
      if(bus.subscribers.get(event).indexOf(handler) == -1)
      {
        throw new Error("handler not registered");
      }

    }

    public static canUnregisterHandler()
    {
      let bus = new EventBus();
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

      // @ts-ignore: Property 'subscribers' is private and only accessible within class 'EventBus'.
      if(!bus.subscribers.get(event).indexOf(handler) == -1)
      {
        throw new Error("handler not unregistered");
      }
    }

    public static canSendAndReciveEvent()
    {
      let bus = new EventBus();
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
