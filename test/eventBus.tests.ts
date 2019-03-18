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
      let callCount = 0;

      let handlerOne = (isTrue: boolean) =>
      {
        if(isTrue)
          callCount++;
      }

      let handlerTwo = (isTrue: boolean) =>
      {
        if(isTrue)
          callCount++;
      }

      bus.subscribe(
        event,
        handlerOne);

      bus.subscribe(
        event,
        handlerTwo);

      bus.publish(event, true)

      if(callCount != 2)
      {
        throw new Error("functions were not called correctly");
      }
    }
  }
}
