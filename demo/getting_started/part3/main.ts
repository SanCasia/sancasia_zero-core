/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part3
{

  export class Part3
  {
    public static main()
    {
      // create the new game object
      // this is initializing a new event bus as well as a new engine
      let game = new Game();
      let eventBus = game.getEventBus();

      let ellasId = 0;
      let ellasSceneId = 0;
      let ellasName = "Ella";
      // define the first scene
      let ellasScene = new HelloWorldScene(
        ellasSceneId,
        ellasId, ellasName,
        eventBus);
      game.addScene(ellasScene);

      let stevesId = 1;
      let stevesSceneId = 1;
      let stevesName = "Steve"
      // define the second scene
      let stevesScene = new HelloWorldScene(
        stevesSceneId,
        stevesId, stevesName,
        eventBus);
      game.addScene(stevesScene);

      // starting the game
      game.start();
      // activating the first scene, Ellas scene
      game.activateScene(ellasSceneId);
    }
  }
}
