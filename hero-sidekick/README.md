# Hero & Sidekicks

## Generating the models

```sh
npx sequelize model:generate --name Hero --attributes name:string
npx sequelize model:generate --name Sidekick --attributes name:string,heroId:integer
```

## Setting the FK

### `models/sidekick.js`

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

```
    static associate(models) {
        // define association here
        Hero.hasOne(models.Sidekick, {
            foreignKey: 'heroId'
        });
    }
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

## Running the migration

```sh
npx sequelize db:migrate
```

## Setting a Hero's Sidekick

```js
    const hero = await Hero.findByPk(id);
    const sidekick = await Sidekick.findByPk(sidekickId);

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

## 
