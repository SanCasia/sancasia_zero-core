namespace sczCore
{
  export interface ActionEvent
  {
    readonly name: string;
    occurrenceTime: Date;

  }

  export abstract class ActionInterpreter
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
