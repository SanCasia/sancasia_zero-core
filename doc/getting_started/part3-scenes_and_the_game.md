# Part 3: Scenes and the Game
So far we looked at the `Engine`, `Entities` and `Components` and even had a brief introduction to factories.
That's nice and all but what if our game plays in different `Scenes`?

`Scenes` are a powerful tool to organise our game into separate manageable modules. They encapsulate the initialisation of `Systems` and `Entities` as well as there activation and continuity.

For changing the `Scene` it is recommended to utilize the game object. It implements and hides the necessary logic and offers an interface for most of the things you will need to do, including the handling of systems and entities.  
We can move a lot of code from our main function to our new `Scene`
``` typescript
class HelloWorldScene extends SceneBase
{
  constructor(
    sceneId: number,
    personId: number, personName: string,
    eventBus: EventBus)
  {
    super(sceneId, eventBus);

    // create the entity
    let person = HelloWorldEntityFactory.create(personId, personName);

    // define the frist system
    let system = new HelloWorldSystem(eventBus);
    // register an entity in a system
    system.registerEntity(person);

    // add a hello world system to the scene
    this.addProp(system);
  }
}
```
Since a game has potentially dozens of `Scenes` the usage of an organising component makes a lot of sense. The `Game` object handles the activation of `Scenes` and also encapsulates the creation of the always needed game engine.
``` typescript
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
```

With this we now have two distinct `Scenes` in our example. The only issue being that we cannot currently switch between them. In the next part we will integrate user interactions to demonstrate a possible solution.
