namespace sczCore
{
  export interface ActionEvent
  {
    readonly name: string;
    occurrenceTime: Date;

  }

  export abstract class ActionInterpreter implements Prop
  {
    protected eventBus: EventBus;
    protected _isActive: boolean;

    public get isActive(): boolean
    {
      return this._isActive;
    }

    constructor(
      eventBus: EventBus)
    {
      if(eventBus == null)
      {
        throw new Error("event bus must not be null");
      }

      this.eventBus = eventBus;
    }

    public activate(): void
    {
      this._isActive = true;
    }

    public deactivate(): void
    {
      this._isActive = false;
    }

    protected publishEvent(actionEvent: ActionEvent): void
    {
      this.eventBus.publish(actionEvent.name, actionEvent)
    }
  }
}
