/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part4
{
  export class HelloWorldActionInterpreter extends ActionInterpreter
  {
    constructor(eventBus: EventBus)
    {
      super(eventBus);
    }

    public activate(): void
    {
      super.activate();

      // add event listener to keydown event
      document.addEventListener("keydown", this.keydownEventListener);
    }

    public deactivate(): void
    {
      super.deactivate();

      // remove event listener for keydown event
      document.removeEventListener("keydown", this.keydownEventListener)
    }

    private keydownEventListener = (): void =>
    {
      // publish our ActionEvent on every key press
      super.publishEvent(new HelloWorldActionEvent())
    }
  }
}
