/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part4
{
  export class HelloWorldActionEvent implements ActionEvent
  {
    // workaround
    static EventName = "ACTION_EVENT::HELLO_WORLD";
    readonly name = HelloWorldActionEvent.EventName;
    readonly occurrenceTime = new Date();
  }

  export class HelloWorldActionSystem extends ActionSystem
  {
    private game: Game;
    private currentSceneId: number;
    private nextSceneId: number;

    constructor(
      currentSceneId: number, nextSceneId: number,
      game: Game, eventBus: EventBus)
    {
      super(
        [],
        // the action event we care about
        [HelloWorldActionEvent.EventName],
        eventBus)
      this.game = game;

      // the scene we want to deactivate...
      this.currentSceneId = currentSceneId;
      // and the scene we want to switch to
      this.nextSceneId = nextSceneId;
    }

    protected processEvent(
      _deltaTime: number,
      _components: Component[],
      _actionEvent: ActionEvent): void
    {
      // deactivate scene via game object by id
      this.game.deactivateScene(this.currentSceneId);
      // activate scene via game object by id
      this.game.activateScene(this.nextSceneId);
    }
  }
}
