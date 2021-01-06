# Hero & Sidekicks

This is an example of a "one to one" relationship.

## Qeustions

### How do I know which model to put the foreign key on?

Ask yourself: which side of the relationship is standalone? Which side is dependent on the other?

In this example, the Sidekick is dependent on the Hero.
Therefore, the Sidekick will have a foreign key to Hero.

## Generating the models

```sh
npx sequelize model:generate --name Hero --attributes name:string
npx sequelize model:generate --name Sidekick --attributes name:string,heroId:integer
```

## Setting the FK

### `models/sidekick.js`

Tell Sequelize more about that `heroId` field.

It's not just an integer, it's an integer that points to a specific Hero in the Hero table.

```js
  Sidekick.init({
      name: DataTypes.STRING,
      heroId: {
          type: DataTypes.INTEGER,
          references: {
              model: 'Hero',
              key: 'id'
          }
      }
  }, {
    sequelize,
    modelName: 'Sidekick',
  });
```

## Setting the association

### `models/hero.js`

Hero declares that they can have one Sidekick.
Their Sidekick will point to them using the Sidekick's `heroId`.

```js
    static associate(models) {
        // define association here
        Hero.hasOne(models.Sidekick, {
            foreignKey: 'heroId'
        });
    }
```

When you call `Hero.hasOne(models.Sidekick)`, you get these three magic methods on a Hero:

```js
hero.getSidekick()
hero.setSidekick()
hero.createSidekick()
```

### `models/sidekick.js`

```js
    static associate(models) {
        // define association here
        Sidekick.belongsTo(models.Hero, {
            foreignKey: 'heroId'
        });
    }
```

When you call `Sidekick.belongsTo(models.Hero)`, you get these three magic methods on a Sidekick:

```js
sidekick.getHero()
sidekick.setHero()
sidekick.createHero()
```


## Running the migration

```sh
npx sequelize db:migrate
```

## Setting a Hero's Sidekick

This is the code that appears when processing a form
that sets a Hero's Sidekick:

```js
    const { id } = req.params;
    const { sidekickId } = req.body;
    const hero = await Hero.findByPk(id);
    const sidekick = await Sidekick.findByPk(sidekickId);
    // use the "magic method" to associate the specific
    // Hero with the specific Sidekick:
    await hero.setSidekick(sidekick);
    await hero.save(); // save changes to the database
```

### Alternatively, use the IDs directly

Either of these will work:

```js
    const { id } = req.params; // the hero id
    const { sidekickId } = req.body;
    const hero = await Hero.findByPk(id);
    await hero.setSidekick(sidekickId);
    await hero.save(); // save changes to the database
```

Or:

```js
    const { id } = req.params; // the hero id
    const { sidekickId } = req.body;
    const sidekick = await Sidekick.findByPk(sidekickId);
    await sidekick.setHero(id);
    await sidekick.save(); // save changes to the database
```

## Loading a Hero, including their Sidekick

### One hero

```js
    const hero = await Hero.findByPk(1, {
        include: Sidekick,
    });
```


### All heroes

```js
    const heroes = await Hero.findAll({
        include: Sidekick,
    });
```



## (Optional) Customizing the model name

- Change the string in the migration (from 'Heros' to 'Heroes').
- Add a `tableName: 'Employees' to `Hero.init()`

```js
  Hero.init({
    name: DataTypes.STRING
  }, {
      sequelize,
      modelName: 'Hero',
      tableName: 'Heroes',
  });
```


