/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part4
{

  export class Part4
  {
    public static main()
    {
      let game = new Game();
      let eventBus = game.getEventBus();

      // define ella and steve
      // ella:
      let ellasId = 0;
      let ellasSceneId = 0;
      let ellasName = "Ella"
      // steve:
      let stevesId = 1;
      let stevesSceneId = 1;
      let stevesName = "Steve"

      let ellasScene = new HelloWorldScene(
        ellasSceneId, stevesSceneId,
        ellasId, ellasName,
        game, eventBus)
      game.addScene(ellasScene);

      let stevesScene = new HelloWorldScene(
        stevesSceneId, ellasSceneId,
        stevesId, stevesName,
        game, eventBus)
      game.addScene(stevesScene);

      game.start();
      game.activateScene(ellasSceneId);
    }
  }
}
