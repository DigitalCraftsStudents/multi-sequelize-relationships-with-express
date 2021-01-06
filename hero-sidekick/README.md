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
