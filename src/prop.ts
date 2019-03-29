namespace sczCore
{
  export interface Prop
  {
    activate(): void;
    deactivate(): void;
    readonly isActive: boolean;
  }

  export abstract class PropBase implements Prop
  {
    private _isActive: boolean;
    protected readonly eventbus: sczCore.EventBus;
    protected readonly event: sczCore.EngineEvent;

    public get isActive(): boolean
    {
      return this._isActive;
    }

    constructor(
      eventbus: sczCore.EventBus,
      event: sczCore.EngineEvent
    )
    {
      if(eventbus == null)
      {
        throw new Error("event bus must not be null");
      }

      this.eventbus = eventbus;
      this.event = event;
    }

    public activate(): void
    {
      this.eventbus.subscribe(this.event, this._process);
      this._isActive = true;
    }

    public deactivate(): void
    {
      this.eventbus.unsubscribe(this.event, this._process);
      this._isActive = false;
    }

    // workaround for "fat arrow is member function"
    protected _process = (object: any) => {this.process(object);}

    abstract process(object: any): void;

  }
}
