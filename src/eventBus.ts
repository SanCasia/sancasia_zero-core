namespace sczCore
{
  export class EventBus
  {
    private subscribers: Map<string, Array<((message: any) => void)>>;

    public constructor()
    {
      this.subscribers = new Map<string, ((message: any) => void)[]>();
    }

    public subscribe(event: string, handler: ((message: any) => void))
    {
      if(event == null)
      {
        throw new Error("event must not be null (can be empty string)");
      }
      if(handler == null)
      {
        throw new Error("handler must not be null");
      }

      if(!this.subscribers.has(event))
      {
        this.subscribers.set(event, new Array<((message: any) => void)>());
      }
      let subscribers = this.subscribers.get(event);
      subscribers.push(handler);
    }

    public publish(event: string, message: any)
    {
      if(event == null)
      {
        throw new Error("event must not be null (can be empty string)");
      }
      if(this.subscribers.has(event))
      {
        for(let handler of this.subscribers.get(event))
        {
          handler(message);
        }
      }
      if(event != "")
      {
          this.publish("", message);
      }
    }

    public unsubscribe(event: string, handler: ((message: any) => void))
    {
      if(event == null)
      {
        throw new Error("event must not be null (can be empty string)");
      }
      if(handler == null)
      {
        throw new Error("handler must not be null");
      }
      if(!this.subscribers.has(event))
      {
        throw new Error("handler is not registered");
      }

      let subscribers = this.subscribers.get(event);
      let index = subscribers.indexOf(handler);
      if (index == -1)
      {
        throw new Error("handler is not registered");
      }

      subscribers.splice(index);
    }
  }
}
