let socket;

Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerModule("show-actors-to-players");
  socket.register("showActor", showActor);
});

async function showActor(actorId) {
  
  let actor = game.actors.get(actorId)
  if (actor.ownership.default > 0 || actor.ownership[game.userId] > 0) {

    actor.sheet.render(true);

  }
  
}

Hooks.on('renderActorSheet', (app, html, data) => {
  const header = html.find('.window-header');
  const tooltipText = "Show to players";

  let buttonElement = $(`
    <a class="header-button control journal" data-tooltip="${tooltipText}">
      <i class="fas fa-eye"></i>
    </a>
  `);

  header.children().last().before(buttonElement);

  buttonElement.on('click', async (e) => {

    e.preventDefault();

    let actorSheet = game.actors.get(app.actor.id);
    if (actorSheet.ownership.default < 1) {

      newOwnership = actorSheet.ownership;
      newOwnership.default = 1;
      await actorSheet.update({ownership: newOwnership});

    }

    socket.executeForEveryone("showActor", app.actor.id);

  });

});